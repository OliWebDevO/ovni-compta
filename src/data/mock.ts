// Données mockées pour le prototype visuel
// Basées sur les vraies données O.V.N.I

import type { User, Artiste, Projet, Transaction, BilanAnnuel, BilanMensuel, Ressource, Transfert } from '@/types';

// ==================
// UTILISATEURS
// ==================
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ovni.be',
    nom: 'Admin O.V.N.I',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'comptable@ovni.be',
    nom: 'Comptable',
    role: 'editor',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    email: 'membre@ovni.be',
    nom: 'Membre',
    role: 'viewer',
    created_at: '2024-02-01T00:00:00Z',
  },
];

export const currentUser: User = mockUsers[0];

// ==================
// ARTISTES
// ==================
export const mockArtistes: Artiste[] = [
  {
    id: 'art-1',
    nom: 'Maïa',
    email: 'maia@example.com',
    actif: true,
    couleur: '#9900ff', // Violet (comme dans le fichier Excel)
    created_at: '2021-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    solde: 1949.91,
    total_credit: 3902.34,
    total_debit: 1952.43,
    nb_transactions: 45,
  },
  {
    id: 'art-2',
    nom: 'Geoffrey',
    email: 'geoffrey@example.com',
    actif: true,
    couleur: '#ff6d01', // Orange (comme dans le fichier Excel)
    created_at: '2021-01-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    solde: 2240.26,
    total_credit: 8500.00,
    total_debit: 6259.74,
    nb_transactions: 78,
  },
  {
    id: 'art-3',
    nom: 'Eva',
    email: 'eva@example.com',
    actif: true,
    couleur: '#46bdc6', // Turquoise
    created_at: '2022-03-15T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
    solde: 1250.00,
    total_credit: 4500.00,
    total_debit: 3250.00,
    nb_transactions: 32,
  },
  {
    id: 'art-4',
    nom: 'Iris',
    actif: true,
    couleur: '#0000ff', // Bleu
    created_at: '2022-06-01T00:00:00Z',
    updated_at: '2024-10-10T00:00:00Z',
    solde: 890.50,
    total_credit: 2300.00,
    total_debit: 1409.50,
    nb_transactions: 18,
  },
  {
    id: 'art-5',
    nom: 'Lou',
    actif: true,
    couleur: '#ff9900', // Orange doré
    created_at: '2023-01-10T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z',
    solde: 650.00,
    total_credit: 1800.00,
    total_debit: 1150.00,
    nb_transactions: 15,
  },
  {
    id: 'art-6',
    nom: 'Camille',
    actif: true,
    couleur: '#ff00ff', // Magenta
    created_at: '2023-03-20T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
    solde: 420.75,
    total_credit: 1200.00,
    total_debit: 779.25,
    nb_transactions: 12,
  },
  {
    id: 'art-7',
    nom: 'Greta',
    actif: true,
    couleur: '#a2c4c9', // Bleu-gris clair
    created_at: '2023-05-01T00:00:00Z',
    updated_at: '2024-09-30T00:00:00Z',
    solde: -150.00,
    total_credit: 500.00,
    total_debit: 650.00,
    nb_transactions: 8,
  },
  {
    id: 'art-8',
    nom: 'Léa',
    email: 'lea@example.com',
    actif: true,
    couleur: '#00ff00', // Vert
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
    solde: 1198.30,
    total_credit: 2048.30,
    total_debit: 850.00,
    nb_transactions: 10,
  },
];

// Artiste connecté (pour la vue artiste)
export const currentArtiste: Artiste = mockArtistes[1]; // Geoffrey

