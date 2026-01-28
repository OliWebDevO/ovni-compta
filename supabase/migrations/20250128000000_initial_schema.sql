-- =============================================
-- O.V.N.I Compta - Schema Initial
-- Application de comptabilité pour ASBL
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

-- Rôles utilisateurs
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');

-- Statuts de projet
CREATE TYPE projet_statut AS ENUM ('actif', 'termine', 'annule');

-- Types de compte pour les transferts
CREATE TYPE compte_type AS ENUM ('artiste', 'projet');

-- Catégories de transactions
CREATE TYPE transaction_categorie AS ENUM (
  'smart',
  'thoman',
  'frais_bancaires',
  'loyer',
  'materiel',
  'deplacement',
  'cachet',
  'subvention',
  'transfert_interne',
  'autre'
);

-- Catégories de ressources
CREATE TYPE ressource_categorie AS ENUM (
  'guide',
  'juridique',
  'comptabilite',
  'artistes',
  'liens'
);

-- =============================================
-- TABLE: profiles (extension de auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nom TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- =============================================
-- TABLE: artistes
-- =============================================
CREATE TABLE artistes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL UNIQUE,
  email TEXT,
  telephone TEXT,
  notes TEXT,
  actif BOOLEAN NOT NULL DEFAULT true,
  couleur TEXT, -- Couleur hex personnalisée
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX idx_artistes_nom ON artistes(nom);
CREATE INDEX idx_artistes_actif ON artistes(actif);

-- =============================================
-- TABLE: projets
-- =============================================
CREATE TABLE projets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  artiste_id UUID REFERENCES artistes(id) ON DELETE SET NULL,
  date_debut DATE,
  date_fin DATE,
  budget DECIMAL(12, 2),
  statut projet_statut NOT NULL DEFAULT 'actif',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX idx_projets_nom ON projets(nom);
CREATE INDEX idx_projets_code ON projets(code);
CREATE INDEX idx_projets_statut ON projets(statut);
CREATE INDEX idx_projets_artiste_id ON projets(artiste_id);

-- =============================================
-- TABLE: transactions
-- =============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  description TEXT NOT NULL,
  credit DECIMAL(12, 2) NOT NULL DEFAULT 0,
  debit DECIMAL(12, 2) NOT NULL DEFAULT 0,
  artiste_id UUID REFERENCES artistes(id) ON DELETE SET NULL,
  projet_id UUID REFERENCES projets(id) ON DELETE SET NULL,
  categorie transaction_categorie DEFAULT 'autre',
  -- Champs pour les transferts internes
  transfert_id UUID,
  transfert_type TEXT CHECK (transfert_type IN ('debit', 'credit')),
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Contrainte: au moins credit ou debit doit être > 0
  CONSTRAINT check_credit_or_debit CHECK (credit > 0 OR debit > 0),
  -- Contrainte: pas les deux en même temps
  CONSTRAINT check_not_both CHECK (NOT (credit > 0 AND debit > 0))
);

-- Index pour les recherches et filtrages
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_artiste_id ON transactions(artiste_id);
CREATE INDEX idx_transactions_projet_id ON transactions(projet_id);
CREATE INDEX idx_transactions_categorie ON transactions(categorie);
CREATE INDEX idx_transactions_transfert_id ON transactions(transfert_id);

-- =============================================
-- TABLE: transferts (transferts internes)
-- =============================================
CREATE TABLE transferts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  montant DECIMAL(12, 2) NOT NULL CHECK (montant > 0),
  description TEXT NOT NULL,
  -- Source
  source_type compte_type NOT NULL,
  source_artiste_id UUID REFERENCES artistes(id) ON DELETE CASCADE,
  source_projet_id UUID REFERENCES projets(id) ON DELETE CASCADE,
  -- Destination
  destination_type compte_type NOT NULL,
  destination_artiste_id UUID REFERENCES artistes(id) ON DELETE CASCADE,
  destination_projet_id UUID REFERENCES projets(id) ON DELETE CASCADE,
  -- Transactions liées
  transaction_debit_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  transaction_credit_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Contraintes de cohérence
  CONSTRAINT check_source_artiste CHECK (
    (source_type = 'artiste' AND source_artiste_id IS NOT NULL AND source_projet_id IS NULL) OR
    (source_type = 'projet' AND source_projet_id IS NOT NULL AND source_artiste_id IS NULL)
  ),
  CONSTRAINT check_destination_artiste CHECK (
    (destination_type = 'artiste' AND destination_artiste_id IS NOT NULL AND destination_projet_id IS NULL) OR
    (destination_type = 'projet' AND destination_projet_id IS NOT NULL AND destination_artiste_id IS NULL)
  )
);

-- Index pour les recherches
CREATE INDEX idx_transferts_date ON transferts(date DESC);
CREATE INDEX idx_transferts_source_artiste ON transferts(source_artiste_id);
CREATE INDEX idx_transferts_source_projet ON transferts(source_projet_id);
CREATE INDEX idx_transferts_destination_artiste ON transferts(destination_artiste_id);
CREATE INDEX idx_transferts_destination_projet ON transferts(destination_projet_id);

