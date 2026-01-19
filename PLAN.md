# OVNI Compta - Plan de Développement

## Vue d'ensemble

Application de gestion comptable pour l'ASBL O.V.N.I.

| Aspect | Détail |
|--------|--------|
| **Stack** | Next.js 14 + TypeScript + Tailwind CSS |
| **Base de données** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (email + OAuth) |
| **UI Components** | shadcn/ui |
| **State** | Zustand + TanStack Query |
| **Déploiement** | VPS avec Docker + Nginx |

---

## Structure du Projet

```
ovni-compta/
├── src/
│   ├── app/                      # Routes Next.js (App Router)
│   │   ├── (auth)/               # Routes publiques (login)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/          # Routes protégées
│   │   │   ├── layout.tsx        # Layout avec sidebar
│   │   │   ├── page.tsx          # Dashboard principal
│   │   │   ├── artistes/
│   │   │   │   ├── page.tsx      # Liste des artistes
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Fiche artiste
│   │   │   ├── projets/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── transactions/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── bilans/
│   │   │   │   └── page.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       └── users/
│   │   │           └── page.tsx
│   │   ├── api/                  # API Routes (si nécessaire)
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # Composants shadcn/ui
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionTable.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── TransactionFilters.tsx
│   │   ├── artistes/
│   │   │   ├── ArtisteCard.tsx
│   │   │   └── ArtisteFiche.tsx
│   │   ├── projets/
│   │   │   ├── ProjetCard.tsx
│   │   │   └── ProjetFiche.tsx
│   │   ├── bilans/
│   │   │   ├── BilanSummary.tsx
│   │   │   └── BilanChart.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Client navigateur
│   │   │   ├── server.ts         # Client serveur
│   │   │   └── middleware.ts     # Auth middleware
│   │   ├── utils.ts              # Helpers (cn, formatters)
│   │   └── constants.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useArtistes.ts
│   │   ├── useProjets.ts
│   │   └── useBilans.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   └── types/
│       ├── database.types.ts     # Types générés par Supabase
│       ├── transaction.ts
│       ├── artiste.ts
│       ├── projet.ts
│       └── user.ts
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── public/
├── PLAN.md                       # Ce fichier
├── .env.local.example
└── package.json
```

---

## Base de Données (Supabase)

### Tables

