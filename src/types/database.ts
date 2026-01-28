// Types generated from Supabase schema
// Run `npx supabase gen types typescript --local` to regenerate

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nom: string;
          role: 'admin' | 'editor' | 'viewer';
          avatar: string | null;
          artiste_id: string | null;
          couleur: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nom: string;
          role?: 'admin' | 'editor' | 'viewer';
          avatar?: string | null;
          artiste_id?: string | null;
          couleur?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nom?: string;
          role?: 'admin' | 'editor' | 'viewer';
          avatar?: string | null;
          artiste_id?: string | null;
          couleur?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_artiste_id_fkey';
            columns: ['artiste_id'];
            isOneToOne: false;
            referencedRelation: 'artistes';
            referencedColumns: ['id'];
          },
        ];
      };
      allowed_emails: {
        Row: {
          id: string;
          email: string;
          artiste_id: string | null;
          can_create_artiste: boolean;
          role: 'admin' | 'editor' | 'viewer';
          invited_by: string | null;
          used: boolean;
          used_at: string | null;
          expires_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          artiste_id?: string | null;
          can_create_artiste?: boolean;
          role?: 'admin' | 'editor' | 'viewer';
          invited_by?: string | null;
          used?: boolean;
          used_at?: string | null;
          expires_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          artiste_id?: string | null;
          can_create_artiste?: boolean;
          role?: 'admin' | 'editor' | 'viewer';
          invited_by?: string | null;
          used?: boolean;
          used_at?: string | null;
          expires_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'allowed_emails_artiste_id_fkey';
            columns: ['artiste_id'];
            isOneToOne: false;
            referencedRelation: 'artistes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'allowed_emails_invited_by_fkey';
            columns: ['invited_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      artistes: {
        Row: {
          id: string;
          nom: string;
          email: string | null;
          telephone: string | null;
          notes: string | null;
          actif: boolean;
          couleur: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          email?: string | null;
          telephone?: string | null;
          notes?: string | null;
          actif?: boolean;
          couleur?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          email?: string | null;
          telephone?: string | null;
          notes?: string | null;
          actif?: boolean;
          couleur?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projets: {
        Row: {
          id: string;
          nom: string;
          code: string;
          description: string | null;
          artiste_id: string | null;
          date_debut: string | null;
          date_fin: string | null;
          budget: number | null;
          statut: 'actif' | 'termine' | 'annule';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          code: string;
          description?: string | null;
          artiste_id?: string | null;
          date_debut?: string | null;
          date_fin?: string | null;
          budget?: number | null;
          statut?: 'actif' | 'termine' | 'annule';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          code?: string;
          description?: string | null;
          artiste_id?: string | null;
          date_debut?: string | null;
          date_fin?: string | null;
          budget?: number | null;
          statut?: 'actif' | 'termine' | 'annule';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projets_artiste_id_fkey';
            columns: ['artiste_id'];
            isOneToOne: false;
            referencedRelation: 'artistes';
            referencedColumns: ['id'];
          },
        ];
      };
      transactions: {
        Row: {
          id: string;
          date: string;
          description: string;
          credit: number;
          debit: number;
          artiste_id: string | null;
          projet_id: string | null;
          categorie: TransactionCategorie | null;
          transfert_id: string | null;
          transfert_type: 'debit' | 'credit' | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          description: string;
          credit?: number;
          debit?: number;
          artiste_id?: string | null;
          projet_id?: string | null;
          categorie?: TransactionCategorie | null;
          transfert_id?: string | null;
          transfert_type?: 'debit' | 'credit' | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          description?: string;
          credit?: number;
          debit?: number;
          artiste_id?: string | null;
          projet_id?: string | null;
          categorie?: TransactionCategorie | null;
          transfert_id?: string | null;
          transfert_type?: 'debit' | 'credit' | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_artiste_id_fkey';
            columns: ['artiste_id'];
            isOneToOne: false;
            referencedRelation: 'artistes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_projet_id_fkey';
            columns: ['projet_id'];
            isOneToOne: false;
            referencedRelation: 'projets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fk_transactions_transfert';
            columns: ['transfert_id'];
            isOneToOne: false;
            referencedRelation: 'transferts';
            referencedColumns: ['id'];
          },
        ];
      };
      transferts: {
        Row: {
          id: string;
          date: string;
          montant: number;
          description: string;
          source_type: 'artiste' | 'projet';
          source_artiste_id: string | null;
          source_projet_id: string | null;
          destination_type: 'artiste' | 'projet';
          destination_artiste_id: string | null;
          destination_projet_id: string | null;
          transaction_debit_id: string;
          transaction_credit_id: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          montant: number;
          description: string;
          source_type: 'artiste' | 'projet';
          source_artiste_id?: string | null;
          source_projet_id?: string | null;
          destination_type: 'artiste' | 'projet';
          destination_artiste_id?: string | null;
          destination_projet_id?: string | null;
          transaction_debit_id: string;
          transaction_credit_id: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          montant?: number;
          description?: string;
          source_type?: 'artiste' | 'projet';
          source_artiste_id?: string | null;
          source_projet_id?: string | null;
          destination_type?: 'artiste' | 'projet';
          destination_artiste_id?: string | null;
          destination_projet_id?: string | null;
          transaction_debit_id?: string;
          transaction_credit_id?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transferts_source_artiste_id_fkey';
            columns: ['source_artiste_id'];
            isOneToOne: false;
            referencedRelation: 'artistes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transferts_source_projet_id_fkey';
            columns: ['source_projet_id'];
            isOneToOne: false;
            referencedRelation: 'projets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transferts_destination_artiste_id_fkey';
            columns: ['destination_artiste_id'];
            isOneToOne: false;
            referencedRelation: 'artistes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transferts_destination_projet_id_fkey';
            columns: ['destination_projet_id'];
            isOneToOne: false;
            referencedRelation: 'projets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transferts_transaction_debit_id_fkey';
            columns: ['transaction_debit_id'];
            isOneToOne: false;
            referencedRelation: 'transactions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transferts_transaction_credit_id_fkey';
            columns: ['transaction_credit_id'];
            isOneToOne: false;
            referencedRelation: 'transactions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transferts_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      projet_artistes: {
        Row: {
          id: string;
          projet_id: string;
          artiste_id: string;
          role_projet: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          projet_id: string;
          artiste_id: string;
          role_projet?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          projet_id?: string;
          artiste_id?: string;
          role_projet?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projet_artistes_projet_id_fkey';
            columns: ['projet_id'];
            isOneToOne: false;
            referencedRelation: 'projets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'projet_artistes_artiste_id_fkey';
            columns: ['artiste_id'];
            isOneToOne: false;
            referencedRelation: 'artistes';
            referencedColumns: ['id'];
          },
        ];
      };
      ressources: {
        Row: {
          id: string;
          titre: string;
          description: string;
          contenu: string | null;
          categorie: RessourceCategorie;
          url: string | null;
          tags: string[];
          icon: string | null;
          important: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titre: string;
          description: string;
          contenu?: string | null;
          categorie: RessourceCategorie;
          url?: string | null;
          tags?: string[];
          icon?: string | null;
          important?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titre?: string;
          description?: string;
          contenu?: string | null;
          categorie?: RessourceCategorie;
          url?: string | null;
          tags?: string[];
          icon?: string | null;
          important?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      artistes_with_stats: {
        Row: {
          id: string;
          nom: string;
          email: string | null;
          telephone: string | null;
          notes: string | null;
          actif: boolean;
          couleur: string | null;
          created_at: string;
          updated_at: string;
          total_credit: number;
          total_debit: number;
          solde: number;
          nb_transactions: number;
        };
        Relationships: [];
      };
      projets_with_stats: {
        Row: {
          id: string;
          nom: string;
          code: string;
          description: string | null;
          artiste_id: string | null;
          date_debut: string | null;
          date_fin: string | null;
          budget: number | null;
          statut: 'actif' | 'termine' | 'annule';
          created_at: string;
          updated_at: string;
          total_credit: number;
          total_debit: number;
          solde: number;
          nb_transactions: number;
          reste_budget: number;
        };
        Relationships: [
          {
            foreignKeyName: 'projets_artiste_id_fkey';
            columns: ['artiste_id'];
            isOneToOne: false;
            referencedRelation: 'artistes';
            referencedColumns: ['id'];
          },
        ];
      };
      bilans_annuels: {
        Row: {
          annee: number;
          total_credit: number;
          total_debit: number;
          solde: number;
          nb_transactions: number;
        };
        Relationships: [];
      };
      bilans_mensuels: {
        Row: {
          mois: number;
          annee: number;
          total_credit: number;
          total_debit: number;
          solde: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_user_role: {
        Args: {
          user_id: string;
        };
        Returns: 'admin' | 'editor' | 'viewer';
      };
    };
    Enums: {
      user_role: 'admin' | 'editor' | 'viewer';
      projet_statut: 'actif' | 'termine' | 'annule';
      compte_type: 'artiste' | 'projet';
      transaction_categorie: TransactionCategorie;
      ressource_categorie: RessourceCategorie;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Enum types
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

export type RessourceCategorie =
  | 'guide'
  | 'juridique'
  | 'comptabilite'
  | 'artistes'
  | 'liens';

// Helper types for easier use
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Convenience type aliases
export type Profile = Tables<'profiles'>;
export type AllowedEmail = Tables<'allowed_emails'>;
export type Artiste = Tables<'artistes'>;
export type Projet = Tables<'projets'>;
export type Transaction = Tables<'transactions'>;
export type Transfert = Tables<'transferts'>;
export type ProjetArtiste = Tables<'projet_artistes'>;
export type Ressource = Tables<'ressources'>;

// View types
export type ArtisteWithStats = Views<'artistes_with_stats'>;
export type ProjetWithStats = Views<'projets_with_stats'>;
export type BilanAnnuel = Views<'bilans_annuels'>;
export type BilanMensuel = Views<'bilans_mensuels'>;

// Custom types for actions
export interface TransactionWithRelations {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  categorie: TransactionCategorie | null;
  artiste_id: string | null;
  projet_id: string | null;
  transfert_id: string | null;
  created_at: string;
  updated_at: string;
  artiste_nom?: string;
  artiste_couleur?: string;
  projet_code?: string;
  projet_nom?: string;
}