// ==================
// PROJETS
// ==================
export const mockProjets: Projet[] = [
  {
    id: 'proj-1',
    nom: 'Le Vagabond & Le Renard',
    code: 'LVLR',
    description: 'Spectacle théâtral itinérant',
    statut: 'actif',
    budget: 15000,
    date_debut: '2024-01-01',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    solde: 3500.00,
    total_credit: 12000.00,
    total_debit: 8500.00,
    reste_budget: 6500.00,
  },
  {
    id: 'proj-2',
    nom: 'Le Talu',
    code: 'TALU',
    description: 'Résidence artistique',
    statut: 'actif',
    budget: 8000,
    date_debut: '2024-03-01',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
    solde: 1200.00,
    total_credit: 5000.00,
    total_debit: 3800.00,
    reste_budget: 4200.00,
  },
  {
    id: 'proj-3',
    nom: 'Wireless People',
    code: 'WP',
    description: 'Performance sonore',
    statut: 'termine',
    budget: 5000,
    date_debut: '2023-06-01',
    date_fin: '2024-02-28',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-02-28T00:00:00Z',
    solde: 250.00,
    total_credit: 5000.00,
    total_debit: 4750.00,
    reste_budget: 250.00,
  },
  {
    id: 'proj-4',
    nom: 'Poema',
    code: 'POEMA',
    description: 'Création poétique',
    statut: 'actif',
    budget: 3000,
    date_debut: '2024-09-01',
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    solde: 2100.00,
    total_credit: 2500.00,
    total_debit: 400.00,
    reste_budget: 2600.00,
  },
  {
    id: 'proj-5',
    nom: 'GEO',
    code: 'GEO',
    description: 'Projet géographique',
    artiste_id: 'art-2',
    statut: 'actif',
    budget: 6000,
    date_debut: '2024-01-01',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
    solde: 2240.26,
    total_credit: 4500.00,
    total_debit: 2259.74,
    reste_budget: 3740.26,
  },
];

// ==================
// TRANSACTIONS
// ==================
export const mockTransactions: Transaction[] = [
  // Transactions récentes 2025
  {
    id: 'tr-1',
    date: '2025-01-12',
    description: 'Loyer Communa janvier',
    credit: 0,
    debit: 110,
    artiste_id: 'art-1',
    categorie: 'loyer',
    created_at: '2025-01-12T10:00:00Z',
    updated_at: '2025-01-12T10:00:00Z',
  },
  {
    id: 'tr-2',
    date: '2025-01-06',
    description: 'Matériel sono 2',
    credit: 0,
    debit: 1518,
    artiste_id: 'art-1',
    categorie: 'materiel',
    created_at: '2025-01-06T14:30:00Z',
    updated_at: '2025-01-06T14:30:00Z',
  },
  {
    id: 'tr-3',
    date: '2025-01-06',
    description: 'Matériel sono 1',
    credit: 0,
    debit: 115.40,
    artiste_id: 'art-1',
    categorie: 'materiel',
    created_at: '2025-01-06T14:00:00Z',
    updated_at: '2025-01-06T14:00:00Z',
  },
  {
    id: 'tr-4',
    date: '2025-01-06',
    description: 'Frais Triodos',
    credit: 0,
    debit: 1.50,
    artiste_id: 'art-2',
    categorie: 'frais_bancaires',
    created_at: '2025-01-06T09:00:00Z',
    updated_at: '2025-01-06T09:00:00Z',
  },
  {
    id: 'tr-5',
    date: '2025-01-03',
    description: 'Résidence hiver - trajets',
    credit: 0,
    debit: 207.03,
    artiste_id: 'art-1',
    categorie: 'deplacement',
    created_at: '2025-01-03T16:00:00Z',
    updated_at: '2025-01-03T16:00:00Z',
  },
  {
    id: 'tr-6',
    date: '2025-01-01',
    description: 'Résidence hiver - trajet aller',
    credit: 0,
    debit: 30,
    artiste_id: 'art-1',
    categorie: 'deplacement',
    created_at: '2025-01-01T08:00:00Z',
    updated_at: '2025-01-01T08:00:00Z',
  },
  // Transactions 2024
  {
    id: 'tr-7',
    date: '2024-12-19',
    description: 'Léa Brami - cachet',
    credit: 850,
    debit: 0,
    artiste_id: 'art-8',
    projet_id: 'proj-1',
    categorie: 'cachet',
    created_at: '2024-12-19T11:00:00Z',
    updated_at: '2024-12-19T11:00:00Z',
  },
  {
    id: 'tr-8',
    date: '2024-12-19',
    description: 'Léa Brami - indemnités',
    credit: 348.30,
    debit: 0,
    artiste_id: 'art-8',
    categorie: 'cachet',
    created_at: '2024-12-19T11:30:00Z',
    updated_at: '2024-12-19T11:30:00Z',
  },
  {
    id: 'tr-9',
    date: '2024-12-07',
    description: 'Thomann - matériel',
    credit: 0,
    debit: 375,
    artiste_id: 'art-2',
    projet_id: 'proj-5',
    categorie: 'thoman',
    created_at: '2024-12-07T15:00:00Z',
    updated_at: '2024-12-07T15:00:00Z',
  },
  {
    id: 'tr-10',
    date: '2024-11-25',
    description: 'PDF équipement',
    credit: 0,
    debit: 220,
    artiste_id: 'art-2',
    categorie: 'materiel',
    created_at: '2024-11-25T10:00:00Z',
    updated_at: '2024-11-25T10:00:00Z',
  },
  {
    id: 'tr-11',
    date: '2024-11-05',
    description: 'Vélo cargo',
    credit: 0,
    debit: 800,
    artiste_id: 'art-2',
    categorie: 'materiel',
    created_at: '2024-11-05T14:00:00Z',
    updated_at: '2024-11-05T14:00:00Z',
  },
  {
    id: 'tr-12',
    date: '2024-10-15',
    description: 'Subvention FWB',
    credit: 5000,
    debit: 0,
    projet_id: 'proj-1',
    categorie: 'subvention',
    created_at: '2024-10-15T09:00:00Z',
    updated_at: '2024-10-15T09:00:00Z',
  },
  {
    id: 'tr-13',
    date: '2024-09-20',
    description: 'Smart - paiement Geo',
    credit: 0,
    debit: 618.96,
    artiste_id: 'art-2',
    categorie: 'smart',
    created_at: '2024-09-20T11:00:00Z',
    updated_at: '2024-09-20T11:00:00Z',
  },
  {
    id: 'tr-14',
    date: '2024-08-10',
    description: 'Location salle répétition',
    credit: 0,
    debit: 250,
    projet_id: 'proj-2',
    categorie: 'loyer',
    created_at: '2024-08-10T10:00:00Z',
    updated_at: '2024-08-10T10:00:00Z',
  },
  {
    id: 'tr-15',
    date: '2024-07-03',
    description: 'Landrenoc - cachet',
    credit: 450,
    debit: 0,
    artiste_id: 'art-2',
    projet_id: 'proj-5',
    categorie: 'cachet',
    created_at: '2024-07-03T16:00:00Z',
    updated_at: '2024-07-03T16:00:00Z',
  },
];

