-- =============================================
-- O.V.N.I Compta - Données initiales
-- Seed des artistes et première invitation admin
-- =============================================

-- =============================================
-- Création des artistes existants
-- =============================================
INSERT INTO artistes (nom, actif, couleur, notes) VALUES
  ('Maïa', true, '#FF6B6B', 'Admin O.V.N.I'),
  ('Geoffrey', true, '#4ECDC4', 'Admin O.V.N.I'),
  ('Camille', true, '#45B7D1', NULL),
  ('Iris', true, '#96CEB4', NULL),
  ('Emma', true, '#FFEAA7', NULL),
  ('Greta', true, '#DDA0DD', NULL),
  ('Jul', true, '#98D8C8', NULL),
  ('Léa', true, '#F7DC6F', NULL),
  ('Lou', true, '#BB8FCE', NULL)
ON CONFLICT (nom) DO NOTHING;

-- =============================================
-- Création des projets existants
-- =============================================
INSERT INTO projets (nom, code, statut, description) VALUES
  ('GEO', 'GEO', 'actif', 'Projet Geoffrey'),
  ('LE TALU', 'TALU', 'actif', 'Projet Le Talu'),
  ('LVLR', 'LVLR', 'actif', 'Projet LVLR'),
  ('Wireless People', 'WP', 'actif', 'Projet Wireless People'),
  ('Poema', 'POEM', 'actif', 'Projet Poema')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- IMPORTANT: Première invitation admin (Maïa)
-- Remplacer 'maia@example.com' par l'email réel de Maïa
-- =============================================
-- Cette invitation permet à Maïa de s'inscrire comme admin
-- et d'être automatiquement liée à son profil artiste

-- Exemple (à décommenter et adapter avec les vrais emails):
--
-- INSERT INTO allowed_emails (email, role, artiste_id, can_create_artiste, notes)
-- VALUES (
--   'maia@real-email.com',
--   'admin',
--   (SELECT id FROM artistes WHERE nom = 'Maïa'),
--   false,
--   'Admin O.V.N.I - Maïa'
-- );
--
-- INSERT INTO allowed_emails (email, role, artiste_id, can_create_artiste, notes)
-- VALUES (
--   'geoffrey@real-email.com',
--   'admin',
--   (SELECT id FROM artistes WHERE nom = 'Geoffrey'),
--   false,
--   'Admin O.V.N.I - Geoffrey'
-- );

-- =============================================
-- Fonction helper pour l'admin: inviter un artiste existant
-- (transition depuis Google Sheets)
-- =============================================
CREATE OR REPLACE FUNCTION invite_artiste(
  p_email TEXT,
  p_artiste_nom TEXT,
  p_role user_role DEFAULT 'editor'
)
RETURNS UUID AS $$
DECLARE
  v_artiste_id UUID;
  v_invitation_id UUID;
BEGIN
  -- Vérifier que l'appelant est admin
  IF get_user_role(auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Seul un administrateur peut inviter des artistes';
  END IF;

  -- Trouver l'artiste
  SELECT id INTO v_artiste_id FROM artistes WHERE nom ILIKE p_artiste_nom;

  IF v_artiste_id IS NULL THEN
    RAISE EXCEPTION 'Artiste "%" non trouvé', p_artiste_nom;
  END IF;

  -- Créer l'invitation liée à l'artiste existant
  INSERT INTO allowed_emails (email, role, artiste_id, can_create_artiste, invited_by, notes)
  VALUES (
    p_email,
    p_role,
    v_artiste_id,
    false,
    auth.uid(),
    'Invitation pour rejoindre le compte artiste ' || p_artiste_nom
  )
  RETURNING id INTO v_invitation_id;

  RETURN v_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Fonction helper pour l'admin: inviter un nouveau membre
-- (nouveau artiste créé automatiquement à l'inscription)
-- =============================================
CREATE OR REPLACE FUNCTION invite_new_member(
  p_email TEXT,
  p_role user_role DEFAULT 'editor',
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_invitation_id UUID;
BEGIN
  -- Vérifier que l'appelant est admin
  IF get_user_role(auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Seul un administrateur peut créer des invitations';
  END IF;

  -- Créer l'invitation avec auto-création d'artiste
  INSERT INTO allowed_emails (email, role, can_create_artiste, invited_by, notes)
  VALUES (
    p_email,
    p_role,
    true,
    auth.uid(),
    COALESCE(p_notes, 'Nouveau membre - profil artiste auto-créé')
  )
  RETURNING id INTO v_invitation_id;

  RETURN v_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Fonction helper pour l'admin: inviter un viewer (spectateur)
-- =============================================
CREATE OR REPLACE FUNCTION invite_viewer(
  p_email TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_invitation_id UUID;
BEGIN
  -- Vérifier que l'appelant est admin
  IF get_user_role(auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Seul un administrateur peut créer des invitations';
  END IF;

  -- Créer l'invitation sans artiste
  INSERT INTO allowed_emails (email, role, can_create_artiste, invited_by, notes)
  VALUES (
    p_email,
    'viewer',
    false,
    auth.uid(),
    COALESCE(p_notes, 'Invitation viewer')
  )
  RETURNING id INTO v_invitation_id;

  RETURN v_invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Vue pour l'admin: voir les invitations et leur statut
-- =============================================
CREATE OR REPLACE VIEW invitations_status AS
SELECT
  ae.id,
  ae.email,
  ae.role,
  ae.used,
  ae.used_at,
  ae.expires_at,
  ae.notes,
  ae.created_at,
  a.nom AS artiste_nom,
  p.nom AS invited_by_nom
FROM allowed_emails ae
LEFT JOIN artistes a ON ae.artiste_id = a.id
LEFT JOIN profiles p ON ae.invited_by = p.id
ORDER BY ae.created_at DESC;

-- RLS pour la vue
ALTER VIEW invitations_status OWNER TO postgres;

-- =============================================
-- Guide d'utilisation pour l'admin
-- =============================================
--
-- 1. PREMIÈRES INSCRIPTIONS (Maïa et Geoffrey comme admins):
--    - Exécuter manuellement dans Supabase Studio:
--
--      INSERT INTO allowed_emails (email, role, artiste_id, can_create_artiste, notes)
--      VALUES ('email-de-maia@...', 'admin',
--              (SELECT id FROM artistes WHERE nom = 'Maïa'),
--              false, 'Admin O.V.N.I - Maïa');
--
--      INSERT INTO allowed_emails (email, role, artiste_id, can_create_artiste, notes)
--      VALUES ('email-de-geoffrey@...', 'admin',
--              (SELECT id FROM artistes WHERE nom = 'Geoffrey'),
--              false, 'Admin O.V.N.I - Geoffrey');
--
--    - Chacun peut ensuite s'inscrire avec son email
--    - Leur profil sera automatiquement lié à leur artiste
--
-- 2. INVITER UN ARTISTE EXISTANT (transition Google Sheets):
--    SELECT invite_artiste('geoffrey@example.com', 'Geoffrey', 'editor');
--    → L'utilisateur rejoindra son profil artiste existant
--
-- 3. INVITER UN NOUVEAU MEMBRE (futur artiste de l'ASBL):
--    SELECT invite_new_member('nouveau@example.com', 'editor', 'Nouveau musicien');
--    → Un profil artiste sera créé automatiquement à l'inscription
--
-- 4. INVITER UN VIEWER (comptable, observateur...):
--    SELECT invite_viewer('comptable@example.com', 'Comptable externe');
--    → Accès lecture seule, pas de profil artiste
--
-- 5. VOIR LES INVITATIONS:
--    SELECT * FROM invitations_status;
--
