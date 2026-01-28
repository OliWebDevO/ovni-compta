# Plan de mise en oeuvre - O.V.N.I Compta

## Vue d'ensemble

```
Phase 1          Phase 2          Phase 3           Phase 4          Phase 5         Phase 6
Supabase    -->  Resend      -->  Config .env   -->  Migration   -->  Premier     --> Invitation
Projet           Email            + Deploy local     Google Sheets    Compte (test)   Admins réels
                                                                      Oliver          Maïa & Geoffrey
```

---

## Phase 1 - Création du projet Supabase

### 1.1 Créer le projet

1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Cliquer **New project**
3. Remplir :
   - **Name** : `ovni-compta`
   - **Database Password** : générer un mot de passe fort (le noter quelque part de sûr)
   - **Region** : `West EU (Ireland)` (le plus proche de la Belgique)
   - **Plan** : Free tier suffit pour commencer
4. Attendre que le projet soit provisionné (~2 min)

### 1.2 Récupérer les clés

1. Aller dans **Project Settings > API**
2. Noter :
   - `Project URL` --> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key --> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key --> `SUPABASE_SERVICE_ROLE_KEY` (optionnel, pour opérations admin côté serveur)

### 1.3 Appliquer les migrations (base de données)

Deux options :

**Option A : Via Supabase CLI (recommandé)**

```bash
# Installer le CLI si pas encore fait
brew install supabase/tap/supabase

# Se connecter
supabase login

# Lier au projet distant
supabase link --project-ref <project-ref>
# Le project-ref se trouve dans l'URL du dashboard : supabase.com/dashboard/project/<project-ref>

# Appliquer toutes les migrations
supabase db push
```

**Option B : Via le SQL Editor (manuel)**

Dans le dashboard Supabase > **SQL Editor**, exécuter les fichiers dans cet ordre exact :

| Ordre | Fichier | Contenu |
|-------|---------|---------|
| 1 | `20250128000000_initial_schema.sql` | Tables, ENUMs, RLS, vues, triggers |
| 2 | `20250128000001_invite_system.sql` | Système d'invitation, `allowed_emails`, trigger `handle_new_user` |
| 3 | `20250128000002_seed_data.sql` | Artistes (9), projets (5), fonctions helper, vue `invitations_status` |
| 4 | `20250128000003_projet_artistes.sql` | Table `projet_artistes`, liaisons artistes/projets |
| 5 | `20250128000004_admin_test_oliver.sql` | Invitation admin test (Oliver) |

Copier-coller chaque fichier depuis `supabase/migrations/` dans le SQL Editor et exécuter un par un.

### 1.4 Vérifier la base de données

Dans **Table Editor**, vérifier que ces tables existent :

