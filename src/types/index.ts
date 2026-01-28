// Types pour l'application O.V.N.I Compta

export interface User {
  id: string;
  email: string;
  nom: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  created_at: string;
}

export interface Artiste {
  id: string;
  nom: string;
  email?: string;
  telephone?: string;
  notes?: string;
  actif: boolean;
  couleur?: string; // Couleur personnalisée de l'artiste (hex)
  created_at: string;
  updated_at: string;
  // Calculés
  solde?: number;
  total_credit?: number;
  total_debit?: number;
  nb_transactions?: number;
}

export interface Projet {
  id: string;
  nom: string;
  code: string;
  description?: string;
  artiste_id?: string;
  artiste?: Artiste;
  date_debut?: string;
  date_fin?: string;
  budget?: number;
  statut: 'actif' | 'termine' | 'annule';
  created_at: string;
  updated_at: string;
  // Calculés
  solde?: number;
  total_credit?: number;
  total_debit?: number;
  reste_budget?: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  artiste_id?: string;
  artiste?: Artiste;
  projet_id?: string;
  projet?: Projet;
  categorie?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Champs pour les transferts internes
  transfer_id?: string;
  transfer_type?: 'debit' | 'credit';
}

// Types pour les transferts internes
export type CompteType = 'artiste' | 'projet';

export interface Transfert {
  id: string;
  date: string;
  montant: number;
  description: string;
  // Source
  source_type: CompteType;
  source_artiste_id?: string;
  source_projet_id?: string;
  source_artiste?: Artiste;
  source_projet?: Projet;
  // Destination
  destination_type: CompteType;
  destination_artiste_id?: string;
  destination_projet_id?: string;
  destination_artiste?: Artiste;
  destination_projet?: Projet;
  // Transactions liées
  transaction_debit_id: string;
  transaction_credit_id: string;
  // Metadata
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface BilanAnnuel {
  annee: number;
  total_credit: number;
  total_debit: number;
  solde: number;
  nb_transactions: number;
}

export interface BilanMensuel {
  mois: number;
  annee: number;
  total_credit: number;
  total_debit: number;
  solde: number;
}

export type TransactionCategorie =
  | 'smart'
  | 'thoman'
  | 'frais_bancaires'
  | 'loyer'
  | 'materiel'
  | 'deplacement'
  | 'cachet'
  | 'subvention'
  | 'transfert_interne'
  | 'autre';

export const CATEGORIES: { value: TransactionCategorie; label: string }[] = [
  { value: 'cachet', label: 'Cachet' },
  { value: 'subvention', label: 'Subvention' },
  { value: 'smart', label: 'Smart' },
  { value: 'thoman', label: 'Thomann' },
  { value: 'materiel', label: 'Matériel' },
  { value: 'loyer', label: 'Loyer' },
  { value: 'deplacement', label: 'Déplacement' },
  { value: 'frais_bancaires', label: 'Frais bancaires' },
  { value: 'transfert_interne', label: 'Transfert interne' },
  { value: 'autre', label: 'Autre' },
];

// Types pour les ressources ASBL
export type RessourceCategorie =
  | 'guide'
  | 'juridique'
  | 'comptabilite'
  | 'artistes'
  | 'liens';

export interface Ressource {
  id: string;
  titre: string;
  description: string;
  contenu?: string;
  categorie: RessourceCategorie;
  url?: string;
  tags: string[];
  icon?: string;
  important?: boolean;
  created_at: string;
  updated_at: string;
}

export const RESSOURCE_CATEGORIES: { value: RessourceCategorie; label: string; description: string }[] = [
  { value: 'guide', label: 'Guides', description: 'Guides pratiques pour la gestion de votre ASBL' },
  { value: 'juridique', label: 'Juridique', description: 'Informations légales et réglementaires' },
  { value: 'comptabilite', label: 'Comptabilité', description: 'Ressources comptables et financières' },
  { value: 'artistes', label: 'Artistes', description: 'Statut d\'artiste et secteur culturel' },
  { value: 'liens', label: 'Liens utiles', description: 'Sites et ressources externes' },
];
