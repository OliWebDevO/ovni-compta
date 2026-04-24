-- =============================================
-- Auth user triggers : extraction des fonctions et triggers existants
--
-- Ces objets ont été créés directement via Supabase Studio (hors migrations)
-- et sont indispensables au bon fonctionnement de l'application :
--
--   1. check_email_allowed()           : bloque les inscriptions non invitées
--   2. delete_invitation_on_user_delete() : nettoie allowed_emails à la suppression
--   3. check_signup_allowed (trigger)  : appelle (1) avant tout INSERT sur auth.users
--   4. on_auth_user_deleted (trigger)  : appelle (2) après tout DELETE sur auth.users
--
-- Sans ces objets, l'app permet n'importe quelle inscription et conserve des
-- lignes orphelines dans allowed_emails après suppression d'un utilisateur.
-- Cette migration les versionne pour qu'ils soient recréés automatiquement
-- sur tout nouvel environnement (dev, staging, reset prod).
-- =============================================

-- =============================================
-- FONCTION 1 : check_email_allowed
-- Bloque l'inscription si l'email n'est pas dans allowed_emails (non utilisé,
-- non expiré). Sinon laisse l'inscription se poursuivre normalement.
-- =============================================
CREATE OR REPLACE FUNCTION public.check_email_allowed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  allowed_record RECORD;
BEGIN
  SELECT * INTO allowed_record
  FROM public.allowed_emails
  WHERE email = NEW.email
    AND used = false
    AND (expires_at IS NULL OR expires_at > NOW());

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inscription non autorisée. Contactez l''administrateur pour obtenir une invitation.';
  END IF;

  RETURN NEW;
END;
$function$;

-- =============================================
-- FONCTION 2 : delete_invitation_on_user_delete
-- Supprime la ligne allowed_emails correspondante quand un user est supprimé,
-- pour permettre une ré-invitation immédiate du même email.
-- =============================================
CREATE OR REPLACE FUNCTION public.delete_invitation_on_user_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.allowed_emails
  WHERE email = OLD.email;
  RETURN OLD;
END;
$function$;

-- =============================================
-- TRIGGERS sur auth.users
-- DROP IF EXISTS pour rendre la migration idempotente
-- =============================================

DROP TRIGGER IF EXISTS check_signup_allowed ON auth.users;
CREATE TRIGGER check_signup_allowed
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_email_allowed();

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_invitation_on_user_delete();
