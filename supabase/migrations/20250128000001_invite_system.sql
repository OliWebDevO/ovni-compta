-- =============================================
-- O.V.N.I Compta - Système d'invitation sécurisé
-- Seul l'admin peut autoriser de nouveaux comptes
-- =============================================

-- =============================================
-- TABLE: allowed_emails (emails pré-autorisés)
-- =============================================
CREATE TABLE allowed_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  -- Lien optionnel vers un artiste existant (transition Google Sheets)
  artiste_id UUID REFERENCES artistes(id) ON DELETE SET NULL,
  -- Permission de créer un nouveau profil artiste à l'inscription
  -- Si true ET artiste_id est NULL, un artiste sera auto-créé
  can_create_artiste BOOLEAN NOT NULL DEFAULT false,
  -- Rôle qui sera attribué lors de l'inscription
  role user_role NOT NULL DEFAULT 'viewer',
  -- Qui a créé cette invitation
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  -- Est-ce que l'invitation a été utilisée ?
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMPTZ,
  -- Optionnel: date d'expiration de l'invitation
  expires_at TIMESTAMPTZ,
  -- Notes de l'admin
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les recherches rapides
CREATE INDEX idx_allowed_emails_email ON allowed_emails(email);
CREATE INDEX idx_allowed_emails_used ON allowed_emails(used);

-- =============================================
-- Ajouter artiste_id et couleur au profil utilisateur
-- =============================================
ALTER TABLE profiles
ADD COLUMN artiste_id UUID REFERENCES artistes(id) ON DELETE SET NULL;

ALTER TABLE profiles
ADD COLUMN couleur TEXT DEFAULT '#888888';

CREATE INDEX idx_profiles_artiste_id ON profiles(artiste_id);

-- =============================================
-- FONCTION: Vérifier si l'email est autorisé
-- =============================================
CREATE OR REPLACE FUNCTION check_email_allowed()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  allowed_record RECORD;
BEGIN
  -- Chercher l'email dans la liste des autorisés
  SELECT * INTO allowed_record
  FROM public.allowed_emails
  WHERE email = NEW.email
    AND used = false
    AND (expires_at IS NULL OR expires_at > NOW());

  -- Si pas trouvé, bloquer l'inscription
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inscription non autorisée. Contactez l''administrateur pour obtenir une invitation.';
  END IF;

  -- Tout est OK, l'inscription peut continuer
  RETURN NEW;
END;
$$;

-- Trigger qui s'exécute AVANT l'insertion d'un nouvel utilisateur
CREATE TRIGGER check_signup_allowed
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION check_email_allowed();

-- =============================================
-- FONCTION: Configurer le profil après inscription
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  allowed_record RECORD;
  v_artiste_id UUID;
  v_user_nom TEXT;
  v_couleur TEXT;
BEGIN
  -- Récupérer les infos de l'invitation
  SELECT * INTO allowed_record
  FROM public.allowed_emails
  WHERE email = NEW.email AND used = false;

  -- Nom et couleur choisis par l'utilisateur au signup
  v_user_nom := COALESCE(NEW.raw_user_meta_data->>'nom', split_part(NEW.email, '@', 1));
  v_couleur := COALESCE(NEW.raw_user_meta_data->>'couleur', '#888888');

  -- Déterminer l'artiste_id
  IF allowed_record.artiste_id IS NOT NULL THEN
    -- CAS 1: Artiste existant (transition depuis Google Sheets)
    v_artiste_id := allowed_record.artiste_id;

    -- Mettre à jour la couleur de l'artiste avec celle choisie au signup
    UPDATE public.artistes SET couleur = v_couleur WHERE id = v_artiste_id;

  ELSIF allowed_record.can_create_artiste = true THEN
    -- CAS 2: Nouveau membre de l'ASBL
    -- Créer un profil artiste avec la couleur choisie
    INSERT INTO public.artistes (nom, email, actif, couleur)
    VALUES (v_user_nom, NEW.email, true, v_couleur)
    RETURNING id INTO v_artiste_id;

  ELSE
    -- CAS 3: Viewer / observateur sans artiste lié
    v_artiste_id := NULL;
  END IF;

  -- Créer le profil utilisateur avec la couleur
  INSERT INTO public.profiles (id, email, nom, role, artiste_id, couleur)
  VALUES (
    NEW.id,
    NEW.email,
    v_user_nom,
    COALESCE(allowed_record.role, 'viewer'),
    v_artiste_id,
    v_couleur
  );

  -- Marquer l'invitation comme utilisée
  UPDATE public.allowed_emails
  SET used = true, used_at = NOW()
  WHERE email = NEW.email AND used = false;

  RETURN NEW;
END;
$$;

-- Le trigger on_auth_user_created existe déjà, on le remplace
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =============================================
-- RLS pour allowed_emails
-- =============================================
ALTER TABLE allowed_emails ENABLE ROW LEVEL SECURITY;

-- Seuls les admins peuvent voir/gérer les invitations
CREATE POLICY "Admins can view all invitations"
  ON allowed_emails FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can create invitations"
  ON allowed_emails FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update invitations"
  ON allowed_emails FOR UPDATE
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can delete invitations"
  ON allowed_emails FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- MISE À JOUR DES RLS: Artistes
