-- ============================================
-- Seed file: Ressources ASBL pour O.V.N.I Compta
-- Exécutez ce script dans Supabase Dashboard > SQL Editor
-- ============================================

-- Note: Les UUIDs sont générés automatiquement par la colonne id (gen_random_uuid())

INSERT INTO ressources (titre, description, contenu, categorie, url, tags, icon, important) VALUES

-- ============================================
-- GUIDES (3)
-- ============================================

('Créer une ASBL en Belgique',
 'Guide complet pour constituer votre association sans but lucratif selon le Code des Sociétés et des Associations (CSA).',
 '## Les étapes de création d''une ASBL

### 1. Définir votre projet associatif
- Objectif non lucratif clairement défini
- Minimum 2 membres fondateurs (personnes physiques ou morales)
- But désintéressé (pas de distribution de bénéfices aux membres)

### 2. Rédiger les statuts
Les statuts doivent obligatoirement contenir :
- La dénomination et le siège social
- L''objet social précis et désintéressé
- Les conditions d''adhésion et d''exclusion des membres
- Les pouvoirs de l''Assemblée Générale et de l''organe d''administration
- Le mode de nomination et de cessation des administrateurs
- Le mode de modification des statuts
- La destination du patrimoine en cas de dissolution

### 3. Tenir l''Assemblée Générale constitutive
- Approuver les statuts
- Nommer les premiers administrateurs
- Établir le procès-verbal de constitution

### 4. Dépôt au greffe du tribunal de l''entreprise
- Formulaire I (dépôt des statuts)
- Formulaire II (nomination des administrateurs)
- Coût : environ 195,23 € (publication au Moniteur belge)

### 5. Obtenir le numéro d''entreprise
- Inscription automatique à la BCE (Banque-Carrefour des Entreprises)
- Numéro d''entreprise = numéro TVA potentiel',
 'guide',
 NULL,
 ARRAY['création', 'statuts', 'CSA', 'constitution'],
 NULL,
 true),

('Obligations comptables des ASBL',
 'Découvrez les obligations comptables selon la taille de votre ASBL (micro, petite, grande).',
 '## Classification des ASBL

### Micro ASBL
Ne dépasse pas plus d''un des critères suivants :
- Moyenne annuelle de 10 travailleurs
- Chiffre d''affaires HTVA : 700.000 €
- Total du bilan : 350.000 €

**Obligations** : Comptabilité simplifiée (recettes/dépenses)

### Petite ASBL
Ne dépasse pas plus d''un des critères suivants :
- Moyenne annuelle de 50 travailleurs
- Chiffre d''affaires HTVA : 9.000.000 €
- Total du bilan : 4.500.000 €

**Obligations** : Comptabilité en partie double simplifiée

### Grande ASBL
Dépasse plus d''un des critères des petites ASBL

**Obligations** :
- Comptabilité en partie double complète
- Commissaire aux comptes
- Dépôt à la BNB

## Délais importants
- Comptes annuels : dans les 6 mois après la clôture
- Approbation AG : dans les 6 mois
- Dépôt au greffe : dans les 30 jours après l''AG',
 'guide',
 NULL,
 ARRAY['comptabilité', 'obligations', 'bilan', 'micro', 'petite', 'grande'],
 NULL,
 true),

('Guide des bilans annuels',
 'Comment préparer et présenter vos comptes annuels selon les normes belges.',
 '## Structure des comptes annuels

### Pour les micro-ASBL
État des recettes et dépenses comprenant :
- Recettes (cotisations, dons, subventions, ventes...)
- Dépenses (achats, services, personnel, amortissements...)
- Résultat de l''exercice

### Pour les petites ASBL
Bilan et compte de résultats selon schéma abrégé :

**Actif**
- Actifs immobilisés (incorporels, corporels, financiers)
- Actifs circulants (créances, stocks, trésorerie)

**Passif**
- Fonds propres (patrimoine, résultat reporté)
- Provisions
- Dettes

### Annexes obligatoires
- Règles d''évaluation
- Mouvements des immobilisations
- État des dettes et créances
- Engagements hors bilan

## Conseils pratiques
- Tenez votre comptabilité à jour tout au long de l''année
- Gardez tous vos justificatifs pendant 7 ans
- Faites valider vos comptes par un comptable si nécessaire',
 'guide',
 NULL,
 ARRAY['bilan', 'comptes annuels', 'comptabilité', 'rapport financier'],
 NULL,
 false),

