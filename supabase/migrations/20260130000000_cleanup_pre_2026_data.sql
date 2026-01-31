-- =============================================
-- O.V.N.I Compta - Nettoyage des données antérieures à 2026
-- =============================================
--
-- Suite aux problèmes de cohérence entre les données importées
-- et les Google Sheets originaux, nous supprimons toutes les
-- données historiques (2021-2025) et ne gardons que 2026.
--
-- Les données historiques restent disponibles dans les Google
-- Sheets originaux et servent de référence officielle.
--

-- Supprimer les transferts liés aux transactions avant 2026
DELETE FROM transferts
WHERE transaction_source_id IN (
  SELECT id FROM transactions WHERE date < '2026-01-01'
)
OR transaction_destination_id IN (
  SELECT id FROM transactions WHERE date < '2026-01-01'
);

-- Supprimer toutes les transactions avant 2026
DELETE FROM transactions WHERE date < '2026-01-01';

-- Vérification
SELECT
  'Transactions restantes' as metric,
  COUNT(*) as value
FROM transactions
UNION ALL
SELECT
  'Date min restante',
  MIN(date)::text::bigint
FROM transactions
UNION ALL
SELECT
  'Date max restante',
  MAX(date)::text::bigint
FROM transactions;
