# Guide de Configuration Supabase - O.V.N.I Compta

Ce guide vous accompagne pas à pas pour configurer Supabase, l'authentification et Resend pour votre application.

---

## Table des matières

1. [Créer un compte Supabase](#1-créer-un-compte-supabase)
2. [Créer un nouveau projet](#2-créer-un-nouveau-projet)
3. [Configurer les variables d'environnement](#3-configurer-les-variables-denvironnement)
4. [Exécuter les migrations SQL](#4-exécuter-les-migrations-sql)
5. [Configurer l'authentification](#5-configurer-lauthentification)
6. [Créer votre premier compte admin](#6-créer-votre-premier-compte-admin)
7. [Configurer Resend (emails)](#7-configurer-resend-emails)
8. [Importer les données depuis Google Sheets](#8-importer-les-données-depuis-google-sheets)
9. [Tester l'application](#9-tester-lapplication)

---

## 1. Créer un compte Supabase

1. Allez sur **https://supabase.com**
2. Cliquez sur **"Start your project"** (bouton vert)
3. Connectez-vous avec **GitHub** (recommandé) ou créez un compte email

---

## 2. Créer un nouveau projet

1. Cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `ovni-compta`
   - **Database Password** : Choisissez un mot de passe fort (notez-le quelque part !)
   - **Region** : `West EU (Ireland)` (le plus proche de la Belgique)
   - **Pricing Plan** : Free (gratuit)
3. Cliquez sur **"Create new project"**
4. Attendez ~2 minutes que le projet soit créé

---

## 3. Configurer les variables d'environnement

### 3.1 Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** (roue dentée en bas à gauche)
2. Cliquez sur **API Keys** dans le menu (sous "API Settings")
3. Vous verrez :
   - **Project URL** : `https://xxxxxxxx.supabase.co` (en haut, section "Project URL")
   - **Publishable key** : clé commençant par `sb_publishable_...` (anciennement "anon key")
   - **Secret key** : clé commençant par `sb_secret_...` (anciennement "service_role")

> 💡 **Note** : Supabase a récemment mis à jour son interface. Les "Publishable keys" remplacent les anciennes "anon keys". C'est la même chose, juste un nouveau nom !

### 3.2 Créer le fichier .env.local

Dans le dossier du projet, créez un fichier `.env.local` :

```bash
# Dans votre terminal, à la racine du projet
cp .env.local.example .env.local
```

Puis éditez `.env.local` et remplacez les valeurs :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxx

# Resend (on configurera plus tard)
RESEND_API_KEY=re_xxxxxxxxxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Correspondance des clés** :
> - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre **Publishable key** (`sb_publishable_...`)
> - La **Secret key** n'est pas nécessaire pour cette application

⚠️ **IMPORTANT** : Ne partagez JAMAIS le fichier `.env.local` et ne le commitez pas sur Git !

---

## 4. Exécuter les migrations SQL

Les fichiers SQL se trouvent dans `supabase/migrations/`. Exécutez-les **dans l'ordre** :

### 4.1 Ouvrir le SQL Editor

1. Dans Supabase Dashboard, cliquez sur **SQL Editor** (icône `</>` dans le menu)
2. Cliquez sur **"New Query"**

### 4.2 Exécuter les migrations

Exécutez ces fichiers **un par un, dans l'ordre** :

| Ordre | Fichier | Description |
|-------|---------|-------------|
| 1 | `20250128000000_initial_schema.sql` | Tables, types, index |
| 2 | `20250128000001_invite_system.sql` | Système d'invitations |
| 3 | `20250128000002_seed_data.sql` | Artistes, projets initiaux |
| 4 | `20250128000003_projet_artistes.sql` | Liaison projets-artistes |
| 5 | `seed-ressources.sql` (dans /supabase/) | 22 ressources ASBL |
| 6 | `20250128000005_seed_transactions.sql` | **533 transactions** (Google Sheets) |

**Pour chaque fichier :**
1. Ouvrez le fichier dans votre éditeur de code
2. Copiez tout le contenu
3. Collez dans le SQL Editor de Supabase
4. Cliquez sur **"Run"** (ou Ctrl+Enter)
5. Vérifiez qu'il n'y a pas d'erreur (message vert "Success")

### 4.3 Vérifier les tables

Après les migrations, allez dans **Table Editor** (icône de tableau).
Vous devriez voir ces tables :
- `profiles`
- `allowed_emails`
- `artistes`
- `projets`
- `transactions`
- `transferts`
- `projet_artistes`
- `ressources`

---

## 5. Configurer l'authentification

### 5.1 Paramètres généraux

1. Allez dans **Authentication** > **Providers**
2. Vérifiez que **Email** est activé (ON)

### 5.2 Configurer les URLs de redirection

1. Allez dans **Authentication** > **URL Configuration**
2. Configurez :
   - **Site URL** : `http://localhost:3000`
   - **Redirect URLs** : Ajoutez :
     - `http://localhost:3000/**`
     - `http://localhost:3000/auth/callback`

### 5.3 Désactiver la confirmation email (pour le développement)

1. Allez dans **Authentication** > **Providers** > **Email**
2. Désactivez **"Confirm email"** (pour simplifier les tests)
   - ⚠️ Réactivez-le en production !

### 5.4 Personnaliser les emails (optionnel)

1. Allez dans **Authentication** > **Email Templates**
2. Vous pouvez personnaliser les emails en français

---

## 6. Créer votre premier compte admin

Le système d'invitation empêche les inscriptions non autorisées. Vous devez d'abord créer une invitation pour vous-même.

### 6.1 Créer l'invitation admin

1. Dans **SQL Editor**, exécutez :

```sql
-- Remplacez 'votre-email@example.com' par votre vrai email
-- et 'Maïa' par votre nom d'artiste si vous êtes Maïa ou Geoffrey

INSERT INTO allowed_emails (email, role, artiste_id, can_create_artiste, notes)
VALUES (
  'votre-email@example.com',  -- ← VOTRE EMAIL ICI
  'admin',
  (SELECT id FROM artistes WHERE nom = 'Maïa'),  -- ← OU 'Geoffrey'
  false,
  'Admin O.V.N.I'
);
```

### 6.2 S'inscrire sur l'application

1. Lancez l'application : `npm run dev`
2. Allez sur `http://localhost:3000/register`
3. Inscrivez-vous avec l'email que vous avez ajouté
4. Votre compte sera automatiquement admin et lié à l'artiste

### 6.3 Créer le deuxième admin (Geoffrey ou Maïa)

Une fois connecté comme admin, vous pouvez inviter l'autre admin via l'interface :
- Dashboard > Administration > Invitations

Ou via SQL :

```sql
INSERT INTO allowed_emails (email, role, artiste_id, can_create_artiste, notes)
VALUES (
  'autre-admin@example.com',  -- ← EMAIL DE L'AUTRE ADMIN
  'admin',
  (SELECT id FROM artistes WHERE nom = 'Geoffrey'),  -- ← OU 'Maïa'
  false,
  'Admin O.V.N.I'
);
```

---

## 7. Configurer Resend (emails)

Resend permet d'envoyer des emails d'invitation aux nouveaux membres.

### 7.1 Créer un compte Resend

1. Allez sur **https://resend.com**
2. Créez un compte (gratuit jusqu'à 100 emails/jour)
3. Vérifiez votre email

### 7.2 Créer une clé API

1. Dans Resend Dashboard, allez dans **API Keys**
2. Cliquez sur **"Create API Key"**
3. Name : `ovni-compta`
4. Permission : `Sending access`
5. Copiez la clé (elle commence par `re_`)

### 7.3 Ajouter la clé dans .env.local

```env
RESEND_API_KEY=re_votre_cle_ici
```

### 7.4 Configurer un domaine (optionnel, pour production)

Pour l'instant, les emails seront envoyés depuis `onboarding@resend.dev`.
Pour utiliser votre propre domaine (`@votredomaine.com`), suivez le guide Resend pour vérifier votre DNS.

---

## 8. Importer les données depuis Google Sheets

Les données de votre Google Sheets doivent être converties en transactions. Deux options :

### Option A : Import manuel (recommandé pour commencer)

1. Ouvrez votre Google Sheet original
2. Pour chaque transaction, utilisez l'interface de l'application :
   - Dashboard > Transactions > Nouvelle transaction

### Option B : Import CSV (plus rapide mais technique)

#### 8.1 Exporter depuis Google Sheets en CSV

1. Ouvrez votre Google Sheet
2. **Fichier** > **Télécharger** > **CSV (.csv)**
3. Faites-le pour chaque feuille (Maïa, Geoffrey, GEO, etc.)

#### 8.2 Préparer le CSV

Votre CSV doit avoir ces colonnes :
```
date,description,credit,debit,artiste_nom,projet_code,categorie
```

Exemple :
```csv
date,description,credit,debit,artiste_nom,projet_code,categorie
2024-01-15,Cachet concert,500,0,Maïa,,cachet
2024-01-20,Achat micro,-0,150,Maïa,,materiel
2024-02-01,Subvention FWB,2000,0,,GEO,subvention
```

#### 8.3 Script d'import SQL

Une fois votre CSV prêt, utilisez ce script dans SQL Editor :

```sql
-- Exemple d'import de transactions
-- Remplacez les valeurs par vos données réelles

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2024-01-15', 'Cachet concert', 500, 0,
   (SELECT id FROM artistes WHERE nom = 'Maïa'),
   NULL,
   'cachet'),
  ('2024-01-20', 'Achat micro', 0, 150,
   (SELECT id FROM artistes WHERE nom = 'Maïa'),
   NULL,
   'materiel'),
  ('2024-02-01', 'Subvention FWB', 2000, 0,
   NULL,
   (SELECT id FROM projets WHERE code = 'GEO'),
   'subvention');
```

### Catégories disponibles

| Code | Label |
|------|-------|
| `cachet` | Cachet |
| `subvention` | Subvention |
| `smart` | Smart |
| `thoman` | Thomann |
| `materiel` | Matériel |
| `loyer` | Loyer |
| `deplacement` | Déplacement |
| `frais_bancaires` | Frais bancaires |
| `transfert_interne` | Transfert interne |
| `autre` | Autre |

---

## 9. Tester l'application

### 9.1 Lancer l'application

```bash
cd ovni-compta
npm run dev
```

### 9.2 Vérifications

- [ ] Page de login accessible : `http://localhost:3000/login`
- [ ] Inscription fonctionne (avec email dans `allowed_emails`)
- [ ] Connexion fonctionne
- [ ] Dashboard affiche les données
- [ ] Création de transaction fonctionne
- [ ] Export CSV fonctionne

### 9.3 Problèmes courants

**"Inscription non autorisée"**
→ Votre email n'est pas dans `allowed_emails`. Ajoutez-le via SQL Editor.

**"Network Error" ou "fetch failed"**
→ Vérifiez que `.env.local` contient les bonnes clés Supabase.

**Les données ne s'affichent pas**
→ Vérifiez dans Table Editor que les tables contiennent des données.

---

## Checklist finale

- [ ] Compte Supabase créé
- [ ] Projet créé
- [ ] `.env.local` configuré avec les clés
- [ ] Migrations SQL exécutées (5 fichiers)
- [ ] Ressources insérées (22 ressources)
- [ ] Compte Resend créé et clé API ajoutée
- [ ] Invitation admin créée
- [ ] Premier compte admin créé via inscription
- [ ] Application testée et fonctionnelle

---

## Support

Si vous avez des questions :
1. Vérifiez les logs dans le terminal (erreurs côté serveur)
2. Ouvrez la console du navigateur (F12 > Console) pour les erreurs côté client
3. Consultez les logs Supabase : Dashboard > Logs > API

Bonne configuration ! 🎉