-- ============================================
-- JURIDIQUE (4)
-- ============================================

('Le registre UBO',
 'Tout savoir sur l''obligation d''enregistrement des bénéficiaires effectifs de votre ASBL.',
 '## Qu''est-ce que le registre UBO ?

Le registre UBO (Ultimate Beneficial Owner) recense les bénéficiaires effectifs des sociétés et ASBL en Belgique. Obligatoire depuis 2019.

### Qui sont les bénéficiaires effectifs d''une ASBL ?
1. Les administrateurs
2. Les personnes habilitées à représenter l''association
3. Les personnes chargées de la gestion journalière
4. Les fondateurs (si encore en vie/actifs)
5. Toute personne physique exerçant un contrôle par d''autres moyens

### Informations à déclarer
- Nom et prénom
- Date de naissance
- Nationalité
- Adresse
- Date à laquelle la personne est devenue bénéficiaire effectif
- Catégorie de bénéficiaire effectif

### Délais et sanctions
- Mise à jour dans le mois suivant tout changement
- Confirmation annuelle obligatoire
- Sanctions : amendes de 250 € à 50.000 €

### Comment déclarer ?
Via l''application MyMinfin avec votre carte d''identité électronique.',
 'juridique',
 'https://finances.belgium.be/fr/E-services/ubo-register',
 ARRAY['UBO', 'bénéficiaires effectifs', 'déclaration', 'obligation légale'],
 NULL,
 true),

('Responsabilité des administrateurs',
 'Comprendre les risques et obligations des administrateurs d''ASBL.',
 '## Les responsabilités des administrateurs

### Responsabilité interne (envers l''ASBL)
- Fautes de gestion
- Non-respect des statuts
- Violation du CSA

### Responsabilité externe (envers les tiers)
- Fautes graves et caractérisées (responsabilité solidaire en cas de faillite)
- Dettes fiscales et sociales impayées
- Infractions pénales

### Protection des administrateurs
1. **Assurance RC administrateurs** : Fortement recommandée
2. **Décharge annuelle** : Protège contre la responsabilité interne uniquement
3. **Bonne gouvernance** : Procès-verbaux, suivi financier rigoureux

### Limitation de responsabilité (CSA)
Le CSA prévoit des plafonds de responsabilité :
- 125.000 € pour les petites ASBL
- 250.000 € à 12.000.000 € selon la taille

### Conseils
- Documentez toutes vos décisions
- Participez activement aux réunions
- Signalez vos désaccords au PV
- Démissionnez si vous n''avez plus de contrôle',
 'juridique',
 NULL,
 ARRAY['administrateurs', 'responsabilité', 'gouvernance', 'assurance'],
 NULL,
 false),

('RGPD et protection des données',
 'Les obligations des ASBL en matière de protection des données personnelles.',
 '## Le RGPD pour les ASBL

### Principes de base
- **Licéité** : Base légale pour traiter les données
- **Finalité** : But précis et légitime
- **Minimisation** : Données strictement nécessaires
- **Exactitude** : Données à jour
- **Conservation limitée** : Durée définie
- **Sécurité** : Mesures de protection

### Bases légales courantes pour les ASBL
1. Consentement explicite
2. Exécution d''un contrat (adhésion)
3. Intérêt légitime (communication associative)
4. Obligation légale (comptabilité, UBO)

### Obligations pratiques
- **Registre des traitements** : Document interne obligatoire
- **Information des personnes** : Politique de confidentialité
- **Droits des personnes** : Accès, rectification, effacement
- **Sécurité** : Mots de passe, sauvegardes, accès limités

### Délégué à la protection des données (DPO)
Non obligatoire pour la plupart des ASBL, sauf si :
- Traitement à grande échelle de données sensibles
- Suivi régulier et systématique des personnes',
 'juridique',
 NULL,
 ARRAY['RGPD', 'données personnelles', 'vie privée', 'conformité'],
 NULL,
 false),