// ==================
// BILANS
// ==================
export const mockBilansAnnuels: BilanAnnuel[] = [
  {
    annee: 2025,
    total_credit: 3902.34,
    total_debit: 1981.93,
    solde: 1920.41,
    nb_transactions: 6,
  },
  {
    annee: 2024,
    total_credit: 25800.00,
    total_debit: 18500.00,
    solde: 7300.00,
    nb_transactions: 145,
  },
  {
    annee: 2023,
    total_credit: 18500.00,
    total_debit: 15200.00,
    solde: 3300.00,
    nb_transactions: 98,
  },
  {
    annee: 2022,
    total_credit: 12000.00,
    total_debit: 10500.00,
    solde: 1500.00,
    nb_transactions: 67,
  },
  {
    annee: 2021,
    total_credit: 8000.00,
    total_debit: 6500.00,
    solde: 1500.00,
    nb_transactions: 45,
  },
];

export const mockBilansMensuels2024: BilanMensuel[] = [
  { mois: 1, annee: 2024, total_credit: 1500, total_debit: 1200, solde: 300 },
  { mois: 2, annee: 2024, total_credit: 2200, total_debit: 1800, solde: 400 },
  { mois: 3, annee: 2024, total_credit: 3000, total_debit: 2100, solde: 900 },
  { mois: 4, annee: 2024, total_credit: 1800, total_debit: 1500, solde: 300 },
  { mois: 5, annee: 2024, total_credit: 2500, total_debit: 1900, solde: 600 },
  { mois: 6, annee: 2024, total_credit: 2800, total_debit: 2200, solde: 600 },
  { mois: 7, annee: 2024, total_credit: 1900, total_debit: 1400, solde: 500 },
  { mois: 8, annee: 2024, total_credit: 2100, total_debit: 1600, solde: 500 },
  { mois: 9, annee: 2024, total_credit: 2400, total_debit: 1800, solde: 600 },
  { mois: 10, annee: 2024, total_credit: 2200, total_debit: 1500, solde: 700 },
  { mois: 11, annee: 2024, total_credit: 1800, total_debit: 1200, solde: 600 },
  { mois: 12, annee: 2024, total_credit: 1600, total_debit: 1300, solde: 300 },
];

