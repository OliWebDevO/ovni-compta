'use server';

import { createClient } from '@/lib/supabase/server';
import type { TransactionCategorie, TransactionWithRelations } from '@/types/database';
import {
  createTransactionSchema,
  updateTransactionSchema,
  uuidSchema,
  validateInput,
} from '@/lib/schemas';
import { z } from 'zod';

export async function getTransactions(): Promise<{
  data: TransactionWithRelations[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*, artistes ( nom, couleur ), projets ( code, nom )')
    .order('date', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const transactions: TransactionWithRelations[] = (data || []).map((t) => ({
    id: t.id,
    date: t.date,
    description: t.description,
    credit: t.credit,
    debit: t.debit,
    categorie: t.categorie,
    artiste_id: t.artiste_id,
    projet_id: t.projet_id,
    transfert_id: t.transfert_id,
    created_at: t.created_at,
    updated_at: t.updated_at,
    artiste_nom: (t.artistes as { nom: string; couleur: string | null } | null)?.nom,
    artiste_couleur: (t.artistes as { nom: string; couleur: string | null } | null)?.couleur ?? undefined,
    projet_code: (t.projets as { code: string; nom: string } | null)?.code,
    projet_nom: (t.projets as { code: string; nom: string } | null)?.nom,
  }));

  return { data: transactions, error: null };
}

export async function getRecentTransactions(limit: number = 5): Promise<{
  data: TransactionWithRelations[] | null;
  error: string | null;
}> {
  // Validate limit
  const limitValidation = validateInput(z.number().int().min(1).max(100), limit);
  if (!limitValidation.success) {
    return { data: null, error: limitValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*, artistes ( nom, couleur ), projets ( code, nom )')
    .order('date', { ascending: false })
    .limit(limitValidation.data);

  if (error) {
    return { data: null, error: error.message };
  }

  const transactions: TransactionWithRelations[] = (data || []).map((t) => ({
    id: t.id,
    date: t.date,
    description: t.description,
    credit: t.credit,
    debit: t.debit,
    categorie: t.categorie,
    artiste_id: t.artiste_id,
    projet_id: t.projet_id,
    transfert_id: t.transfert_id,
    created_at: t.created_at,
    updated_at: t.updated_at,
    artiste_nom: (t.artistes as { nom: string; couleur: string | null } | null)?.nom,
    artiste_couleur: (t.artistes as { nom: string; couleur: string | null } | null)?.couleur ?? undefined,
    projet_code: (t.projets as { code: string; nom: string } | null)?.code,
    projet_nom: (t.projets as { code: string; nom: string } | null)?.nom,
  }));

  return { data: transactions, error: null };
}

export async function getGlobalStats(): Promise<{
  data: {
    totalCredits: number;
    totalDebits: number;
    solde: number;
    transactionsCount: number;
  } | null;
  error: string | null;
}> {
  const supabase = await createClient();

  // Use the bilans_annuels view which already aggregates data via SQL
  const { data, error } = await supabase
    .from('bilans_annuels')
    .select('total_credit, total_debit, nb_transactions');

  if (error) {
    return { data: null, error: error.message };
  }

  // Sum across all years (the view groups by year)
  const totalCredits = (data || []).reduce((sum, row) => sum + (row.total_credit || 0), 0);
  const totalDebits = (data || []).reduce((sum, row) => sum + (row.total_debit || 0), 0);
  const transactionsCount = (data || []).reduce((sum, row) => sum + (row.nb_transactions || 0), 0);

  return {
    data: {
      totalCredits,
      totalDebits,
      solde: totalCredits - totalDebits,
      transactionsCount,
    },
    error: null,
  };
}

export async function getTransaction(id: string): Promise<{
  data: TransactionWithRelations | null;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { data: null, error: idValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*, artistes ( nom, couleur ), projets ( code, nom )')
    .eq('id', idValidation.data)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  const transaction: TransactionWithRelations = {
    id: data.id,
    date: data.date,
    description: data.description,
    credit: data.credit,
    debit: data.debit,
    categorie: data.categorie,
    artiste_id: data.artiste_id,
    projet_id: data.projet_id,
    transfert_id: data.transfert_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    artiste_nom: (data.artistes as { nom: string; couleur: string | null } | null)?.nom,
    artiste_couleur: (data.artistes as { nom: string; couleur: string | null } | null)?.couleur ?? undefined,
    projet_code: (data.projets as { code: string; nom: string } | null)?.code,
    projet_nom: (data.projets as { code: string; nom: string } | null)?.nom,
  };

  return { data: transaction, error: null };
}

export async function createTransaction(input: {
  date: string;
  description: string;
  credit: number;
  debit: number;
  artiste_id: string | null;
  projet_id: string | null;
  categorie: TransactionCategorie | null;
}): Promise<{ data: { id: string } | null; error: string | null }> {
  // Validate input
  const validation = validateInput(createTransactionSchema, input);
  if (!validation.success) {
    return { data: null, error: validation.error };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      date: validation.data.date,
      description: validation.data.description,
      credit: validation.data.credit,
      debit: validation.data.debit,
      artiste_id: validation.data.artiste_id,
      projet_id: validation.data.projet_id,
      categorie: validation.data.categorie,
      created_by: user?.id || null,
    })
    .select('id')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateTransaction(
  id: string,
  updates: {
    date?: string;
    description?: string;
    credit?: number;
    debit?: number;
    artiste_id?: string | null;
    projet_id?: string | null;
    categorie?: TransactionCategorie | null;
  }
): Promise<{ success: boolean; error: string | null }> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { success: false, error: idValidation.error };
  }

  // Validate updates
  const validation = validateInput(updateTransactionSchema, updates);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('transactions')
    .update(validation.data)
    .eq('id', idValidation.data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteTransaction(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { success: false, error: idValidation.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', idValidation.data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