('L''organe d''administration (ex-CA)',
 'Fonctionnement, composition et pouvoirs de l''organe d''administration depuis le CSA.',
 '## L''organe d''administration

### Composition
- Minimum 3 membres (ou 2 si l''ASBL compte moins de 3 membres)
- Personnes physiques ou morales
- Nommés par l''Assemblée Générale

### Pouvoirs
L''organe d''administration est compétent pour :
- Tous les actes nécessaires à la réalisation de l''objet social
- La gestion courante de l''ASBL
- La représentation de l''ASBL envers les tiers

### Réunions
- Fréquence fixée par les statuts (min. 1x/an recommandé)
- Convocation par le président ou selon les statuts
- Procès-verbal obligatoire
- Quorum et majorités selon les statuts

### Délégation de pouvoirs
- **Délégué à la gestion journalière** : Actes courants
- **Représentation** : Pouvoir de signature
- Toujours mentionner dans les statuts et publier au Moniteur

### Rôles clés
- **Président** : Anime les réunions, représentation honorifique
- **Secrétaire** : PV, archives, correspondance
- **Trésorier** : Suivi financier, paiements',
 'juridique',
 NULL,
 ARRAY['conseil administration', 'gouvernance', 'administrateurs', 'CSA'],
 NULL,
 false),

-- ============================================
-- COMPTABILITÉ (3)
-- ============================================

('Plan comptable minimum normalisé (PCMN)',
 'Structure du plan comptable belge adapté aux ASBL.',
 '## Structure du PCMN pour ASBL

### Classe 1 - Fonds propres et provisions
- 10 : Patrimoine de départ / Fonds associatifs
- 13 : Fonds affectés
- 14 : Résultat reporté
- 16 : Provisions

### Classe 2 - Actifs immobilisés
- 20-22 : Immobilisations incorporelles et corporelles
- 28-29 : Immobilisations financières

### Classe 3 - Stocks
- 30-37 : Stocks et commandes en cours

### Classe 4 - Créances et dettes (< 1 an)
- 40-41 : Créances commerciales
- 43-48 : Dettes diverses (ONSS, TVA, précompte...)
- 49 : Comptes de régularisation

### Classe 5 - Placements et disponibilités
- 51-53 : Placements de trésorerie
- 55-57 : Banques et caisse

### Classe 6 - Charges
- 60 : Achats
- 61 : Services et biens divers
- 62 : Rémunérations
- 63 : Amortissements
- 64 : Charges financières
- 65 : Charges exceptionnelles

### Classe 7 - Produits
- 70 : Cotisations et dons
- 73 : Subventions
- 74 : Autres produits
- 75 : Produits financiers',
 'comptabilite',
 NULL,
 ARRAY['PCMN', 'plan comptable', 'comptabilité', 'classes'],
 NULL,
 true),

('TVA et ASBL',
 'Quand une ASBL est-elle assujettie à la TVA ? Régimes et obligations.',
 '## La TVA et les ASBL

### Principe de base
Une ASBL peut être assujettie à la TVA si elle exerce une activité économique de manière habituelle et indépendante.

### Activités non assujetties (hors champ)
- Activités purement sociales sans contrepartie
- Cotisations des membres sans contrepartie directe
- Dons et subventions sans contrepartie

### Exemptions de TVA (Article 44 CTVA)
- Services culturels (sous conditions)
- Enseignement et formation
- Services sportifs aux membres
- Activités médicales et sociales

### Régimes TVA possibles
1. **Non assujetti** : Aucune activité économique
2. **Assujetti exempté** : Activités exonérées (art. 44)
3. **Assujetti franchise** : CA < 25.000 €/an
4. **Assujetti normal** : Déclarations TVA périodiques

### Obligations selon le régime
| Régime | Déclarations | Récupération TVA |
|--------|-------------|------------------|
| Non assujetti | Non | Non |
| Exempté | Non | Non |
| Franchise | Listing clients + décl. annuelle | Non |
| Normal | Mensuelle/trimestrielle | Oui |',
 'comptabilite',
 NULL,
 ARRAY['TVA', 'fiscalité', 'assujettissement', 'exemption'],
 NULL,
 false),