-- Ajouter la contrainte foreign key sur transactions.transfert_id
ALTER TABLE transactions
ADD CONSTRAINT fk_transactions_transfert
FOREIGN KEY (transfert_id) REFERENCES transferts(id) ON DELETE SET NULL;

-- =============================================
-- TABLE: ressources
-- =============================================
CREATE TABLE ressources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  contenu TEXT,
  categorie ressource_categorie NOT NULL,
  url TEXT,
  tags TEXT[] DEFAULT '{}',
  icon TEXT,
  important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les recherches
CREATE INDEX idx_ressources_categorie ON ressources(categorie);
CREATE INDEX idx_ressources_important ON ressources(important);
CREATE INDEX idx_ressources_tags ON ressources USING GIN(tags);

-- =============================================
-- FONCTIONS: updated_at automatique
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artistes_updated_at
  BEFORE UPDATE ON artistes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projets_updated_at
  BEFORE UPDATE ON projets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transferts_updated_at
  BEFORE UPDATE ON transferts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ressources_updated_at
  BEFORE UPDATE ON ressources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FONCTIONS: Créer un profil automatiquement
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, nom, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nom', NEW.email),
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil à l'inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- VUES: Statistiques calculées
-- =============================================

-- Vue pour les artistes avec leurs totaux
CREATE OR REPLACE VIEW artistes_with_stats AS
SELECT
  a.*,
  COALESCE(SUM(t.credit), 0) AS total_credit,
  COALESCE(SUM(t.debit), 0) AS total_debit,
  COALESCE(SUM(t.credit), 0) - COALESCE(SUM(t.debit), 0) AS solde,
  COUNT(t.id) AS nb_transactions
FROM artistes a
LEFT JOIN transactions t ON t.artiste_id = a.id
GROUP BY a.id;

-- Vue pour les projets avec leurs totaux
CREATE OR REPLACE VIEW projets_with_stats AS
SELECT
  p.*,
  COALESCE(SUM(t.credit), 0) AS total_credit,
  COALESCE(SUM(t.debit), 0) AS total_debit,
  COALESCE(SUM(t.credit), 0) - COALESCE(SUM(t.debit), 0) AS solde,
  COALESCE(p.budget, 0) - COALESCE(SUM(t.debit), 0) AS reste_budget
FROM projets p
LEFT JOIN transactions t ON t.projet_id = p.id
GROUP BY p.id;

-- Vue pour les bilans annuels
CREATE OR REPLACE VIEW bilans_annuels AS
SELECT
  EXTRACT(YEAR FROM date)::INTEGER AS annee,
  SUM(credit) AS total_credit,
  SUM(debit) AS total_debit,
  SUM(credit) - SUM(debit) AS solde,
  COUNT(*) AS nb_transactions
FROM transactions
GROUP BY EXTRACT(YEAR FROM date)
ORDER BY annee DESC;

-- Vue pour les bilans mensuels
CREATE OR REPLACE VIEW bilans_mensuels AS
SELECT
  EXTRACT(MONTH FROM date)::INTEGER AS mois,
  EXTRACT(YEAR FROM date)::INTEGER AS annee,
  SUM(credit) AS total_credit,
  SUM(debit) AS total_debit,
  SUM(credit) - SUM(debit) AS solde
FROM transactions
GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
ORDER BY annee DESC, mois DESC;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artistes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transferts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ressources ENABLE ROW LEVEL SECURITY;

-- Fonction helper pour vérifier le rôle
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- =============================================
-- POLICIES: profiles
-- =============================================
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Les admins peuvent voir tous les profils
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Les admins peuvent modifier tous les profils
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- POLICIES: artistes
-- =============================================
-- Tout utilisateur authentifié peut voir les artistes
CREATE POLICY "Authenticated users can view artistes"
  ON artistes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admins et editors peuvent créer des artistes
CREATE POLICY "Admins and editors can create artistes"
  ON artistes FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Admins et editors peuvent modifier les artistes
CREATE POLICY "Admins and editors can update artistes"
  ON artistes FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Seuls les admins peuvent supprimer les artistes
CREATE POLICY "Admins can delete artistes"
  ON artistes FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- POLICIES: projets
-- =============================================
CREATE POLICY "Authenticated users can view projets"
  ON projets FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and editors can create projets"
  ON projets FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'editor'));

CREATE POLICY "Admins and editors can update projets"
  ON projets FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

CREATE POLICY "Admins can delete projets"
  ON projets FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- POLICIES: transactions
-- =============================================
CREATE POLICY "Authenticated users can view transactions"
  ON transactions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and editors can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'editor'));

CREATE POLICY "Admins and editors can update transactions"
  ON transactions FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

CREATE POLICY "Admins can delete transactions"
  ON transactions FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- POLICIES: transferts
-- =============================================
CREATE POLICY "Authenticated users can view transferts"
  ON transferts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and editors can create transferts"
  ON transferts FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('admin', 'editor'));

CREATE POLICY "Admins and editors can update transferts"
  ON transferts FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

CREATE POLICY "Admins can delete transferts"
  ON transferts FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- POLICIES: ressources
-- =============================================
-- Ressources accessibles à tous (même non authentifiés pour consultation)
CREATE POLICY "Anyone can view ressources"
  ON ressources FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage ressources"
  ON ressources FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');
