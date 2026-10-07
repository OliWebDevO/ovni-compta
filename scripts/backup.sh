#!/usr/bin/env bash
# Sauvegarde complète : base de données Supabase + PDF du bucket "factures".
#
# Prérequis : Supabase CLI, Docker (lancé), Node 20+.
# Dans .env.local (non commité), ajouter l'URL "Session pooler" de
# Project Settings > Database > Connection string :
#   SUPABASE_DB_URL=postgresql://postgres.xxxx:MOTDEPASSE@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
#
# Usage : ./scripts/backup.sh [dossier]   (défaut : ~/Backups/ovni-compta)
# Résultat : <dossier>/AAAA-MM-JJ_HHMM.tar.gz
set -euo pipefail

cd "$(dirname "$0")/.."

SUPABASE_DB_URL="${SUPABASE_DB_URL:-$(grep -E '^SUPABASE_DB_URL=' .env.local | cut -d= -f2- | tr -d "\"'" || true)}"
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "SUPABASE_DB_URL manquant dans .env.local" >&2
  exit 1
fi

BACKUP_ROOT="${1:-$HOME/Backups/ovni-compta}"
NAME="$(date +%F_%H%M)"
DEST="$BACKUP_ROOT/$NAME"
mkdir -p "$DEST"

echo "→ Base de données"
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$DEST/roles.sql" --role-only
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$DEST/schema.sql"
supabase db dump --db-url "$SUPABASE_DB_URL" -f "$DEST/data.sql" --data-only --use-copy

# Triggers sur auth.users (inscriptions autorisées, création de profil...) :
# exclus par "db dump" car le schéma auth est géré par Supabase.
supabase db query --db-url "$SUPABASE_DB_URL" -o json "
  select format('DROP TRIGGER IF EXISTS %I ON auth.users;', t.tgname) || chr(10)
         || pg_get_triggerdef(t.oid) || ';' as def
  from pg_trigger t
  where t.tgrelid = 'auth.users'::regclass and not t.tgisinternal
  order by t.tgname" 2>/dev/null \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const rows=JSON.parse(s).rows;if(!rows.length)throw new Error("Aucun trigger trouvé sur auth.users");console.log(rows.map(r=>r.def).join("\n\n"))})' \
  > "$DEST/auth_triggers.sql"

echo "→ Fichiers des factures"
node --env-file=.env.local scripts/backup-storage.mjs "$DEST/factures"

echo "→ Compression"
tar -czf "$BACKUP_ROOT/$NAME.tar.gz" -C "$BACKUP_ROOT" "$NAME"
rm -rf "$DEST"

echo "Sauvegarde terminée : $BACKUP_ROOT/$NAME.tar.gz"
