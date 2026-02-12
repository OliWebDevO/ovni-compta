-- =============================================
-- Security fixes: Views SECURITY INVOKER + Functions search_path
-- Fixes 6 Supabase security errors + 6 warnings
-- =============================================

-- =============================================
-- FIX 1: Views - Enable security_invoker
-- By default, views use the permissions of the view OWNER
-- (equivalent to SECURITY DEFINER). Setting security_invoker = on
-- makes them use the permissions of the QUERYING user instead,
-- which respects RLS policies properly.
-- =============================================

ALTER VIEW public.projets_with_stats SET (security_invoker = on);
ALTER VIEW public.bilans_annuels SET (security_invoker = on);
ALTER VIEW public.projets_with_artistes SET (security_invoker = on);
ALTER VIEW public.invitations_status SET (security_invoker = on);
ALTER VIEW public.artistes_with_stats SET (security_invoker = on);
ALTER VIEW public.bilans_mensuels SET (security_invoker = on);

-- =============================================
-- FIX 2: Functions - Set search_path
-- Without an explicit search_path, functions are vulnerable to
-- search_path hijacking attacks where a malicious schema could
-- shadow public tables/functions.
-- =============================================

ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.get_user_role(UUID) SET search_path = public;
ALTER FUNCTION public.invite_artiste(TEXT, TEXT, user_role) SET search_path = public;
ALTER FUNCTION public.invite_new_member(TEXT, user_role, TEXT) SET search_path = public;
ALTER FUNCTION public.invite_viewer(TEXT, TEXT) SET search_path = public;

-- delete_invitation_on_user_delete exists in database but not in migrations
-- Use DO block to handle it conditionally
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'delete_invitation_on_user_delete'
    AND pronamespace = 'public'::regnamespace
  ) THEN
    EXECUTE 'ALTER FUNCTION public.delete_invitation_on_user_delete() SET search_path = public';
  END IF;
END;
$$;