('Gestion de trésorerie ASBL',
 'Bonnes pratiques pour gérer la trésorerie de votre association.',
 '## Gestion de trésorerie

### Principes fondamentaux
- Séparation stricte des comptes personnels et associatifs
- Double signature recommandée au-delà d''un certain montant
- Suivi régulier des entrées/sorties

### Outils de gestion
1. **Tableau de trésorerie** : Prévisions à 3-6 mois
2. **Budget annuel** : Recettes et dépenses prévisionnelles
3. **Suivi des subventions** : Échéances et justifications

### Bonnes pratiques
- Vérifier les soldes bancaires régulièrement
- Anticiper les périodes creuses
- Constituer une réserve de précaution (3-6 mois de fonctionnement)
- Relancer les créances en retard

### Gestion des subventions
- Respecter l''affectation prévue
- Conserver tous les justificatifs
- Anticiper les délais de versement
- Préparer les rapports financiers à temps

### Pièges à éviter
- Mélanger fonds affectés et fonds propres
- Oublier de provisionner les charges annuelles
- Négliger les délais de paiement fournisseurs',
 'comptabilite',
 NULL,
 ARRAY['trésorerie', 'budget', 'gestion financière', 'subventions'],
 NULL,
 false),

-- ============================================
-- ARTISTES (4)
-- ============================================

('Le statut d''artiste en Belgique',
 'Comprendre le nouveau statut des travailleurs des arts (réforme 2022).',
 '## Le statut des travailleurs des arts

### Réforme "Working in the Arts" (2022)
Nouvelle approche basée sur :
- Attestation du travail des arts
- Commission du travail des arts
- Règles spécifiques de chômage

### L''attestation du travail des arts
**Types d''attestations :**
- **Attestation "starter"** : Artistes débutants
- **Attestation ordinaire** : Artistes confirmés
- **Attestation "plus"** : Artistes avec parcours significatif

**Critères d''obtention :**
- Exercer une activité artistique, technique ou de soutien
- Activité créative contribuant à la création artistique
- Preuve de revenus ou de travail dans le secteur

### Avantages
- Accès aux allocations de chômage avec règles adaptées
- Neutralisation de certaines périodes
- Cumul facilité avec les revenus artistiques

### Démarches
1. Demande via Artist@Work (Working in the Arts)
2. Examen par la Commission du travail des arts
3. Décision dans les 90 jours
4. Renouvellement tous les 5 ans',
 'artistes',
 'https://www.workinginthearts.be/',
 ARRAY['statut artiste', 'attestation', 'chômage', 'réforme 2022'],
 NULL,
 true),

('Paiements via Smart',
 'Comment fonctionne le paiement d''artistes via la coopérative Smart.',
 '## Smart - Société Mutuelle pour Artistes

### Principe
Smart est une coopérative d''activités qui permet aux artistes et professionnels créatifs de :
- Facturer leurs prestations en toute légalité
- Bénéficier du statut de salarié
- Être déchargés de la gestion administrative

### Fonctionnement
1. **Établissement du contrat** : Smart établit un contrat de travail
2. **Facturation** : Smart facture le client
3. **Paiement** : Le client paie Smart
4. **Salaire** : Smart verse le salaire à l''artiste (- charges sociales et commission)

### Coûts
- Commission Smart : environ 6,5% du montant facturé HT
- Charges sociales : cotisations employeur et employé
- Le net représente environ 50-55% du montant facturé

### Avantages
- Contrat de travail = droits sociaux complets
- Pas de comptabilité personnelle
- Protection sociale (chômage, maladie, pension)
- Accompagnement et conseils

### Pour l''ASBL employeur
- Simplicité administrative
- Pas de gestion de paie
- Facture déductible',
 'artistes',
 'https://smartbe.be/',
 ARRAY['Smart', 'paiement', 'coopérative', 'facturation'],
 NULL,
 false),

('Indemnités et défraiements artistes',
 'Règles pour les indemnités de déplacement, repas et hébergement.',
 '## Indemnités et défraiements

### Principe fiscal
Les indemnités forfaitaires sont exonérées si elles couvrent des frais réels.

### Frais de déplacement
**Voiture personnelle :**
- Indemnité kilométrique : 0,4280 €/km (2024)
- Maximum pour le trajet domicile-lieu de travail

**Transports en commun :**
- Remboursement sur base des tickets/abonnements
- Ou forfait équivalent au prix du transport public

### Frais de séjour (forfaits ONSS/Fisc)
**Repas :**
- Petit-déjeuner : 5,13 €
- Déjeuner : 19,22 €
- Dîner : 19,22 €

**Hébergement :**
- Belgique : 148,50 € maximum/nuit
- Étranger : selon le pays (barèmes SPF AE)

### Conditions d''exonération
- Frais réellement exposés pour l''activité
- Ne pas dépasser les forfaits légaux
- Justificatifs conservés (sauf forfaits)
- Pas de cumul avec remboursements réels

### Pour les RPI (Petites indemnités)
- Maximum 151,70 €/jour (2024)
- Maximum 30 jours/an avec le même donneur d''ordre
- Maximum 7 donneurs d''ordre différents/an',
 'artistes',
 NULL,
 ARRAY['indemnités', 'défraiements', 'déplacements', 'RPI'],
 NULL,
 false),