// ==================
// HELPERS
// ==================
export const getArtisteById = (id: string) => mockArtistes.find(a => a.id === id);
export const getProjetById = (id: string) => mockProjets.find(p => p.id === id);

export const getTransactionsWithRelations = (): Transaction[] => {
  return mockTransactions.map(t => ({
    ...t,
    artiste: t.artiste_id ? getArtisteById(t.artiste_id) : undefined,
    projet: t.projet_id ? getProjetById(t.projet_id) : undefined,
  }));
};

export const getTotalSolde = () => {
  return mockArtistes.reduce((acc, a) => acc + (a.solde || 0), 0);
};

export const getTotalCredits = () => {
  return mockArtistes.reduce((acc, a) => acc + (a.total_credit || 0), 0);
};

export const getTotalDebits = () => {
  return mockArtistes.reduce((acc, a) => acc + (a.total_debit || 0), 0);
};

// ==================
// RESSOURCES ASBL
// ==================
export const mockRessources: Ressource[] = [
  // GUIDES
  {
    id: 'res-1',
    titre: 'Créer une ASBL en Belgique',
    description: 'Guide complet pour constituer votre association sans but lucratif selon le Code des Sociétés et des Associations (CSA).',
    contenu: `
## Les étapes de création d'une ASBL

### 1. Définir votre projet associatif
- Objectif non lucratif clairement défini
- Minimum 2 membres fondateurs (personnes physiques ou morales)
- But désintéressé (pas de distribution de bénéfices aux membres)

### 2. Rédiger les statuts
Les statuts doivent obligatoirement contenir :
- La dénomination et le siège social
- L'objet social précis et désintéressé
- Les conditions d'adhésion et d'exclusion des membres
- Les pouvoirs de l'Assemblée Générale et de l'organe d'administration
- Le mode de nomination et de cessation des administrateurs
- Le mode de modification des statuts
- La destination du patrimoine en cas de dissolution

### 3. Tenir l'Assemblée Générale constitutive
- Approuver les statuts
- Nommer les premiers administrateurs
- Établir le procès-verbal de constitution

### 4. Dépôt au greffe du tribunal de l'entreprise
- Formulaire I (dépôt des statuts)
- Formulaire II (nomination des administrateurs)
- Coût : environ 195,23 € (publication au Moniteur belge)

### 5. Obtenir le numéro d'entreprise
- Inscription automatique à la BCE (Banque-Carrefour des Entreprises)
- Numéro d'entreprise = numéro TVA potentiel
    `,
    categorie: 'guide',
    tags: ['création', 'statuts', 'CSA', 'constitution'],
    important: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: 'res-2',
    titre: 'Obligations comptables des ASBL',
    description: 'Découvrez les obligations comptables selon la taille de votre ASBL (micro, petite, grande).',
    contenu: `
## Classification des ASBL

### Micro ASBL
Ne dépasse pas plus d'un des critères suivants :
- Moyenne annuelle de 10 travailleurs
- Chiffre d'affaires HTVA : 700.000 €
- Total du bilan : 350.000 €

**Obligations** : Comptabilité simplifiée (recettes/dépenses)

### Petite ASBL
Ne dépasse pas plus d'un des critères suivants :
- Moyenne annuelle de 50 travailleurs
- Chiffre d'affaires HTVA : 9.000.000 €
- Total du bilan : 4.500.000 €

**Obligations** : Comptabilité en partie double simplifiée

### Grande ASBL
Dépasse plus d'un des critères des petites ASBL

**Obligations** :
- Comptabilité en partie double complète
- Commissaire aux comptes
- Dépôt à la BNB

## Délais importants
- Comptes annuels : dans les 6 mois après la clôture
- Approbation AG : dans les 6 mois
- Dépôt au greffe : dans les 30 jours après l'AG
    `,
    categorie: 'guide',
    tags: ['comptabilité', 'obligations', 'bilan', 'micro', 'petite', 'grande'],
    important: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
  },
  {
    id: 'res-3',
    titre: 'Guide des bilans annuels',
    description: 'Comment préparer et présenter vos comptes annuels selon les normes belges.',
    contenu: `
## Structure des comptes annuels

### Pour les micro-ASBL
État des recettes et dépenses comprenant :
- Recettes (cotisations, dons, subventions, ventes...)
- Dépenses (achats, services, personnel, amortissements...)
- Résultat de l'exercice

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
- Règles d'évaluation
- Mouvements des immobilisations
- État des dettes et créances
- Engagements hors bilan

## Conseils pratiques
- Tenez votre comptabilité à jour tout au long de l'année
- Gardez tous vos justificatifs pendant 7 ans
- Faites valider vos comptes par un comptable si nécessaire
    `,
    categorie: 'guide',
    tags: ['bilan', 'comptes annuels', 'comptabilité', 'rapport financier'],
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
  },

  // JURIDIQUE
  {
    id: 'res-4',
    titre: 'Le registre UBO',
    description: 'Tout savoir sur l\'obligation d\'enregistrement des bénéficiaires effectifs de votre ASBL.',
    contenu: `
## Qu'est-ce que le registre UBO ?

Le registre UBO (Ultimate Beneficial Owner) recense les bénéficiaires effectifs des sociétés et ASBL en Belgique. Obligatoire depuis 2019.

### Qui sont les bénéficiaires effectifs d'une ASBL ?
1. Les administrateurs
2. Les personnes habilitées à représenter l'association
3. Les personnes chargées de la gestion journalière
4. Les fondateurs (si encore en vie/actifs)
5. Toute personne physique exerçant un contrôle par d'autres moyens

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
Via l'application MyMinfin avec votre carte d'identité électronique.
    `,
    categorie: 'juridique',
    url: 'https://finances.belgium.be/fr/E-services/ubo-register',
    tags: ['UBO', 'bénéficiaires effectifs', 'déclaration', 'obligation légale'],
    important: true,
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
  },
  {
    id: 'res-5',
    titre: 'Responsabilité des administrateurs',
    description: 'Comprendre les risques et obligations des administrateurs d\'ASBL.',
    contenu: `
## Les responsabilités des administrateurs

### Responsabilité interne (envers l'ASBL)
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
- Démissionnez si vous n'avez plus de contrôle
    `,
    categorie: 'juridique',
    tags: ['administrateurs', 'responsabilité', 'gouvernance', 'assurance'],
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-08-01T00:00:00Z',
  },
  {
    id: 'res-6',
    titre: 'RGPD et protection des données',
    description: 'Les obligations des ASBL en matière de protection des données personnelles.',
    contenu: `
## Le RGPD pour les ASBL

### Principes de base
- **Licéité** : Base légale pour traiter les données
- **Finalité** : But précis et légitime
- **Minimisation** : Données strictement nécessaires
- **Exactitude** : Données à jour
- **Conservation limitée** : Durée définie
- **Sécurité** : Mesures de protection

### Bases légales courantes pour les ASBL
1. Consentement explicite
2. Exécution d'un contrat (adhésion)
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
- Suivi régulier et systématique des personnes
    `,
    categorie: 'juridique',
    tags: ['RGPD', 'données personnelles', 'vie privée', 'conformité'],
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-07-15T00:00:00Z',
  },
  {
    id: 'res-7',
    titre: 'L\'organe d\'administration (ex-CA)',
    description: 'Fonctionnement, composition et pouvoirs de l\'organe d\'administration depuis le CSA.',
    contenu: `
## L'organe d'administration

### Composition
- Minimum 3 membres (ou 2 si l'ASBL compte moins de 3 membres)
- Personnes physiques ou morales
- Nommés par l'Assemblée Générale

### Pouvoirs
L'organe d'administration est compétent pour :
- Tous les actes nécessaires à la réalisation de l'objet social
- La gestion courante de l'ASBL
- La représentation de l'ASBL envers les tiers

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
- **Trésorier** : Suivi financier, paiements
    `,
    categorie: 'juridique',
    tags: ['conseil administration', 'gouvernance', 'administrateurs', 'CSA'],
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-09-20T00:00:00Z',
  },

  // COMPTABILITÉ
  {
    id: 'res-8',
    titre: 'Plan comptable minimum normalisé (PCMN)',
    description: 'Structure du plan comptable belge adapté aux ASBL.',
    contenu: `
## Structure du PCMN pour ASBL

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
- 75 : Produits financiers
    `,
    categorie: 'comptabilite',
    tags: ['PCMN', 'plan comptable', 'comptabilité', 'classes'],
    important: true,
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'res-9',
    titre: 'TVA et ASBL',
    description: 'Quand une ASBL est-elle assujettie à la TVA ? Régimes et obligations.',
    contenu: `
## La TVA et les ASBL

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
| Normal | Mensuelle/trimestrielle | Oui |
    `,
    categorie: 'comptabilite',
    tags: ['TVA', 'fiscalité', 'assujettissement', 'exemption'],
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-08-15T00:00:00Z',
  },
  {
    id: 'res-10',
    titre: 'Gestion de trésorerie ASBL',
    description: 'Bonnes pratiques pour gérer la trésorerie de votre association.',
    contenu: `
## Gestion de trésorerie

### Principes fondamentaux
- Séparation stricte des comptes personnels et associatifs
- Double signature recommandée au-delà d'un certain montant
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
- Respecter l'affectation prévue
- Conserver tous les justificatifs
- Anticiper les délais de versement
- Préparer les rapports financiers à temps

### Pièges à éviter
- Mélanger fonds affectés et fonds propres
- Oublier de provisionner les charges annuelles
- Négliger les délais de paiement fournisseurs
    `,
    categorie: 'comptabilite',
    tags: ['trésorerie', 'budget', 'gestion financière', 'subventions'],
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-07-01T00:00:00Z',
  },

  // ARTISTES
  {
    id: 'res-11',
    titre: 'Le statut d\'artiste en Belgique',
    description: 'Comprendre le nouveau statut des travailleurs des arts (réforme 2022).',
    contenu: `
## Le statut des travailleurs des arts

### Réforme "Working in the Arts" (2022)
Nouvelle approche basée sur :
- Attestation du travail des arts
- Commission du travail des arts
- Règles spécifiques de chômage

### L'attestation du travail des arts
**Types d'attestations :**
- **Attestation "starter"** : Artistes débutants
- **Attestation ordinaire** : Artistes confirmés
- **Attestation "plus"** : Artistes avec parcours significatif

**Critères d'obtention :**
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
4. Renouvellement tous les 5 ans
    `,
    categorie: 'artistes',
    url: 'https://www.workinginthearts.be/',
    tags: ['statut artiste', 'attestation', 'chômage', 'réforme 2022'],
    important: true,
    created_at: '2024-01-30T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
  },
  {
    id: 'res-12',
    titre: 'Paiements via Smart',
    description: 'Comment fonctionne le paiement d\'artistes via la coopérative Smart.',
    contenu: `
## Smart - Société Mutuelle pour Artistes

### Principe
Smart est une coopérative d'activités qui permet aux artistes et professionnels créatifs de :
- Facturer leurs prestations en toute légalité
- Bénéficier du statut de salarié
- Être déchargés de la gestion administrative

### Fonctionnement
1. **Établissement du contrat** : Smart établit un contrat de travail
2. **Facturation** : Smart facture le client
3. **Paiement** : Le client paie Smart
4. **Salaire** : Smart verse le salaire à l'artiste (- charges sociales et commission)

### Coûts
- Commission Smart : environ 6,5% du montant facturé HT
- Charges sociales : cotisations employeur et employé
- Le net représente environ 50-55% du montant facturé

### Avantages
- Contrat de travail = droits sociaux complets
- Pas de comptabilité personnelle
- Protection sociale (chômage, maladie, pension)
- Accompagnement et conseils

### Pour l'ASBL employeur
- Simplicité administrative
- Pas de gestion de paie
- Facture déductible
    `,
    categorie: 'artistes',
    url: 'https://smartbe.be/',
    tags: ['Smart', 'paiement', 'coopérative', 'facturation'],
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z',
  },
  {
    id: 'res-13',
    titre: 'Indemnités et défraiements artistes',
    description: 'Règles pour les indemnités de déplacement, repas et hébergement.',
    contenu: `
## Indemnités et défraiements

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

### Conditions d'exonération
- Frais réellement exposés pour l'activité
- Ne pas dépasser les forfaits légaux
- Justificatifs conservés (sauf forfaits)
- Pas de cumul avec remboursements réels

### Pour les RPI (Petites indemnités)
- Maximum 151,70 €/jour (2024)
- Maximum 30 jours/an avec le même donneur d'ordre
- Maximum 7 donneurs d'ordre différents/an
    `,
    categorie: 'artistes',
    tags: ['indemnités', 'défraiements', 'déplacements', 'RPI'],
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-09-10T00:00:00Z',
  },
  {
    id: 'res-14',
    titre: 'Droits d\'auteur et droits voisins',
    description: 'Fiscalité avantageuse des droits d\'auteur pour les artistes.',
    contenu: `
## Droits d'auteur - Régime fiscal

### Principe (depuis 2023)
Les revenus de droits d'auteur bénéficient d'un régime fiscal avantageux jusqu'à un certain plafond.

### Plafonds 2024
- **Première tranche (0-17.090 €)** : 15% de précompte mobilier
- **Seconde tranche (17.090-34.170 €)** : 15% + conditions restrictives
- **Au-delà** : Requalification possible en revenus professionnels

### Conditions d'application
- Cession ou concession de droits d'auteur/voisins
- Œuvre originale portant l'empreinte de la personnalité
- Contrat de cession distinct du contrat de travail

### Frais forfaitaires déductibles
- 50% sur les premiers 18.720 €
- 25% sur la tranche suivante (18.720 - 37.450 €)

### Restrictions depuis 2023
- Ratio droits d'auteur/revenus professionnels limité
- Liste limitative des secteurs éligibles
- Attestation requise dans certains cas

### Conseils pratiques
- Établir un contrat de cession séparé
- Distinguer clairement prestation et cession
- Conserver les preuves de création originale
    `,
    categorie: 'artistes',
    tags: ['droits auteur', 'fiscalité', 'précompte mobilier', 'création'],
    created_at: '2024-04-05T00:00:00Z',
    updated_at: '2024-08-20T00:00:00Z',
  },

  // LIENS UTILES
  {
    id: 'res-15',
    titre: 'MonASBL.be',
    description: 'Le site de référence pour les responsables d\'ASBL en Belgique.',
    categorie: 'liens',
    url: 'https://www.monasbl.be/',
    tags: ['portail', 'ressources', 'informations', 'actualités'],
    important: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'res-16',
    titre: 'BCE - Banque-Carrefour des Entreprises',
    description: 'Consultez les données officielles de votre ASBL et effectuez vos démarches.',
    categorie: 'liens',
    url: 'https://kbopub.economie.fgov.be/',
    tags: ['BCE', 'officiel', 'données', 'numéro entreprise'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'res-17',
    titre: 'E-greffe',
    description: 'Dépôt en ligne des actes au greffe du tribunal de l\'entreprise.',
    categorie: 'liens',
    url: 'https://www.e-greffe.be/',
    tags: ['greffe', 'dépôt', 'statuts', 'publications'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'res-18',
    titre: 'Fédération Wallonie-Bruxelles - Culture',
    description: 'Subventions et aides pour le secteur culturel en FWB.',
    categorie: 'liens',
    url: 'https://www.culture.be/',
    tags: ['FWB', 'subventions', 'culture', 'aides'],
    important: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'res-19',
    titre: 'Working in the Arts',
    description: 'Plateforme officielle pour l\'attestation du travail des arts.',
    categorie: 'liens',
    url: 'https://www.workinginthearts.be/',
    tags: ['artistes', 'attestation', 'statut', 'officiel'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'res-20',
    titre: 'Registre UBO',
    description: 'Application pour la déclaration des bénéficiaires effectifs.',
    categorie: 'liens',
    url: 'https://finances.belgium.be/fr/E-services/ubo-register',
    tags: ['UBO', 'bénéficiaires', 'déclaration', 'MyMinfin'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'res-21',
    titre: 'Smart Belgium',
    description: 'Coopérative d\'activités pour les travailleurs autonomes du secteur créatif.',
    categorie: 'liens',
    url: 'https://smartbe.be/',
    tags: ['Smart', 'coopérative', 'facturation', 'artistes'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'res-22',
    titre: 'Artist@Work',
    description: 'Portail de gestion du statut d\'artiste et des prestations.',
    categorie: 'liens',
    url: 'https://www.artistatwork.be/',
    tags: ['artiste', 'prestations', 'carte artiste', 'portail'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const getRessourcesByCategorie = (categorie: string) =>
  mockRessources.filter(r => r.categorie === categorie);

export const getImportantRessources = () =>
  mockRessources.filter(r => r.important);

// ==================
// TRANSFERTS INTERNES
// ==================
export const mockTransferts: Transfert[] = [
  {
    id: 'tf-1',
    date: '2025-01-15',
    montant: 500,
    description: 'Avance sur cachet projet LVLR',
    source_type: 'projet',
    source_projet_id: 'proj-1',
    destination_type: 'artiste',
    destination_artiste_id: 'art-2',
    transaction_debit_id: 'tr-tf-1-debit',
    transaction_credit_id: 'tr-tf-1-credit',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'tf-2',
    date: '2025-01-10',
    montant: 200,
    description: 'Remboursement matériel son',
    source_type: 'artiste',
    source_artiste_id: 'art-1',
    destination_type: 'artiste',
    destination_artiste_id: 'art-3',
    transaction_debit_id: 'tr-tf-2-debit',
    transaction_credit_id: 'tr-tf-2-credit',
    created_at: '2025-01-10T14:30:00Z',
    updated_at: '2025-01-10T14:30:00Z',
  },
  {
    id: 'tf-3',
    date: '2024-12-20',
    montant: 750,
    description: 'Contribution au projet Poema',
    source_type: 'artiste',
    source_artiste_id: 'art-2',
    destination_type: 'projet',
    destination_projet_id: 'proj-4',
    transaction_debit_id: 'tr-tf-3-debit',
    transaction_credit_id: 'tr-tf-3-credit',
    created_at: '2024-12-20T09:00:00Z',
    updated_at: '2024-12-20T09:00:00Z',
  },
  {
    id: 'tf-4',
    date: '2024-11-15',
    montant: 1200,
    description: 'Transfert budget résidence',
    source_type: 'projet',
    source_projet_id: 'proj-2',
    destination_type: 'projet',
    destination_projet_id: 'proj-1',
    transaction_debit_id: 'tr-tf-4-debit',
    transaction_credit_id: 'tr-tf-4-credit',
    created_at: '2024-11-15T16:00:00Z',
    updated_at: '2024-11-15T16:00:00Z',
  },
];

export const getTransfertsWithRelations = (): Transfert[] => {
  return mockTransferts.map(t => ({
    ...t,
    source_artiste: t.source_artiste_id ? getArtisteById(t.source_artiste_id) : undefined,
    source_projet: t.source_projet_id ? getProjetById(t.source_projet_id) : undefined,
    destination_artiste: t.destination_artiste_id ? getArtisteById(t.destination_artiste_id) : undefined,
    destination_projet: t.destination_projet_id ? getProjetById(t.destination_projet_id) : undefined,
  }));
};

// Alias exports pour faciliter les imports
export const artistes = mockArtistes;
export const projets = mockProjets;
export const transactions = getTransactionsWithRelations();
export const bilansAnnuels = mockBilansAnnuels;
export const bilansMensuels2024 = mockBilansMensuels2024;
export const users = mockUsers;
export const ressources = mockRessources;
export const transferts = getTransfertsWithRelations();
export { CATEGORIES, RESSOURCE_CATEGORIES } from '@/types';