```sql
-- =====================
-- PROFILES (extension auth.users)
-- =====================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  nom TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ARTISTES
-- =====================
CREATE TABLE artistes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL UNIQUE,
  email TEXT,
  telephone TEXT,
  notes TEXT,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- PROJETS
-- =====================
CREATE TABLE projets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  code TEXT UNIQUE,                    -- Ex: LVLR, WP, TALU
  description TEXT,
  artiste_id UUID REFERENCES artistes(id),
  date_debut DATE,
  date_fin DATE,
  budget DECIMAL(10,2),
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'termine', 'annule')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- TRANSACTIONS
-- =====================
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  credit DECIMAL(10,2) DEFAULT 0,
  debit DECIMAL(10,2) DEFAULT 0,

  -- Relations
  artiste_id UUID REFERENCES artistes(id),
  projet_id UUID REFERENCES projets(id),

  -- Catégorisation
  categorie TEXT,                       -- smart, thoman, frais, loyer, etc.

  -- Champs calculés
  annee INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)) STORED,
  mois INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM date)) STORED,

  -- Audit
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEX
-- =====================
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_artiste ON transactions(artiste_id);
CREATE INDEX idx_transactions_projet ON transactions(projet_id);
CREATE INDEX idx_transactions_annee ON transactions(annee);

-- =====================
-- VUES
-- =====================

-- Bilans annuels
CREATE VIEW bilans_annuels AS
SELECT
  annee,
  SUM(credit) as total_credit,
  SUM(debit) as total_debit,
  SUM(credit) - SUM(debit) as solde,
  COUNT(*) as nb_transactions
FROM transactions
GROUP BY annee
ORDER BY annee DESC;

-- Soldes par artiste
CREATE VIEW soldes_artistes AS
SELECT
  a.id,
  a.nom,
  COALESCE(SUM(t.credit), 0) as total_credit,
  COALESCE(SUM(t.debit), 0) as total_debit,
  COALESCE(SUM(t.credit), 0) - COALESCE(SUM(t.debit), 0) as solde,
  COUNT(t.id) as nb_transactions
FROM artistes a
LEFT JOIN transactions t ON t.artiste_id = a.id
GROUP BY a.id, a.nom;

-- Soldes par projet
CREATE VIEW soldes_projets AS
SELECT
  p.id,
  p.nom,
  p.code,
  p.budget,
  COALESCE(SUM(t.credit), 0) as total_credit,
  COALESCE(SUM(t.debit), 0) as total_debit,
  COALESCE(SUM(t.credit), 0) - COALESCE(SUM(t.debit), 0) as solde,
  p.budget - (COALESCE(SUM(t.debit), 0) - COALESCE(SUM(t.credit), 0)) as reste_budget
FROM projets p
LEFT JOIN transactions t ON t.projet_id = p.id
GROUP BY p.id, p.nom, p.code, p.budget;

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artistes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies pour lecture (tous les users authentifiés)
CREATE POLICY "Authenticated users can view artistes"
  ON artistes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view projets"
  ON projets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view transactions"
  ON transactions FOR SELECT TO authenticated USING (true);

-- Policies pour écriture (editors et admins)
CREATE POLICY "Editors can manage artistes"
  ON artistes FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Editors can manage projets"
  ON projets FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

CREATE POLICY "Editors can manage transactions"
  ON transactions FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  );

-- =====================
-- TRIGGERS
-- =====================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_artistes_updated_at
  BEFORE UPDATE ON artistes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projets_updated_at
  BEFORE UPDATE ON projets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, nom)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## Rôles Utilisateurs

| Rôle | Permissions |
|------|-------------|
| **viewer** | Lecture seule (dashboard, transactions, artistes, projets) |
| **editor** | Lecture + Création/Modification/Suppression |
| **admin** | Tout + Gestion des utilisateurs + Paramètres |

---

## Pages & Fonctionnalités

### 1. Login (`/login`)
- [x] Connexion email/password
- [ ] Connexion Google OAuth (optionnel)
- [x] Redirection vers dashboard après login

### 2. Dashboard (`/dashboard`)
- [ ] Carte solde global
- [ ] Graphique évolution 12 derniers mois
- [ ] 5 dernières transactions
- [ ] Boutons actions rapides (nouvelle transaction, etc.)

### 3. Transactions (`/transactions`)
- [ ] Table avec colonnes : Date, Description, Crédit, Débit, Artiste, Projet
- [ ] Tri par colonnes
- [ ] Filtres : période, artiste, projet, catégorie
- [ ] Recherche texte
- [ ] Pagination
- [ ] Bouton ajouter
- [ ] Actions : modifier, supprimer

### 4. Nouvelle Transaction (`/transactions/new`)
- [ ] Formulaire : date, description, montant, type (crédit/débit)
- [ ] Sélecteur artiste (optionnel)
- [ ] Sélecteur projet (optionnel)
- [ ] Sélecteur catégorie
- [ ] Validation Zod
- [ ] Redirection après sauvegarde

### 5. Artistes (`/artistes`)
- [ ] Liste avec cartes : nom, solde, nb transactions
- [ ] Recherche
- [ ] Bouton ajouter

### 6. Fiche Artiste (`/artistes/[id]`)
- [ ] Infos : nom, email, téléphone, notes
- [ ] Solde actuel
- [ ] Historique transactions
- [ ] Graphique évolution
- [ ] Bouton modifier

### 7. Projets (`/projets`)
- [ ] Liste avec cartes : nom, code, budget, solde, statut
- [ ] Filtres : statut
- [ ] Recherche

### 8. Fiche Projet (`/projets/[id]`)
- [ ] Infos : nom, code, description, dates, budget
- [ ] Solde actuel / reste budget
- [ ] Historique transactions
- [ ] Bouton modifier

### 9. Bilans (`/bilans`)
- [ ] Sélecteur année
- [ ] Totaux : crédits, débits, solde
- [ ] Graphique mensuel
- [ ] Répartition par catégorie (pie chart)
- [ ] Bouton export CSV
- [ ] Bouton export PDF

### 10. Admin (`/admin`)
- [ ] Liste utilisateurs
- [ ] Modifier rôle
- [ ] Inviter utilisateur
- [ ] Paramètres app

---

## Déploiement VPS

### Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    networks:
      - web

networks:
  web:
    external: true
```

### Nginx config

```nginx
server {
    listen 80;
    server_name compta.ovni.be;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name compta.ovni.be;

    ssl_certificate /etc/letsencrypt/live/compta.ovni.be/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/compta.ovni.be/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Variables d'Environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: for server-side operations
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Docker build
docker build -t ovni-compta .

# Docker run
docker-compose up -d

# Générer types Supabase
npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
```

---

## Phases de Développement

### Phase 1 : Setup (Jour 1-2)
- [x] Créer projet Next.js
- [ ] Installer dépendances
- [ ] Configurer shadcn/ui
- [ ] Créer structure dossiers
- [ ] Configurer Supabase

### Phase 2 : Auth & Layout (Jour 3-4)
- [ ] Page login
- [ ] Middleware auth
- [ ] Layout dashboard (sidebar, header)
- [ ] Navigation

### Phase 3 : Core - Transactions (Jour 5-8)
- [ ] Table transactions
- [ ] Formulaire transaction
- [ ] CRUD complet
- [ ] Filtres et recherche

### Phase 4 : Core - Artistes & Projets (Jour 9-12)
- [ ] Liste artistes
- [ ] Fiche artiste
- [ ] Liste projets
- [ ] Fiche projet

### Phase 5 : Dashboard & Bilans (Jour 13-15)
- [ ] Dashboard avec graphiques
- [ ] Page bilans
- [ ] Export CSV

### Phase 6 : Admin & Polish (Jour 16-18)
- [ ] Panel admin
- [ ] Gestion utilisateurs
- [ ] Tests
- [ ] Responsive

### Phase 7 : Déploiement (Jour 19-20)
- [ ] Docker config
- [ ] Déployer sur VPS
- [ ] Configurer Nginx + SSL
- [ ] Migration données existantes

---

## Notes Techniques

### Conventions de Nommage
- **Composants** : PascalCase (`TransactionTable.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useTransactions.ts`)
- **Types** : PascalCase (`Transaction`, `Artiste`)
- **Routes** : kebab-case (`/artistes/[id]`)

### Formatage Monétaire
```typescript
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
```

### Formatage Dates
```typescript
const formatDate = (date: string) =>
  new Intl.DateTimeFormat('fr-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
```
