-- =============================================
-- Compte admin temporaire pour test (Oliver)
-- À supprimer une fois l'app testée et prête
-- =============================================

INSERT INTO allowed_emails (email, role, artiste_id, can_create_artiste, notes)
VALUES (
  'oliver-vdb@hotmail.com',
  'admin',
  NULL,
  false,
  'Admin temporaire - test & onboarding des vrais admins (Maïa & Geoffrey)'
);
