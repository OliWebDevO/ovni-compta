-- =============================================
-- O.V.N.I Compta - Import des transactions
-- Généré automatiquement depuis Google Sheets
-- 2026-01-28T15:08:25.610Z
-- =============================================

-- Total: 533 transactions


-- =============================================
-- Artiste: Greta (15 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2020-03-24', 'atelier T', 480, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2021-07-07', 'Transaction', 75, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2021-07-16', 'Transaction', 100, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2021-07-23', 'Transaction', 600, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2021-10-18', 'Transaction', 80, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2021-12-03', 'Transaction', 760, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-03-01', 'Transaction', 150, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-05-04', 'atelier T', 740, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-05-05', 'zinn / prod / WP', 500, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-05-05', 'L-A Taymans', 0, 300, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-05-05', 'courants dair prod', 500, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-05-24', 'atelier T', 520, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-06-14', '(maïa notes de frais)', 0, 135, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-06-20', '(maïa montage)', 0, 130, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre'),
  ('2022-08-08', 'atelier T', 560, 0, (SELECT id FROM artistes WHERE nom = 'Greta'), NULL, 'autre')
ON CONFLICT DO NOTHING;

-- =============================================
-- Artiste: Maïa (172 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2021-01-10', 'ONSS dimona', 0, 771.36, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-03-03', 'avance cam def montreuil', 0, 201.3, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-03-03', 'avance cam bureau materiel TOS', 0, 64.71, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-03-10', 'achat camera', 0, 400, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-03-11', 'assurance travail ETHIAS', 0, 33.48, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-03-18', 'wireless / formation atelier ccbw', 240, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-03-26', 'camille interne > remb 1/2', 582, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'transfert_interne'),
  ('2021-03-27', 'laurene marx 1/2', 2513.3, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-03-29', 'contribution amende', 0, 25, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-03-31', 'wp aec molenbeek', 240, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-04-01', 'frais triodos', 0, 3.75, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'frais_bancaires'),
  ('2021-04-01', 'frais triodos', 0, 1.87, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'frais_bancaires'),
  ('2021-04-05', 'erratum frais', 0, 3.6, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-04-10', 'loc matos forzée', 50, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2021-04-12', 'remb cam 2/2', 305.03, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-04-12', 'loc matos atelier 210', 50, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2021-04-18', 'koulounisation', 522, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-04-18', 'koulounisation', 75, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-06-21', 'prod', 0, 100, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-08-19', 'rap 1/2', 800, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-09-12', 'L. Marx 2/2', 3066.26, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-10-03', 'frais retour suisse', 0, 79.42, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-10-16', 'residence "" dijon', 0, 249.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-10-22', 'taxi lausanne retour', 0, 64, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'deplacement'),
  ('2021-10-27', 'remb 1', 31.6, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-10-27', 'remb 2', 117, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-10-27', 'maïa residence dijon > bxl', 0, 131.25, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-10-27', 'maïa residence bxl > laus', 0, 59.99, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-10-27', 'maïa residence laus > dijon', 0, 77, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-11-08', 'rpi syl', 1000, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-11-11', 'vst', 0, 35.28, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-11-16', 'dijon paris aec wp', 0, 48, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-11-17', 'matos thomann', 0, 330.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'thoman'),
  ('2021-11-17', 'retour paris bx dyke', 0, 59, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-12-02', 'achat micro', 0, 525.3, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2021-12-03', 'monta dijon', 500, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-12-09', 'loyer communa decembre', 0, 110, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'loyer'),
  ('2021-12-20', 'sturmfrei', 2800, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-12-20', 'contrat sturm', 0, 1336, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-12-23', 'VST', 0, 35.1, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-12-23', 'FL STUDIO', 0, 379, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-12-27', 'rap 2/2', 200, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2021-12-31', 'residence hiver - trajets aller', 0, 16.4, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'deplacement'),
  ('2021-12-31', 'Transaction', 0, 33.01, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-01-10', 'PP', 0, 166.98, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-03-21', 'Matériel', 0, 1028, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-03-21', 'arr betina', 185, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-06-02', 'bo come chate.', 454, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-06-02', 'bo côme', 0, 454, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-10-04', 'X Mathieu', 400, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-10-19', 'prix Sturmfrei', 1007.76, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-11-01', 'rpi octobre', 0, 1000, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2022-12-05', 'photo varia projet heloise ravet', 500, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-02-02', 'PART RIDEAU WIRELESS', 1900, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-03-21', 'MAIA / frais matos', 0, 168.8, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2023-05-18', 'Transfert argent voiture maïa à greta', 0, 2000, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'transfert_interne'),
  ('2023-06-26', 'Wireless / bellone atelier', 225, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-09-04', 'MAISON POEME ATELIER WP', 250, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-09-12', 'thomann matériel', 0, 1287.68, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'thoman'),
  ('2023-10-05', 'margaux guy / genderpanik', 0, 1900, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-10-26', 'sturmfrei / yverdon', 1599.84, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-10-31', 'Transaction', 300, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-11-22', 'frais de transport - valse des monstres', 0, 192, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-11-22', 'frais matériel - Maïa (WP)', 0, 1402.99, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-11-23', 'cie murmures/emilie parmentier', 1781.52, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2023-12-20', 'CDN st etienne', 1162.98, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-01-01', 'frais triodos', 0, 1.95, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'frais_bancaires'),
  ('2024-01-09', 'greta / matos', 50, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2024-01-09', 'matériel zoom', 0, 299.98, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-02-01', 'ordi 2', 0, 1509, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-05-03', 'facture RE_73360208 (fais cagnotte)', 0, 598, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-05-03', '(facture RE_73195194) >> Talu/Maïa split', 0, 226, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-08-23', 'koltes / poche geneve', 6226.58, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-10-01', 'pour greta / guestfest', 0, 200, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-10-01', 'frais triodos', 0, 0.34, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'frais_bancaires'),
  ('2024-10-01', 'piano part perso', 0, 981, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-10-01', 'accessoires show live', 0, 463, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-10-10', 'fabfilter/mix', 0, 899, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-10-14', 'in ears', 0, 255, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-10-28', 'part micro', 0, 104.76, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2024-11-06', 'frais visa', 0, 24, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-11-10', 'genelec', 0, 1083.8, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-11-12', 'gaffe', 0, 42.94, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-11-17', 'livres (TOS)', 0, 30, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-11-22', 'remb via (compte talu)', 74.78, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-12-04', 'achat vst', 0, 78.69, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-12-06', 'achat vst', 0, 43.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-12-06', 'achat vst', 0, 99.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-12-18', 'repas prod TOS', 0, 42.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-12-28', 'TOS livre', 0, 22.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2024-12-31', 'recy / hyenna', 400, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-01-01', 'frais triodos', 0, 0.34, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'frais_bancaires'),
  ('2025-01-22', 'micro cam', 0, 49.99, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-01-23', 'avance ordi talu', 0, 454.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-01-23', 'ordi talu remb 1', 180, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-02-05', 'paye bota 01/02', 100, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-02-05', 'loc matos BOTA 01/02', 50, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-02-05', 'avance train dijon', 0, 265.65, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'deplacement'),
  ('2025-02-05', 'ordi remb 2', 100, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-02-09', 'synthé diego', 0, 250, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-02-09', 'matos thomann', 0, 224.6, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'thoman'),
  ('2025-02-11', 'tascam portastudio', 0, 322.99, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-02-11', 'avance cam liquide', 0, 37.9, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-02-21', 'avance cam cocof', 0, 126, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-03-01', 'avance cam pyro', 0, 191.47, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-04-10', 'remb ordi talu 3/3', 174.5, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-04-12', 'paie atelier 210', 190, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-04-15', 'materiel thomann commande RE_80979776', 0, 77, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'thoman'),
  ('2025-04-15', 'boite', 0, 68, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-04-15', '(pochette)', 0, 79, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-04-15', '(pied)', 0, 162, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-04-15', '(erreur livraison)', 0, 56.82, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-04-18', 'achat de greta iphone 13 (> interne)', 200, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'transfert_interne'),
  ('2025-04-21', 'remb parking amsterdam > cam interne', 90, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'transfert_interne'),
  ('2025-04-23', 'paie EDEN', 190, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-04-23', 'loc materiel EDEN', 50, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-04', 'courses try_love', 0, 150.94, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-07', 'pedale fx (dyke)', 0, 16, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-07', 'materiel (dyke)', 0, 1325, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-08', 'batterie camera', 0, 68.99, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-11', 'acat livres', 0, 58, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-15', 'rencontre echelle marseille 1/2', 750, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-18', 'achat materiel', 0, 666.9, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-26', 'def marseille', 154.6, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-05-31', 'dyke injection parking', 0, 7, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-06-04', 'paie residence inouis + loc matos', 250, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-06-04', 'loc materiel STRASBOURG', 50, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-06-20', 'Sturmfrei marseille 2/2', 750, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-07-08', 'FDM loc matos', 50, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-07-08', 'FDM paie', 200, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-07-08', 'LAUSANNE loc matos', 50, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-07-08', 'LAUSANNE paie', 200, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-07-09', 'ACHAT BASSE', 0, 388, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-07-15', 'LIFT demenagemen studio interne', 200, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'transfert_interne'),
  ('2025-07-26', 'RAIL PASS JAPAN', 0, 463.78, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-07-26', 'remb. machine à fumée (interne)', 20, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'transfert_interne'),
  ('2025-07-26', 'matos thomann', 0, 77.7, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'thoman'),
  ('2025-08-04', 'DOUR paie + loc', 250, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-08-04', 'BOOMTOWN paie + loc', 250, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-08-26', 'remb. retour L. marx', 0, 70, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-08-26', 'remb aller L. marx', 0, 361.93, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-08-29', 'achat ordi', 0, 2809.22, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-09-01', 'remb. billet aller bx paris talu', 30, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-09-18', 'piano electro 6D', 0, 1899, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-09-22', 'machine a fumée cocof (interne)', 10, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'transfert_interne'),
  ('2025-10-05', 'BELLEVILOISE _ paie + loc matos', 250, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-10-09', 'frais communa', 0, 28.245, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'loyer'),
  ('2025-10-13', 'FRANCOFAUNE_paie + loc matos', 250, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-11-28', 'paie + loc matos berne + louvain', 500, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2025-12-04', 'paie maïa paris + bulle', 500, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-12-23', 'paie toulouse + paris', 500, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2025-12-23', 'studio install', 0, 45.875, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-01', 'residence hiver - trajets aller', 0, 30, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'deplacement'),
  ('2026-01-03', 'Transaction', 0, 55.01, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-03', 'Transaction', 0, 68.02, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-03', 'Transaction', 0, 17.7, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-03', 'Transaction', 0, 3.7, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-03', 'Transaction', 0, 2.6, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-03', 'Transaction', 0, 2.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-03', 'Transaction', 0, 28, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-06', 'matos 1', 0, 115.4, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2026-01-06', 'matos 2', 0, 1518, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel'),
  ('2026-01-06', 'loyer communa janv', 0, 1.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'loyer'),
  ('2026-01-12', 'residence hiver retour', 0, 65, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-12', 'Transaction', 0, 33.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-12', 'Transaction', 0, 2.5, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-12', 'Transaction', 0, 2.6, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-12', 'Transaction', 0, 20.1, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-14', 'Transaction', 0, 78.03, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-14', 'Transaction', 0, 42, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'autre'),
  ('2026-01-27', 'aec grenoble interne', 225, 0, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'transfert_interne'),
  ('2026-01-27', 'organelle synth', 0, 538.92, (SELECT id FROM artistes WHERE nom = 'Maïa'), NULL, 'materiel')
ON CONFLICT DO NOTHING;

-- =============================================
-- Artiste: Geoffrey (23 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2021-08-19', 'Transaction', 800, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2021-11-08', 'Transaction', 1000, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2021-12-27', 'Transaction', 200, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2022-01-14', 'Transaction', 1492, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2022-01-26', 'Transaction', 0, 1000, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2022-01-26', 'Transaction', 0, 800, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2022-01-26', 'Transaction', 0, 100, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2022-01-26', 'Transaction', 0, 1442, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2022-12-20', 'GEO / jeunesse musicale', 200, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-01-31', 'GEO / junayid', 400, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-01-31', 'GEO / junayid', 450, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-03-02', 'GEO / frituuur', 1000, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-03-16', 'centre scolaire ma campagne', 500, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-04-14', 'ethias + frais', 0, 41.17, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-05-16', 'Transaction', 836.57, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-07-01', 'frais triodos', 0, 1.95, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'frais_bancaires'),
  ('2023-10-01', 'triodos frais', 0, 3.75, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'frais_bancaires'),
  ('2023-10-17', 'Ester Garcia', 100, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-11-15', 'smart paiement Geo', 0, 618.96, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'smart'),
  ('2023-11-15', 'smart paiement Geo (erreur du premier payement', 0, 37.14, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'smart'),
  ('2023-11-15', 'smart paiement marie', 0, 1928.21, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'smart'),
  ('2023-11-21', 'Déclaration de créance (15/11)', 0, 150, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre'),
  ('2023-11-28', 'F 50 Roseraie', 100, 0, (SELECT id FROM artistes WHERE nom = 'Geoffrey'), NULL, 'autre')
ON CONFLICT DO NOTHING;

-- =============================================
-- Artiste: Léa (6 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2024-01-29', 'contrat smart', 0, 1111.41, (SELECT id FROM artistes WHERE nom = 'Léa'), NULL, 'smart'),
  ('2024-06-19', 'facture F109 -- les midis de la poésie (ateliers 26/05/25 - 2/06/25 - 27/06/25 -- tisser son histoire)', 900, 0, (SELECT id FROM artistes WHERE nom = 'Léa'), NULL, 'autre'),
  ('2024-07-10', 'facture F110 -- les midis de la poésie (atelier 19/06/25 -- tisser son histoire)', 306, 0, (SELECT id FROM artistes WHERE nom = 'Léa'), NULL, 'autre'),
  ('2024-09-25', 'Facturé via la smart', 0, 1206, (SELECT id FROM artistes WHERE nom = 'Léa'), NULL, 'smart'),
  ('2024-12-19', 'facture F78', 850, 0, (SELECT id FROM artistes WHERE nom = 'Léa'), NULL, 'autre'),
  ('2024-12-19', 'facture F79', 338.3, 0, (SELECT id FROM artistes WHERE nom = 'Léa'), NULL, 'autre')
ON CONFLICT DO NOTHING;

-- =============================================
-- Artiste: Jul (47 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2025-01-23', 'recyclart 14/12', 30, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-02-05', 'bota 01/02', 40, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-04-23', 'paie EDEN', 50, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-05-17', 'jul / dour (1/2)', 500, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-05-17', '/ dour', 220, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-05-19', 'jul / labo des possibles', 500, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-05-19', 'jul / labo des possibles', 250, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-06-04', 'paie residence inouis', 100, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-04', 'LIEGE/13 rue roture', 500, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-04', 'LIEGE/13 rue roture', 250, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-07', 'SUSSOL', 250, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-07', 'SUSSOL', 125, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-08', 'FDM - paye jul (talu)', 50, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-08', 'LAUSANNE - paye jul (talu)', 50, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-23', 'Typo BIG PHARMA', 0, 200, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-23', 'Clip Julien Playout', 0, 1400, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-07-23', 'jul / dour (2/2)', 500, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-08-03', 'micro festival', 296, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'materiel'),
  ('2025-08-06', 'jul/microfestival', 500, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'materiel'),
  ('2025-08-28', 'pes', 0, 530, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-09-10', 'master adrien', 0, 60.5, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-05', 'FRANCOFAUNE', 790, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-05', 'FRANCOFAUNE', 197.5, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-21', 'FACTURE MELISSA', 0, 99.99, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-24', 'FACTURE SACHA', 0, 318, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-25', 'PAIEMENT DACHSTOK', 500, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-25', 'DEFRAIEMENT DACHSTOK', 250, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-25', 'DACHSTOCK', 250, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-27', 'ATELIERS indigo', 381.43, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-10-27', 'REFACTURATION EVELYNE CLUB', 0, 197.23, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-10', 'MASTER MIXTAPE', 0, 484, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-18', 'PAIEMENT CONCERT SAINT_ETIENNE', 500, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'cachet'),
  ('2025-11-18', 'COVER MIXTAPE NEO', 0, 530, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-21', 'VJING LIVE SESSION', 100, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-22', 'CONCERT LOFT58', 200, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'cachet'),
  ('2025-11-22', 'LOFT58', 100, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-26', 'PAIEMENT ALICIA GONNET', 0, 318, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-26', 'PAIEMENT TYPO', 0, 200, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-29', 'CONFLIKARTS CD', 0, 30.25, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-29', 'CONFLIKARTS CD', 0, 306.8, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-11-29', 'MICROFESTIVAL', 390, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'materiel'),
  ('2025-11-29', 'BUDA BRUSSELS', 0, 574.75, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-12-18', 'BOURSE SABAM', 1452.5, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2025-12-24', 'BOURSE SABAM', 1150, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2026-01-04', 'PRINT UNITED', 0, 79.41, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2026-01-16', 'BOTANIQUE', 250, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre'),
  ('2026-01-27', 'BOTANIQUE RELEASE PARTY', 1000, 0, (SELECT id FROM artistes WHERE nom = 'Jul'), NULL, 'autre')
ON CONFLICT DO NOTHING;

-- =============================================
-- Artiste: Lou (3 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2025-01-23', 'recyclart 14/12', 76, 0, (SELECT id FROM artistes WHERE nom = 'Lou'), NULL, 'autre'),
  ('2025-03-28', 'paie atelier', 190, 0, (SELECT id FROM artistes WHERE nom = 'Lou'), NULL, 'autre'),
  ('2025-04-10', 'paie forzée', 190, 0, (SELECT id FROM artistes WHERE nom = 'Lou'), NULL, 'autre')
ON CONFLICT DO NOTHING;

-- =============================================
-- Artiste: Camille (35 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2025-04-01', 'frais triodos', 0, 1.87, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'frais_bancaires'),
  ('2025-04-11', 'dijon ensa', 2253.1, 0, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-04-12', 'remb maïa interne', 0, 305.03, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'transfert_interne'),
  ('2025-04-21', 'remb parking amsterd', 0, 90, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-05-15', 'docs de noirmoutiers', 140, 0, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-05-17', 'remb livres DYKE INJECTION', 0, 190.95, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-05-17', 'remb stickers OLB communication', 0, 84.8, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-05-25', 'catering résidence_intermarché_dykeinjection', 0, 142.97, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-06-02', 'catering résidence_certrisys magasin bio schaerbeek_dykeinjection', 0, 22.64, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-06-05', 'photocopie papeterie poels_dykeinjection', 0, 3.9, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-06-06', 'photocopie papeterie poels_dykeinjection', 0, 5.8, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-06-17', 'materiel recherche_action_dykeinjection', 0, 24.12, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-06-24', 'catering résidence_proxy_dykeinjection', 0, 32, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-06-26', 'catering résidence_proxy_dykeinjection', 0, 17.07, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-06-28', 'rdv prod_la biche_dykeinjection', 0, 42.8, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-07-04', 'histoire de l''oeil_livre dramaturgie_dyke injection', 0, 72.5, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-07-31', 'l''hydre à 1000 tetes_livres dramaturgie_dyke injection', 0, 52.2, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-09-01', 'shell_essence_ residence factory', 0, 58.26, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-09-03', 'intermarché_catering résidence factory_dyke injection', 0, 113.79, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-09-09', 'loopearplugs_matériel technique son_dyke injection_résidence factory', 0, 74.91, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-09-09', 'épisode_costume factory_ dyke injection', 0, 7.5, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-10-13', 'FRAIS TRIODOS', 0, 1.5, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'frais_bancaires'),
  ('2025-11-17', 'FRAIS TRIODOS CARTE', 0, 2.4, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'frais_bancaires'),
  ('2025-12-17', 'livres tropismes_dyke injection', 0, 8.4, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-17', 'livres tulitu_dyke injection', 0, 72, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-18', 'defraiement catering naturalia_résidence scenographie_dyke injection', 0, 23.48, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-18', 'transports ratp_résidence scénographie_dyke injection', 0, 5, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-19', 'defraiement catering centre pouya_résidence scenographie_dyke injection', 0, 81, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-19', 'transports ratp_résidence scénographie_dyke injection', 0, 10, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-20', 'defraiement catering bistro du marché_résidence scenographie_dyke injection', 0, 32.05, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-20', 'defraiement catering hotel du nord_résidence scenographie_dyke injection', 0, 21, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-23', 'livres centrale librairie_dyke injection', 0, 25, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-23', 'livres wallonie bruxelles paris_dyke injection', 0, 26.9, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2025-12-26', 'livres l''hydre aux milles tetes_dyke injection', 0, 10, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'autre'),
  ('2026-01-06', 'frais triodos', 0, 1.5, (SELECT id FROM artistes WHERE nom = 'Camille'), NULL, 'frais_bancaires')
ON CONFLICT DO NOTHING;

-- =============================================
-- Artiste: Emma (15 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2025-05-26', 'facture livia rita #1 (mars)', 1162.5, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'autre'),
  ('2025-06-07', 'wp interne – mise en page label impact', 300, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'transfert_interne'),
  ('2025-06-10', 'don anna bagnari', 5000, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'autre'),
  ('2025-06-14', 'smart contrat #1 – wireless people costumes 2025-2026', 0, 3725, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'smart'),
  ('2025-06-25', 'facture le rideau sérigraphie', 236.13, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'autre'),
  ('2025-06-25', 'facture livia rita #2 (avril-mai + frais transports)', 3660.9, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'autre'),
  ('2025-07-11', 'smart contrat #2 – costumes x livia rita', 0, 4107.5, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'smart'),
  ('2025-07-21', 'facture livia rita #3 (juin)', 1399.17, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'autre'),
  ('2025-07-29', 'facture rent + café expenses BR livia rita', 0, 252.9, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'autre'),
  ('2025-08-01', 'interne from talu', 200, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'transfert_interne'),
  ('2025-08-12', 'smart contrat #3 – costumes x livia rita', 0, 2150, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'smart'),
  ('2025-09-12', 'atelier 210 – budget materiel scénographie POV', 400, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'autre'),
  ('2025-09-22', 'smart contrat #4 – scénographie POV', 0, 1600, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'smart'),
  ('2025-10-27', 'atelier 210 – budget materiel scénographie POV', 1000, 0, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'autre'),
  ('2026-01-06', 'FRAIS TRIODOS', 0, 1.5, (SELECT id FROM artistes WHERE nom = 'Emma'), NULL, 'frais_bancaires')
ON CONFLICT DO NOTHING;

-- =============================================
-- Artiste: Iris (2 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2025-05-30', 'Iris / don asbl', 50, 0, (SELECT id FROM artistes WHERE nom = 'Iris'), NULL, 'autre'),
  ('2026-01-20', 'Intrusive R1', 783, 0, (SELECT id FROM artistes WHERE nom = 'Iris'), NULL, 'autre')
ON CONFLICT DO NOTHING;

-- =============================================
-- Projet: POEM (45 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2021-01-01', 'FRAIS triodos', 0, 0.34, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'frais_bancaires'),
  ('2021-01-05', 'poem / Ruinlst', 0, 117.66, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2021-01-05', 'poem / stabat', 0, 700, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2021-03-24', 'sortie de residence / animakt', 1000, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2021-04-01', 'fraius triodos', 0, 3.75, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2021-04-09', 'animakt', 0, 1000, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2021-06-07', 'mise en demeure OBJ026/162501469175', 0, 977.18, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2021-06-23', 'Transaction', 1700, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2021-06-27', 'Transaction', 750, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2021-07-21', 'Transaction', 513, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2022-10-03', 'Transaction', 2830, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2022-10-05', 'Transaction', 655.22, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2022-10-05', 'Transaction', 160, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2022-10-10', 'Transaction', 3790, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2022-10-21', 'Transaction', 373, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2022-11-01', 'Transaction', 0, 4507.98, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2022-11-15', 'Transaction', 0, 561.86, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2022-12-19', 'Transaction', 570, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-06-06', 'POEMA / GORILLAS', 2000, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-06-08', 'POEMA / NAMUR EN MAI', 2000, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-06-16', 'POEMA / FWB', 285, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'subvention'),
  ('2023-06-21', 'poema décla de créance / legoboum', 0, 1000, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-06-26', 'POEM / Combadego', 285, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-07-24', 'POEM / MADAME VERO / FRITTUR', 450, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-07-26', 'POEM / CC brabant wallon', 1800, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-08-20', 'POEM / CAPTA 1/2', 0, 628.5, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-08-27', 'POEM / dramaturgie legoboum', 0, 1323.45, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-08-30', 'POEM / fete artisan chassepierre', 3415, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-09-04', 'POEM / fete artisan chassepierre', 1140, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-09-11', 'POEM / asbl nem', 0, 285, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-09-14', 'POEM / scene du bocage', 2830, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-09-27', 'POEM / CAPTA 2/2', 0, 628.5, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-10-03', 'POEM / herve combadego', 570, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-10-23', 'POEM / scene du bocage surplus', 0, 285, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-10-26', 'POEM / sub prov chassepierre', 285, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2023-12-04', 'province de liege', 285, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2024-01-01', 'frais triodos', 0, 1.95, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'frais_bancaires'),
  ('2024-03-11', 'ethias assurance 2024', 0, 33.47, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2024-05-05', 'legoboum / pedales', 0, 1400, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2024-07-27', 'Emma', 0, 850, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2024-08-02', 'Combadego', 0, 1882.94, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2024-08-02', 'combadego', 0, 3200, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2024-08-13', 'combadego / thonon', 3800, 0, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2024-09-11', 'poem / clovis bonnemason', 0, 1036.4, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'autre'),
  ('2024-10-01', 'frais triodos', 0, 0.3425, NULL, (SELECT id FROM projets WHERE code = 'POEM'), 'frais_bancaires')
ON CONFLICT DO NOTHING;

-- =============================================
-- Projet: LVLR (24 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2024-01-15', 'Transaction', 0, 1400, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-06-09', 'Transaction', 0, 1000, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-07-01', 'Transaction', 0, 1140, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-07-16', 'Transaction', 0, 1250, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-08-11', 'Transaction', 0, 990, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-08-11', 'Transaction', 0, 1240, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-09-10', 'Transaction', 0, 1250, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-09-18', 'Transaction', 0, 1500, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-10-14', 'Transaction', 0, 1500, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2024-12-13', 'Transaction', 0, 900, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2025-02-04', 'Transaction', 0, 950, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 926.15, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 91.58, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 6.35, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 52, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 11.14, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 25.9, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 84.2, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 17.7, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 38, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 185, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 5, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 6.72, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre'),
  ('2026-01-09', 'Transaction', 0, 420, NULL, (SELECT id FROM projets WHERE code = 'LVLR'), 'autre')
ON CONFLICT DO NOTHING;

-- =============================================
-- Projet: TALU (144 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2024-01-19', 'cotisation smart', 0, 30, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'smart'),
  ('2024-01-23', 'ordi M1 pro', 0, 1516.99, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-01-23', 'part astrid bota 1fev (avancé en cash)', 180, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-01-23', 'remb ordi maïa (interne asbl)', 0, 180, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2024-02-05', 'paye bota 01/02', 100, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-02-05', 'remb ordi maïa (interne asbl)', 0, 100, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2024-03-23', 'def train atelier rap (avance)', 0, 13.4, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'deplacement'),
  ('2024-04-01', 'frais triodos', 0, 1.87, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'frais_bancaires'),
  ('2024-04-08', 'atelier rap', 313.4, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-04-10', 'remb ordi maïa 3/3 interne', 0, 174.5, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2024-04-10', 'paie forzée', 190, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-04-12', 'paie atelier 210', 190, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-04-18', 'Listen Festival', 500, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-04-23', 'paie EDEN', 190, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-04-30', 'Mons Street', 560, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-05-02', '> maïa frais essence', 0, 60, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-05-02', 'cachet jul et soto Mons', 0, 250, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'cachet'),
  ('2024-05-02', 'cachet astrid beurs + bota', 0, 360, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'cachet'),
  ('2024-05-02', 'cachet Lou beurs', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'cachet'),
  ('2024-05-02', 'cachet soto et maria beurs', 0, 80, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'cachet'),
  ('2024-05-02', 'cachet back maria et iris(?) bota', 0, 80, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'cachet'),
  ('2024-05-06', '> maïa frais stationnement', 0, 35.97, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-05-06', 'Beurs BPFF', 500, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-05-10', 'avance sur 700€ microfestival (1/2)', 215.59, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'materiel'),
  ('2024-05-10', '> maïa frais avion', 0, 215.59, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-05-24', 'Bota Pride', 500, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-08-04', 'paie dour', 200, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-08-04', 'paie boomtown', 200, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-08-06', 'Micro festival', 484.41, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'materiel'),
  ('2024-09-18', 'café rdv astrid', 0, 12, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-09-19', 'parking studio', 0, 10.5, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-09-21', 'parking studio', 0, 10.5, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-09-29', 'parking studio', 0, 9.2, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-10-01', 'investissement matériel maïa (piano)', 0, 718, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-10-02', 'investissement matériel talu (wireless mic)', 0, 699, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-10-05', 'paie belleviloise', 200, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-10-19', 'part micro', 0, 19.24, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'materiel'),
  ('2024-11-14', 'PV', 0, 40, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-11-18', 'fifty lab', 300, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-11-20', 'Deep / paroles', 1000, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-11-22', 'remb frais maïa (reste dans ovni >> switch compte)', 0, 74.78, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-11-28', 'paie berne + louvain', 400, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-12-02', 'chanson droit HELB', 250, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-12-04', 'paie paris + bulle', 400, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-12-09', 'loyer communa decembre', 0, 110, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'loyer'),
  ('2024-12-16', 'remb frais voiture 2 maria', 0, 162, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-12-16', 'remb dalle LED lou', 0, 98, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-12-18', 'remb talu perso insortablx droit (reste dans ovni >> switch compte)', 0, 62.5, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-12-18', 'remb tee shirt 2eme sess', 0, 70, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2024-12-18', 'insortablx droit HELB', 62.5, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-01-09', 'retour paris - bruxelles / talu prod label', 0, 16, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-01-09', 'aller bruxelles - paris / talu prod label (remb maïa interne)', 0, 30, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-02-07', 'LAUSANNE - essence 1', 0, 45, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-02-07', 'LAUSANNE - peage 1', 0, 29.2, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-02-09', 'rdv fougue café', 0, 11.7, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-03-02', 'essence bxl / forzée', 0, 40, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-03-07', 'flixbus', 0, 13.98, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'deplacement'),
  ('2025-03-07', 'train baule residence', 0, 191, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'deplacement'),
  ('2025-03-07', 'train baule paris retour', 0, 70, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'deplacement'),
  ('2025-03-07', 'LAUSANNE - peage 2', 0, 6.6, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-03-07', 'LAUSANNE - essence 2', 0, 74, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-03-07', 'LAUSANNE - vignette suisse', 0, 44, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-03-10', 'frais parking machine a fumée', 0, 19.5, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-03-10', 'frais parking pianofabriek', 0, 7.66, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-06', 'paie residence maïa (matos compris) interne', 0, 250, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'materiel'),
  ('2025-04-06', 'paie jul residence inouis interne', 0, 100, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-04-06', 'loc materiel maïa STRASBOURG', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-07', 'LAUSANNE - peage 3', 0, 6.6, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'Dour', 583, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'Boomtown', 496, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'DOUR - paie talu', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'BOOMTOWN - paie talu', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'DOUR - paie maïa', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'BOOMTOWN - paie maïa', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'DOUR - loc maïa', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'BOOMTOWN - loc maïa', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-04-08', 'DOUR - paie jul', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-05-02', 'paye jul bota 01/02/25 (interne)', 0, 40, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-05-02', 'paye maïa bota 01/02/25 (interne)', 0, 100, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-05-02', 'paye talu bota 01/02/25 (interne)', 0, 100, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-05-02', 'location materiel 01/02/25 (interne > maïa)', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-05-05', 'def jul strasbourg', 0, 87, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-05-05', 'def jul strasbourg', 0, 21.98, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-05-09', 'avance defraiement inouis talu', 0, 209.5, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-05-09', 'talu aller bx paris (inouis rdv sept)', 0, 94, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-05-09', 'talu logement inouis rdv sept', 0, 115.5, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-05-10', 'BELLEVILOISE_F132', 450, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-05-10', 'to maïa et talu (interne) paie belleviloise', 0, 450, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-06-02', 'peinture', 0, 9.22, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-06-02', 'planche bois', 0, 17.28, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-06-05', 'master nls anotine', 0, 300, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-07-01', 'recyclart 16/12', 500, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-07-03', 'flixbus', 0, 13.98, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'deplacement'),
  ('2025-07-03', 'train baule residence', 0, 191, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'deplacement'),
  ('2025-07-03', 'train baule paris retour', 0, 70, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'deplacement'),
  ('2025-07-08', 'paye FDM', 200, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-07-08', 'paye LAUSANNE', 200, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-01', 'interne > greta', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-08-01', 'interne > emma lobina', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-08-01', 'casque audio', 0, 103, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-05', 'def jul lausanne', 0, 67.1, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-05', 'fumigene', 0, 220.52, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-07', 'LAUSANNE - essence 3', 0, 80.01, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-07', 'LAUSANNE - peage 4', 0, 16.4, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-07', 'FDM - paye jul', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-07', 'FDM - loc matos maia', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'materiel'),
  ('2025-08-07', 'FDM - paye talu', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-07', 'FDM - paye maïa', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-07', 'LAUSANNE - paye jul', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-07', 'LAUSANNE - loc matos maia', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'materiel'),
  ('2025-08-07', 'LAUSANNE - paye talu', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-08-07', 'LAUSANNE - paye maïa', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-09-05', 'lausanne > geneve jul', 0, 14.6, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-10-04', 'cachet forzée', 1150, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'cachet'),
  ('2025-10-04', 'loc matos forzée', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'materiel'),
  ('2025-10-04', 'paye maïa forzée interne', 0, 190, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-10-04', 'paye talu forzée interne', 0, 190, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-10-09', 'train talu pour berne', 0, 36.69, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'deplacement'),
  ('2025-10-13', 'FRANCOFAUNE_F134', 450, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-10-13', 'francofaune paie', 200, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-11-04', 'cachet in atelier 210', 550, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'cachet'),
  ('2025-11-04', 'paie maïa atelier 210 (interne)', 0, 190, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-11-04', 'loc matos atelier 210 (interne)', 0, 50, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'materiel'),
  ('2025-11-04', 'paie talu atelier 210 (interne)', 0, 190, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-11-06', 'parking', 0, 6.4, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-11-06', 'piles', 0, 11.1, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-11-10', 'materiel tour', 0, 47.97, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-11-21', 'paie berne', 450, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-11-21', 'paie louvain', 450, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-11-28', 'paie interne talu et maia berne', 0, 450, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-11-28', 'paie interne talu et maia louvain', 0, 450, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-12-01', 'paie paris + bulle', 900, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-12-04', 'def essence eden', 0, 40.02, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-12-04', 'piles eden', 0, 5.29, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-12-04', 'paie talu interne paris + bulle', 0, 400, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-12-04', 'paie maia interne paris + bulle', 0, 500, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-12-06', 'paie lyon', 450, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-12-06', 'paie lyon talu', 0, 200, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-12-06', 'paie lyon maïa', 0, 250, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-12-22', 'paie F151 toulouse + paris boule noire', 900, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2025-12-23', 'paie talu interne toulouse + paris boule noire', 0, 400, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-12-23', 'paie maia interne toulouse + paris boule noire', 0, 500, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'transfert_interne'),
  ('2025-12-23', 'paie toulouse + paris', 400, 0, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'autre'),
  ('2026-01-12', 'loyer communa decembre', 0, 110, NULL, (SELECT id FROM projets WHERE code = 'TALU'), 'loyer')
ON CONFLICT DO NOTHING;

-- =============================================
-- Projet: GEO (2 transactions)
-- =============================================

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
  ('2026-01-06', 'Transaction', 0, 1.5, NULL, (SELECT id FROM projets WHERE code = 'GEO'), 'autre'),
  ('2026-01-15', 'Transaction', 0, 500, NULL, (SELECT id FROM projets WHERE code = 'GEO'), 'autre')
ON CONFLICT DO NOTHING;

-- =============================================
-- Vérification
-- =============================================
SELECT
  'Transactions importées' as type,
  COUNT(*) as nombre
FROM transactions
UNION ALL
SELECT
  'Par artiste: ' || a.nom,
  COUNT(t.id)
FROM artistes a
LEFT JOIN transactions t ON t.artiste_id = a.id
GROUP BY a.nom
UNION ALL
SELECT
  'Par projet: ' || p.code,
  COUNT(t.id)
FROM projets p
LEFT JOIN transactions t ON t.projet_id = p.id
GROUP BY p.code;
