#!/usr/bin/env bash
# Sauvegarde complète : base de données Supabase + PDF du bucket "factures".
#
# Prérequis : pg_dump/psql (macOS : brew install libpq), Node 20+.
# Dans .env.local (non commité), ajouter l'URL "Session pooler" de
# Connect > Direct > Session pooler :
#   SUPABASE_DB_URL=postgresql://postgres.xxxx:MOTDEPASSE@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
#
# Usage : ./scripts/backup.sh [dossier]   (défaut : ~/Backups/ovni-compta)
# Résultat : <dossier>/AAAA-MM-JJ_HHMM.tar.gz ; les archives de plus de
# KEEP_DAYS jours (défaut 7) sont supprimées.
#
# Restauration (dans cet ordre) : schema.sql, data.sql, auth_triggers.sql,
# puis renvoyer les PDF de factures/ dans le bucket.
set -euo pipefail

# Homebrew (libpq est "keg-only") : utile quand le script est lancé par launchd
export PATH="/opt/homebrew/opt/libpq/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

cd "$(dirname "$0")/.."

SUPABASE_DB_URL="${SUPABASE_DB_URL:-$(grep -E '^SUPABASE_DB_URL=' .env.local | cut -d= -f2- | tr -d "\"'" || true)}"
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "SUPABASE_DB_URL manquant dans .env.local" >&2
  exit 1
fi

BACKUP_ROOT="${1:-$HOME/Backups/ovni-compta}"
KEEP_DAYS="${KEEP_DAYS:-7}"
NAME="$(date +%F_%H%M)"
DEST="$BACKUP_ROOT/$NAME"
mkdir -p "$DEST"

echo "$(date '+%F %T') Début de la sauvegarde"

echo "→ Structure (extensions + schéma public)"
{
  psql "$SUPABASE_DB_URL" -X -q -At -v ON_ERROR_STOP=1 -c "
    select format('CREATE EXTENSION IF NOT EXISTS %I WITH SCHEMA %I;', e.extname, n.nspname)
    from pg_extension e join pg_namespace n on n.oid = e.extnamespace
    where e.extname <> 'plpgsql'
    order by e.extname"
  # Retire ce qui existe déjà / est réservé à Supabase (refusé à la restauration)
  pg_dump "$SUPABASE_DB_URL" --schema-only --schema=public --quote-all-identifiers \
    | sed -E '/^CREATE SCHEMA "public";$/d;
              /^ALTER SCHEMA "public" OWNER TO /d;
              /^COMMENT ON SCHEMA "public" IS /d;
              /^ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin"/d'
} > "$DEST/schema.sql"

echo "→ Données (public + comptes utilisateurs)"
# session_replication_role = replica : désactive triggers et contraintes
# pendant l'import (dépendance circulaire transactions <-> transferts).
{
  echo "SET session_replication_role = replica;"
  pg_dump "$SUPABASE_DB_URL" --data-only --quote-all-identifiers \
    --table='public.*' --table=auth.users --table=auth.identities
  echo "SET session_replication_role = origin;"
} > "$DEST/data.sql"

echo "→ Triggers sur auth.users"
# Exclus du schéma public, mais indispensables (inscriptions autorisées,
# création de profil...). À appliquer après data.sql.
psql "$SUPABASE_DB_URL" -X -q -At -v ON_ERROR_STOP=1 -c "
  select format('DROP TRIGGER IF EXISTS %I ON auth.users;', t.tgname) || chr(10)
         || pg_get_triggerdef(t.oid) || ';'
  from pg_trigger t
  where t.tgrelid = 'auth.users'::regclass and not t.tgisinternal
  order by t.tgname" > "$DEST/auth_triggers.sql"
if [ ! -s "$DEST/auth_triggers.sql" ]; then
  echo "Aucun trigger trouvé sur auth.users" >&2
  exit 1
fi

echo "→ Fichiers des factures"
node --env-file=.env.local scripts/backup-storage.mjs "$DEST/factures"

echo "→ Compression"
tar -czf "$BACKUP_ROOT/$NAME.tar.gz" -C "$BACKUP_ROOT" "$NAME"
rm -rf "$DEST"

echo "→ Suppression des archives de plus de $KEEP_DAYS jours"
find "$BACKUP_ROOT" -maxdepth 1 -name '*.tar.gz' -mtime +"$KEEP_DAYS" -print -delete

echo "$(date '+%F %T') Sauvegarde terminée : $BACKUP_ROOT/$NAME.tar.gz"
