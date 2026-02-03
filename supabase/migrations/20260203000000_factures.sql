-- =============================================
-- O.V.N.I Compta - Table Factures
-- Gestion des factures PDF liées aux artistes, projets ou ASBL
-- =============================================

-- =============================================
-- ENUM TYPE pour type de liaison
-- =============================================
CREATE TYPE type_liaison AS ENUM ('artiste', 'projet', 'asbl');

-- =============================================
-- TABLE: factures
-- =============================================
CREATE TABLE factures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,

  -- Liaison flexible : artiste, projet, ou ASBL (tous null)
  type_liaison type_liaison NOT NULL,
  artiste_id UUID REFERENCES artistes(id) ON DELETE SET NULL,
  projet_id UUID REFERENCES projets(id) ON DELETE SET NULL,

  -- Fichier PDF (chemin dans Supabase Storage)
  fichier_nom TEXT NOT NULL,
  fichier_path TEXT NOT NULL,
  fichier_size INTEGER,

  -- Métadonnées
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Contraintes de cohérence
  CONSTRAINT check_liaison_coherence CHECK (
    (type_liaison = 'artiste' AND artiste_id IS NOT NULL AND projet_id IS NULL) OR
    (type_liaison = 'projet' AND projet_id IS NOT NULL AND artiste_id IS NULL) OR
    (type_liaison = 'asbl' AND artiste_id IS NULL AND projet_id IS NULL)
  )
);

-- =============================================
-- INDEX pour les performances
-- =============================================
CREATE INDEX idx_factures_artiste ON factures(artiste_id) WHERE artiste_id IS NOT NULL;
CREATE INDEX idx_factures_projet ON factures(projet_id) WHERE projet_id IS NOT NULL;
CREATE INDEX idx_factures_type ON factures(type_liaison);
CREATE INDEX idx_factures_date ON factures(date DESC);

-- =============================================
-- TRIGGER updated_at
-- =============================================
CREATE TRIGGER set_factures_updated_at
  BEFORE UPDATE ON factures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;

-- Tous les utilisateurs authentifiés peuvent voir les factures
CREATE POLICY "Authenticated users can view all factures"
  ON factures FOR SELECT
  TO authenticated
  USING (true);

-- Editors et admins peuvent créer des factures
CREATE POLICY "Editors and admins can insert factures"
  ON factures FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- Editors et admins peuvent supprimer des factures
CREATE POLICY "Editors and admins can delete factures"
  ON factures FOR DELETE
  TO authenticated
  USING (
    get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- Editors et admins peuvent modifier des factures
CREATE POLICY "Editors and admins can update factures"
  ON factures FOR UPDATE
  TO authenticated
  USING (
    get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- =============================================
-- STORAGE: Bucket factures
-- Note: Le bucket doit être créé manuellement dans Supabase Dashboard
-- car les buckets Storage ne peuvent pas être créés via SQL migrations.
--
-- Instructions:
-- 1. Aller dans Supabase Dashboard > Storage
-- 2. Créer un nouveau bucket nommé "factures"
-- 3. Définir le bucket comme privé (non public)
-- 4. Ajouter les politiques suivantes:
--
-- Policy SELECT (download):
--   - Name: "Authenticated users can download factures"
--   - Allowed operation: SELECT
--   - Target roles: authenticated
--   - USING expression: true
--
-- Policy INSERT (upload):
--   - Name: "Editors and admins can upload factures"
--   - Allowed operation: INSERT
--   - Target roles: authenticated
--   - WITH CHECK expression: (get_user_role(auth.uid()) IN ('admin', 'editor'))
--
-- Policy DELETE:
--   - Name: "Editors and admins can delete factures"
--   - Allowed operation: DELETE
--   - Target roles: authenticated
--   - USING expression: (get_user_role(auth.uid()) IN ('admin', 'editor'))
-- =============================================
