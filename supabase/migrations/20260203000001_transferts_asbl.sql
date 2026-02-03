-- Migration: Ajouter 'asbl' comme type de compte pour les transferts
-- Cette migration permet les transferts depuis/vers la Caisse OVNI (ASBL)
--
-- IMPORTANT: En raison d'une limitation PostgreSQL, cette migration doit être
-- exécutée en DEUX ÉTAPES SÉPARÉES dans le SQL Editor de Supabase.
--
-- ============================================================================
-- ÉTAPE 1: Exécuter d'abord cette commande seule, puis cliquer sur "Run"
-- ============================================================================

ALTER TYPE compte_type ADD VALUE IF NOT EXISTS 'asbl';

-- ============================================================================
-- ÉTAPE 2: Après avoir exécuté l'étape 1, exécuter le reste ci-dessous
-- ============================================================================

-- Supprimer les anciennes contraintes
-- ALTER TABLE transferts DROP CONSTRAINT IF EXISTS check_source_coherence;
-- ALTER TABLE transferts DROP CONSTRAINT IF EXISTS check_destination_coherence;

-- Ajouter les nouvelles contraintes qui supportent 'asbl'
-- Pour ASBL: les deux IDs (artiste et projet) sont null
-- ALTER TABLE transferts ADD CONSTRAINT check_source_coherence CHECK (
--   (source_type = 'artiste' AND source_artiste_id IS NOT NULL AND source_projet_id IS NULL) OR
--   (source_type = 'projet' AND source_projet_id IS NOT NULL AND source_artiste_id IS NULL) OR
--   (source_type = 'asbl' AND source_artiste_id IS NULL AND source_projet_id IS NULL)
-- );

-- ALTER TABLE transferts ADD CONSTRAINT check_destination_coherence CHECK (
--   (destination_type = 'artiste' AND destination_artiste_id IS NOT NULL AND destination_projet_id IS NULL) OR
--   (destination_type = 'projet' AND destination_projet_id IS NOT NULL AND destination_artiste_id IS NULL) OR
--   (destination_type = 'asbl' AND destination_artiste_id IS NULL AND destination_projet_id IS NULL)
-- );
