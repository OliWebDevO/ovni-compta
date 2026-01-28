// Logique métier pour les transferts internes
import type { Transfert, Transaction, CompteType } from '@/types';

interface CreateTransfertParams {
  date: string;
  montant: number;
  description: string;
  sourceType: CompteType;
  sourceId: string;
  destinationType: CompteType;
  destinationId: string;
  createdBy?: string;
}

interface CreateTransfertResult {
  transfert: Transfert;
  transactionDebit: Transaction;
  transactionCredit: Transaction;
}

/**
 * Génère un ID unique pour les transferts et transactions
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Crée un transfert interne avec ses deux transactions liées
 * - Une transaction DEBIT sur la source
 * - Une transaction CREDIT sur la destination
 */
export function createTransfert(params: CreateTransfertParams): CreateTransfertResult {
  const {
    date,
    montant,
    description,
    sourceType,
    sourceId,
    destinationType,
    destinationId,
    createdBy,
  } = params;

  const now = new Date().toISOString();
  const transfertId = generateId('tf');
  const transactionDebitId = generateId('tr');
  const transactionCreditId = generateId('tr');

  // Transaction DEBIT (sur la source)
  const transactionDebit: Transaction = {
    id: transactionDebitId,
    date,
    description: `[Transfert] ${description}`,
    credit: 0,
    debit: montant,
    artiste_id: sourceType === 'artiste' ? sourceId : undefined,
    projet_id: sourceType === 'projet' ? sourceId : undefined,
    categorie: 'transfert_interne',
    transfer_id: transfertId,
    transfer_type: 'debit',
    created_by: createdBy,
    created_at: now,
    updated_at: now,
  };

  // Transaction CREDIT (sur la destination)
  const transactionCredit: Transaction = {
    id: transactionCreditId,
    date,
    description: `[Transfert] ${description}`,
    credit: montant,
    debit: 0,
    artiste_id: destinationType === 'artiste' ? destinationId : undefined,
    projet_id: destinationType === 'projet' ? destinationId : undefined,
    categorie: 'transfert_interne',
    transfer_id: transfertId,
    transfer_type: 'credit',
    created_by: createdBy,
    created_at: now,
    updated_at: now,
  };

  // Enregistrement Transfert
  const transfert: Transfert = {
    id: transfertId,
    date,
    montant,
    description,
    source_type: sourceType,
    source_artiste_id: sourceType === 'artiste' ? sourceId : undefined,
    source_projet_id: sourceType === 'projet' ? sourceId : undefined,
    destination_type: destinationType,
    destination_artiste_id: destinationType === 'artiste' ? destinationId : undefined,
    destination_projet_id: destinationType === 'projet' ? destinationId : undefined,
    transaction_debit_id: transactionDebitId,
    transaction_credit_id: transactionCreditId,
    created_by: createdBy,
    created_at: now,
    updated_at: now,
  };

  return {
    transfert,
    transactionDebit,
    transactionCredit,
  };
}

/**
 * Formate le label d'un compte (artiste ou projet)
 */
export function getCompteLabel(
  type: CompteType,
  artiste?: { nom: string },
  projet?: { nom: string; code: string }
): string {
  if (type === 'artiste' && artiste) {
    return artiste.nom;
  }
  if (type === 'projet' && projet) {
    return `${projet.nom} (${projet.code})`;
  }
  return '-';
}
