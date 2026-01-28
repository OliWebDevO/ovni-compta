-- =============================================
-- O.V.N.I Compta - Liaison Artistes <-> Projets
-- Un projet peut avoir plusieurs artistes
-- Un artiste peut participer à plusieurs projets
-- =============================================

-- =============================================
-- TABLE: projet_artistes (table de liaison many-to-many)
-- =============================================
CREATE TABLE projet_artistes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  projet_id UUID NOT NULL REFERENCES projets(id) ON DELETE CASCADE,
  artiste_id UUID NOT NULL REFERENCES artistes(id) ON DELETE CASCADE,
  -- Rôle de l'artiste dans le projet
  role_projet TEXT DEFAULT 'membre',
  -- Date d'ajout au projet
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Contrainte d'unicité: un artiste ne peut être lié qu'une fois à un projet
  UNIQUE(projet_id, artiste_id)
);

-- Index pour les recherches
CREATE INDEX idx_projet_artistes_projet ON projet_artistes(projet_id);
CREATE INDEX idx_projet_artistes_artiste ON projet_artistes(artiste_id);

-- =============================================
-- RLS pour projet_artistes
-- =============================================
ALTER TABLE projet_artistes ENABLE ROW LEVEL SECURITY;

-- Tous les utilisateurs authentifiés peuvent voir les liaisons
CREATE POLICY "Authenticated users can view all projet_artistes"
  ON projet_artistes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- L'admin peut tout gérer, les editors peuvent ajouter/supprimer pour leur propre artiste
CREATE POLICY "Admin or own artiste can manage projet_artistes"
  ON projet_artistes FOR INSERT
  WITH CHECK (
    get_user_role(auth.uid()) = 'admin'
    OR (
      get_user_role(auth.uid()) IN ('admin', 'editor')
      AND artiste_id = (SELECT p.artiste_id FROM profiles p WHERE p.id = auth.uid())
    )
  );

CREATE POLICY "Admin or own artiste can update projet_artistes"
  ON projet_artistes FOR UPDATE
  USING (
    get_user_role(auth.uid()) = 'admin'
    OR artiste_id = (SELECT p.artiste_id FROM profiles p WHERE p.id = auth.uid())
  );

CREATE POLICY "Admin or own artiste can delete projet_artistes"
  ON projet_artistes FOR DELETE
  USING (
    get_user_role(auth.uid()) = 'admin'
    OR artiste_id = (SELECT p.artiste_id FROM profiles p WHERE p.id = auth.uid())
  );

-- =============================================
-- Mise à jour RLS Projets:
-- Les editors peuvent aussi créer des projets
-- (pas juste pour leur propre artiste)
-- =============================================

-- Supprimer l'ancienne policy trop restrictive
DROP POLICY IF EXISTS "Users can create projets for own artiste" ON projets;

-- Les editors et admins peuvent créer des projets
CREATE POLICY "Editors and admins can create projets"
  ON projets FOR INSERT
  WITH CHECK (
    get_user_role(auth.uid()) IN ('admin', 'editor')
  );

-- Mise à jour de la policy de modification des projets:
-- Un artiste peut modifier un projet s'il en est membre
DROP POLICY IF EXISTS "Users can update own projets or admin updates all" ON projets;

CREATE POLICY "Project members and admin can update projets"
  ON projets FOR UPDATE
  USING (
    get_user_role(auth.uid()) = 'admin'
    OR artiste_id = (SELECT p.artiste_id FROM profiles p WHERE p.id = auth.uid())
    OR id IN (
      SELECT pa.projet_id FROM projet_artistes pa
      WHERE pa.artiste_id = (SELECT p.artiste_id FROM profiles p WHERE p.id = auth.uid())
    )
  );

-- =============================================
-- Vue mise à jour: projets avec artistes
-- =============================================
CREATE OR REPLACE VIEW projets_with_artistes AS
SELECT
  p.*,
  COALESCE(
    json_agg(
      json_build_object(
        'artiste_id', a.id,
        'artiste_nom', a.nom,
        'artiste_couleur', a.couleur,
        'role_projet', pa.role_projet
      )
    ) FILTER (WHERE a.id IS NOT NULL),
    '[]'::json
  ) AS artistes_membres
FROM projets p
LEFT JOIN projet_artistes pa ON p.id = pa.projet_id
LEFT JOIN artistes a ON pa.artiste_id = a.id
GROUP BY p.id;

-- =============================================
-- Seed: Lier les artistes aux projets existants
-- (à adapter selon les données réelles)
-- =============================================
-- GEO est le projet de Geoffrey
INSERT INTO projet_artistes (projet_id, artiste_id, role_projet)
SELECT p.id, a.id, 'responsable'
FROM projets p, artistes a
WHERE p.code = 'GEO' AND a.nom = 'Geoffrey'
ON CONFLICT DO NOTHING;

-- LE TALU - Maïa est responsable
INSERT INTO projet_artistes (projet_id, artiste_id, role_projet)
SELECT p.id, a.id, 'responsable'
FROM projets p, artistes a
WHERE p.code = 'TALU' AND a.nom = 'Maïa'
ON CONFLICT DO NOTHING;

-- WP (Wireless People) - projet collectif
INSERT INTO projet_artistes (projet_id, artiste_id, role_projet)
SELECT p.id, a.id, 'responsable'
FROM projets p, artistes a
WHERE p.code = 'WP' AND a.nom = 'Maïa'
ON CONFLICT DO NOTHING;

-- LVLR - Geoffrey responsable
INSERT INTO projet_artistes (projet_id, artiste_id, role_projet)
SELECT p.id, a.id, 'responsable'
FROM projets p, artistes a
WHERE p.code = 'LVLR' AND a.nom = 'Geoffrey'
ON CONFLICT DO NOTHING;