-- Tous les utilisateurs peuvent VOIR, mais seuls certains peuvent MODIFIER
-- =============================================

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Authenticated users can view artistes" ON artistes;
DROP POLICY IF EXISTS "Admins and editors can create artistes" ON artistes;
DROP POLICY IF EXISTS "Admins and editors can update artistes" ON artistes;
DROP POLICY IF EXISTS "Admins can delete artistes" ON artistes;

-- Tous les utilisateurs authentifiés peuvent voir tous les artistes
CREATE POLICY "Authenticated users can view all artistes"
  ON artistes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Seul l'admin peut créer des artistes
CREATE POLICY "Only admin can create artistes"
  ON artistes FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- L'admin peut tout modifier, les autres peuvent modifier leur propre artiste
CREATE POLICY "Users can update own artiste or admin updates all"
  ON artistes FOR UPDATE
  USING (
    get_user_role(auth.uid()) = 'admin'
    OR id = (SELECT artiste_id FROM profiles WHERE id = auth.uid())
  );

-- Seul l'admin peut supprimer
CREATE POLICY "Only admin can delete artistes"
  ON artistes FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- MISE À JOUR DES RLS: Projets
-- Tous peuvent VOIR, mais modification restreinte
-- =============================================

DROP POLICY IF EXISTS "Authenticated users can view projets" ON projets;
DROP POLICY IF EXISTS "Admins and editors can create projets" ON projets;
DROP POLICY IF EXISTS "Admins and editors can update projets" ON projets;
DROP POLICY IF EXISTS "Admins can delete projets" ON projets;

-- Tous les utilisateurs authentifiés peuvent voir tous les projets
CREATE POLICY "Authenticated users can view all projets"
  ON projets FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admin et editors peuvent créer (pour leur artiste seulement sauf admin)
CREATE POLICY "Users can create projets for own artiste"
  ON projets FOR INSERT
  WITH CHECK (
    get_user_role(auth.uid()) = 'admin'
    OR (
      get_user_role(auth.uid()) IN ('admin', 'editor')
      AND artiste_id = (SELECT artiste_id FROM profiles WHERE id = auth.uid())
    )
  );

-- Modification de ses propres projets ou admin
CREATE POLICY "Users can update own projets or admin updates all"
  ON projets FOR UPDATE
  USING (
    get_user_role(auth.uid()) = 'admin'
    OR artiste_id = (SELECT artiste_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Only admin can delete projets"
  ON projets FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- MISE À JOUR DES RLS: Transactions
-- Tous peuvent VOIR, mais modification restreinte
-- =============================================

DROP POLICY IF EXISTS "Authenticated users can view transactions" ON transactions;
DROP POLICY IF EXISTS "Admins and editors can create transactions" ON transactions;
DROP POLICY IF EXISTS "Admins and editors can update transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can delete transactions" ON transactions;

-- Tous les utilisateurs authentifiés peuvent voir toutes les transactions
CREATE POLICY "Authenticated users can view all transactions"
  ON transactions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Création de transactions pour son propre artiste/projet ou admin
CREATE POLICY "Users can create transactions for own artiste"
  ON transactions FOR INSERT
  WITH CHECK (
    get_user_role(auth.uid()) = 'admin'
    OR (
      get_user_role(auth.uid()) IN ('admin', 'editor')
      AND (
        artiste_id = (SELECT artiste_id FROM profiles WHERE id = auth.uid())
        OR projet_id IN (
          SELECT id FROM projets
          WHERE artiste_id = (SELECT artiste_id FROM profiles WHERE id = auth.uid())
        )
      )
    )
  );

-- Modification de ses propres transactions ou admin
CREATE POLICY "Users can update own transactions or admin updates all"
  ON transactions FOR UPDATE
  USING (
    get_user_role(auth.uid()) = 'admin'
    OR artiste_id = (SELECT artiste_id FROM profiles WHERE id = auth.uid())
    OR projet_id IN (
      SELECT id FROM projets
      WHERE artiste_id = (SELECT artiste_id FROM profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Only admin can delete transactions"
  ON transactions FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- MISE À JOUR DES RLS: Transferts
-- Tous peuvent VOIR, seul l'admin peut MODIFIER
-- =============================================

DROP POLICY IF EXISTS "Authenticated users can view transferts" ON transferts;
DROP POLICY IF EXISTS "Admins and editors can create transferts" ON transferts;
DROP POLICY IF EXISTS "Admins and editors can update transferts" ON transferts;
DROP POLICY IF EXISTS "Admins can delete transferts" ON transferts;

-- Tous les utilisateurs authentifiés peuvent voir les transferts
CREATE POLICY "Authenticated users can view all transferts"
  ON transferts FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Seul l'admin peut créer/modifier/supprimer les transferts
CREATE POLICY "Only admin can create transferts"
  ON transferts FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Only admin can update transferts"
  ON transferts FOR UPDATE
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Only admin can delete transferts"
  ON transferts FOR DELETE
  USING (get_user_role(auth.uid()) = 'admin');

-- =============================================
-- SEED: Créer l'admin Maïa
-- À exécuter après avoir créé l'artiste Maïa
-- =============================================

-- Note: Tu devras d'abord:
-- 1. Créer l'artiste Maïa dans la table artistes
-- 2. Ajouter l'email de Maïa dans allowed_emails avec role='admin'
-- 3. L'email de Maïa doit correspondre à son email réel pour l'inscription

-- Exemple (à adapter avec l'email réel de Maïa):
-- INSERT INTO allowed_emails (email, role, notes)
-- VALUES ('maia@example.com', 'admin', 'Administratrice principale O.V.N.I');