- [ ] `profiles`
- [ ] `artistes` (9 entrées : Maïa, Geoffrey, Camille, Iris, Emma, Greta, Jul, Léa, Lou)
- [ ] `projets` (5 entrées : GEO, LE TALU, LVLR, Wireless People, Poema)
- [ ] `transactions` (vide pour l'instant)
- [ ] `transferts` (vide)
- [ ] `ressources` (vide)
- [ ] `projet_artistes` (4 liaisons seed)
- [ ] `allowed_emails` (1 entrée : oliver-vdb@hotmail.com)

### 1.5 Configurer l'authentification Supabase

1. Aller dans **Authentication > Providers**
2. Vérifier que **Email** est activé
3. Aller dans **Authentication > URL Configuration**
4. Configurer :
   - **Site URL** : `http://localhost:3000` (dev) ou l'URL de production
   - **Redirect URLs** : ajouter `http://localhost:3000/**`

5. (Optionnel) Aller dans **Authentication > Email Templates**
   - Personnaliser le template de confirmation email en français si souhaité

---

## Phase 2 - Configuration Resend (service email)

### 2.1 Créer le compte Resend

1. Aller sur [resend.com](https://resend.com)
2. Créer un compte (gratuit : 100 emails/jour, 3000/mois)
3. Aller dans **API Keys**
4. Créer une clé API, la noter --> `RESEND_API_KEY`

### 2.2 (Optionnel) Configurer un domaine personnalisé

Par défaut, les emails sont envoyés depuis `onboarding@resend.dev` (suffisant pour tester).

Pour un domaine personnalisé (ex: `compta@ovni-asbl.be`) :

1. Aller dans **Domains** sur Resend
2. Ajouter le domaine (ex: `ovni-asbl.be`)
3. Configurer les records DNS indiqués par Resend (SPF, DKIM, DMARC)
4. Attendre la vérification (~quelques minutes à quelques heures)
5. Mettre à jour la variable d'env :
   ```
   RESEND_FROM_EMAIL=O.V.N.I Compta <compta@ovni-asbl.be>
   ```

---

## Phase 3 - Configuration locale et déploiement

### 3.1 Créer le fichier .env.local

```bash
cp .env.local.example .env.local
```

Remplir avec les vraies valeurs :

```env
# Supabase (Phase 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Resend (Phase 2.1)
RESEND_API_KEY=re_xxxxxxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 Installer les dépendances et lancer

```bash
pnpm install
pnpm dev
```

### 3.3 Vérifier que l'app démarre

- [ ] `http://localhost:3000` --> redirige vers `/login`
- [ ] `/login` affiche le formulaire de connexion
- [ ] `/register` affiche le formulaire d'inscription
- [ ] `/dashboard` redirige vers `/login` (pas encore authentifié)

---

## Phase 4 - Migration des données Google Sheets

### 4.1 Préparer les exports HTML

1. Ouvrir le Google Sheet **"bilan compta O.V.N.I"**
2. Pour **chaque onglet artiste** (Maïa, Geoffrey, Camille, Iris, Emma, Greta, Jul, Léa, Lou) :
   - `Fichier > Télécharger > Page Web (.html)`
   - Renommer le fichier avec le nom exact de l'artiste (ex: `Maïa.html`, `Geoffrey.html`)
3. Pour **chaque onglet projet** (GEO, LE TALU, LVLR, WP, Poema) :
   - Même procédure
   - Noms exacts : `GEO.html`, `LE TALU.html`, `LVLR.html`, `WP.html`, `poema.html`
4. Pour **chaque bilan annuel** (2021-2026 si existants) :
   - Noms : `2021.html`, `2022.html`, etc.

### 4.2 Placer les fichiers

```
ovni-compta/
├── bilan compta O.V.N.I/
│   ├── Maïa.html
│   ├── Geoffrey.html
│   ├── Camille.html
│   ├── Iris.html
│   ├── Emma.html
│   ├── Greta.html
│   ├── Jul.html
│   ├── Léa.html
│   ├── Lou.html
│   ├── GEO.html
│   ├── LE TALU.html
│   ├── LVLR.html
│   ├── WP.html
│   ├── poema.html
│   ├── 2021.html
│   ├── 2022.html
│   ├── 2023.html
│   ├── 2024.html
│   └── 2025.html
```

### 4.3 Installer la dépendance du script

```bash
pnpm add -D cheerio @types/cheerio
```

### 4.4 Exécuter le script d'import

```bash
npx ts-node scripts/import-html-data.ts
```

Le script génère 3 fichiers SQL dans `supabase/seed/` :
- `01_artistes.sql` - Artistes (vérifie les doublons avec ON CONFLICT)
- `02_projets.sql` - Projets
- `03_transactions.sql` - Toutes les transactions historiques

### 4.5 Vérifier les fichiers SQL générés

Ouvrir chaque fichier et vérifier :

- [ ] Les artistes correspondent bien (noms, couleurs)
- [ ] Les projets sont corrects (noms, codes)
- [ ] Les transactions ont les bons montants, dates, catégories
- [ ] Les descriptions sont propres
- [ ] Les références artiste/projet sont correctes dans les lookups

### 4.6 Importer dans Supabase

**Via Supabase CLI :**
```bash
supabase db execute --file supabase/seed/01_artistes.sql
supabase db execute --file supabase/seed/02_projets.sql
supabase db execute --file supabase/seed/03_transactions.sql
```

**Via SQL Editor :** copier-coller chaque fichier dans l'ordre.

### 4.7 Vérifier les données importées

Dans le **Table Editor** de Supabase :

- [ ] `artistes` : pas de doublons, couleurs et noms corrects
- [ ] `projets` : pas de doublons, codes et statuts corrects
- [ ] `transactions` : nombre total cohérent avec le Google Sheet original
- [ ] Vues `artistes_with_stats` et `projets_with_stats` : les soldes correspondent

**Requête de vérification rapide :**
```sql
-- Nombre total de transactions
SELECT COUNT(*) FROM transactions;

-- Solde par artiste
SELECT a.nom, SUM(t.credit) as total_credit, SUM(t.debit) as total_debit
FROM transactions t
JOIN artistes a ON t.artiste_id = a.id
GROUP BY a.nom
ORDER BY a.nom;

-- Solde par projet
SELECT p.nom, SUM(t.credit) as total_credit, SUM(t.debit) as total_debit
FROM transactions t
JOIN projets p ON t.projet_id = p.id
GROUP BY p.nom
ORDER BY p.nom;
```

Comparer ces chiffres avec les totaux du Google Sheet original.

---

## Phase 5 - Premier compte de test (Oliver)

### 5.1 Créer le compte

1. Aller sur `http://localhost:3000/register`
2. Remplir :
   - **Nom** : Oliver
   - **Email** : oliver-vdb@hotmail.com
   - **Mot de passe** : choisir un mot de passe
   - **Couleur** : au choix
3. Soumettre le formulaire

### 5.2 Vérifier le compte

En fonction de la config Supabase :
- Si **email confirmation désactivé** (config.toml par défaut en local) : accès direct
- Si **email confirmation activé** (production) : vérifier l'email et cliquer le lien

### 5.3 Vérifier l'accès admin

- [ ] `/dashboard` est accessible
- [ ] Le menu Admin est visible (sidebar)
- [ ] `/dashboard/admin/invitations` affiche la page d'invitations
- [ ] `/dashboard/admin/settings` est accessible
- [ ] Les données importées (artistes, projets, transactions) sont visibles

### 5.4 Tests fonctionnels de base

- [ ] Navigation entre les pages du dashboard
- [ ] Liste des artistes avec soldes corrects
- [ ] Liste des projets avec budgets
- [ ] Liste des transactions (filtrables)
- [ ] Création d'une transaction test
- [ ] Suppression de la transaction test

---

## Phase 6 - Invitation des admins réels

### 6.1 Inviter Maïa

1. Aller sur `/dashboard/admin/invitations`
2. Cliquer **Inviter un membre**
3. Remplir :
   - **Type** : Artiste existant (transition Google Sheets)
   - **Email** : *l'email réel de Maïa*
   - **Rôle** : Admin
   - **Artiste** : sélectionner **Maïa** dans le dropdown
   - **Notes** : "Admin O.V.N.I - Maïa"
4. Valider --> un email d'invitation est envoyé automatiquement

### 6.2 Inviter Geoffrey

Même procédure :
- **Type** : Artiste existant
- **Email** : *l'email réel de Geoffrey*
- **Rôle** : Admin
- **Artiste** : sélectionner **Geoffrey**
- **Notes** : "Admin O.V.N.I - Geoffrey"

### 6.3 Vérifier la réception des emails

- [ ] Maïa a reçu l'email d'invitation avec le bouton "Créer mon compte"
- [ ] Geoffrey a reçu l'email d'invitation
- [ ] Les liens pointent vers `/register?email=...` avec l'email pré-rempli

### 6.4 Test d'inscription (Maïa ou Geoffrey)

Quand l'un d'eux clique le lien :
- [ ] La page `/register` s'ouvre avec l'email pré-rempli et en lecture seule
- [ ] Après inscription, le profil est automatiquement lié à l'artiste existant
- [ ] Le rôle admin est bien attribué
- [ ] La couleur de l'artiste est mise à jour avec celle choisie à l'inscription
- [ ] L'invitation est marquée comme `used = true` dans `allowed_emails`
- [ ] L'utilisateur a accès au menu Admin dans le dashboard

### 6.5 Options de secours

Si un email n'est pas reçu :
- **Renvoyer** : cliquer l'icône "..." > "Renvoyer l'email" sur la page invitations
- **Lien manuel** : cliquer "..." > "Copier le lien d'inscription" et l'envoyer directement

---

## Phase 7 - Nettoyage et mise en production

### 7.1 Supprimer le compte test Oliver

Une fois que Maïa et Geoffrey sont inscrits et ont vérifié que tout fonctionne :

```sql
-- 1. Supprimer le profil
DELETE FROM profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'oliver-vdb@hotmail.com'
);

-- 2. Supprimer l'utilisateur auth
-- Via Supabase Dashboard > Authentication > Users > supprimer oliver-vdb@hotmail.com

-- 3. Supprimer l'invitation
DELETE FROM allowed_emails WHERE email = 'oliver-vdb@hotmail.com';
```

### 7.2 Checklist pré-production

- [ ] Toutes les données Google Sheets sont importées et vérifiées
- [ ] Les deux admins (Maïa & Geoffrey) sont inscrits et fonctionnels
- [ ] Le compte test Oliver est supprimé
- [ ] Les variables d'environnement de production sont configurées
- [ ] Le domaine email Resend est vérifié (si domaine personnalisé)
- [ ] L'URL de production est configurée dans `NEXT_PUBLIC_APP_URL`
- [ ] L'URL de production est ajoutée dans Supabase **Authentication > URL Configuration**
- [ ] `pnpm build` passe sans erreur

### 7.3 (Optionnel) Supprimer la migration test

Si le repo est partagé, supprimer le fichier de migration temporaire :
```bash
rm supabase/migrations/20250128000004_admin_test_oliver.sql
```

---

## Résumé des variables d'environnement requises

| Variable | Source | Obligatoire |
|----------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API | Oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API | Oui |
| `RESEND_API_KEY` | Resend Dashboard > API Keys | Oui |
| `NEXT_PUBLIC_APP_URL` | URL de déploiement | Oui |
| `RESEND_FROM_EMAIL` | Domaine vérifié sur Resend | Non (défaut: onboarding@resend.dev) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API | Non |

---

## Dépendances à installer

| Package | Commande | Usage |
|---------|----------|-------|
| `resend` | `pnpm add resend` | Envoi d'emails (déjà installé) |
| `cheerio` | `pnpm add -D cheerio @types/cheerio` | Script d'import Google Sheets |
| `@radix-ui/react-alert-dialog` | `pnpm add @radix-ui/react-alert-dialog` | Composant UI (déjà installé) |
