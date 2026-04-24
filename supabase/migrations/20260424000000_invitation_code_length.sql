-- =============================================
-- Fix: Augmenter la taille du code d'invitation de 6 à 10 caractères
-- Le générateur de code dans src/lib/invitations/actions.ts produit
-- des codes de 10 caractères (renforcement sécurité), mais la colonne
-- était dimensionnée pour 6 caractères, ce qui provoquait l'erreur :
-- "value too long for type character varying(6)" lors d'une invitation.
-- =============================================

ALTER TABLE public.allowed_emails
  ALTER COLUMN code TYPE varchar(10);