('Droits d''auteur et droits voisins',
 'Fiscalité avantageuse des droits d''auteur pour les artistes.',
 '## Droits d''auteur - Régime fiscal

### Principe (depuis 2023)
Les revenus de droits d''auteur bénéficient d''un régime fiscal avantageux jusqu''à un certain plafond.

### Plafonds 2024
- **Première tranche (0-17.090 €)** : 15% de précompte mobilier
- **Seconde tranche (17.090-34.170 €)** : 15% + conditions restrictives
- **Au-delà** : Requalification possible en revenus professionnels

### Conditions d''application
- Cession ou concession de droits d''auteur/voisins
- Œuvre originale portant l''empreinte de la personnalité
- Contrat de cession distinct du contrat de travail

### Frais forfaitaires déductibles
- 50% sur les premiers 18.720 €
- 25% sur la tranche suivante (18.720 - 37.450 €)

### Restrictions depuis 2023
- Ratio droits d''auteur/revenus professionnels limité
- Liste limitative des secteurs éligibles
- Attestation requise dans certains cas

### Conseils pratiques
- Établir un contrat de cession séparé
- Distinguer clairement prestation et cession
- Conserver les preuves de création originale',
 'artistes',
 NULL,
 ARRAY['droits auteur', 'fiscalité', 'précompte mobilier', 'création'],
 NULL,
 false),

-- ============================================
-- LIENS UTILES (8)
-- ============================================

('MonASBL.be',
 'Le site de référence pour les responsables d''ASBL en Belgique.',
 NULL,
 'liens',
 'https://www.monasbl.be/',
 ARRAY['portail', 'ressources', 'informations', 'actualités'],
 NULL,
 true),

('BCE - Banque-Carrefour des Entreprises',
 'Consultez les données officielles de votre ASBL et effectuez vos démarches.',
 NULL,
 'liens',
 'https://kbopub.economie.fgov.be/',
 ARRAY['BCE', 'officiel', 'données', 'numéro entreprise'],
 NULL,
 false),

('E-greffe',
 'Dépôt en ligne des actes au greffe du tribunal de l''entreprise.',
 NULL,
 'liens',
 'https://www.e-greffe.be/',
 ARRAY['greffe', 'dépôt', 'statuts', 'publications'],
 NULL,
 false),

('Fédération Wallonie-Bruxelles - Culture',
 'Subventions et aides pour le secteur culturel en FWB.',
 NULL,
 'liens',
 'https://www.culture.be/',
 ARRAY['FWB', 'subventions', 'culture', 'aides'],
 NULL,
 true),

('Working in the Arts',
 'Plateforme officielle pour l''attestation du travail des arts.',
 NULL,
 'liens',
 'https://www.workinginthearts.be/',
 ARRAY['artistes', 'attestation', 'statut', 'officiel'],
 NULL,
 false),

('Registre UBO',
 'Application pour la déclaration des bénéficiaires effectifs.',
 NULL,
 'liens',
 'https://finances.belgium.be/fr/E-services/ubo-register',
 ARRAY['UBO', 'bénéficiaires', 'déclaration', 'MyMinfin'],
 NULL,
 false),

('Smart Belgium',
 'Coopérative d''activités pour les travailleurs autonomes du secteur créatif.',
 NULL,
 'liens',
 'https://smartbe.be/',
 ARRAY['Smart', 'coopérative', 'facturation', 'artistes'],
 NULL,
 false),

('Artist@Work',
 'Portail de gestion du statut d''artiste et des prestations.',
 NULL,
 'liens',
 'https://www.artistatwork.be/',
 ARRAY['artiste', 'prestations', 'carte artiste', 'portail'],
 NULL,
 false);

-- ============================================
-- Vérification
-- ============================================
SELECT
  categorie,
  COUNT(*) as nombre
FROM ressources
GROUP BY categorie
ORDER BY categorie;
