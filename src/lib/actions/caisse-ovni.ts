'use server';

import { createClient } from '@/lib/supabase/server';
import type { TransactionCategorie } from '@/types/database';
import { createAsblTransactionSchema, uuidSchema, validateInput } from '@/lib/schemas';
import { rateLimit } from '@/lib/rate-limit';

export interface AsblTransaction {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  categorie: TransactionCategorie | null;
  created_at: string;
  updated_at: string;
}

export async function getAsblTransactions(): Promise<{
  data: AsblTransaction[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('id, date, description, credit, debit, categorie, created_at, updated_at')
    .is('artiste_id', null)
    .is('projet_id', null)
    .order('date', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as AsblTransaction[], error: null };
}

export async function getAsblStats(): Promise<{
  data: {
    totalCredits: number;
    totalDebits: number;
    solde: number;
    transactionsCount: number;
  } | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('credit, debit')
    .is('artiste_id', null)
    .is('projet_id', null);

  if (error) {
    return { data: null, error: error.message };
  }

  const totalCredits = (data || []).reduce((sum, t) => sum + (t.credit || 0), 0);
  const totalDebits = (data || []).reduce((sum, t) => sum + (t.debit || 0), 0);

  return {
    data: {
      totalCredits,
      totalDebits,
      solde: totalCredits - totalDebits,
      transactionsCount: data?.length || 0,
    },
    error: null,
  };
}

export async function createAsblTransaction(input: {
  date: string;
  description: string;
  credit: number;
  debit: number;
  categorie: TransactionCategorie | null;
}): Promise<{ data: { id: string } | null; error: string | null }> {
  // Validate input
  const validation = validateInput(createAsblTransactionSchema, input);
  if (!validation.success) {
    return { data: null, error: validation.error };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rate limit per user
  const rl = rateLimit(`createAsblTx:${user?.id}`, 20, 60_000);
  if (!rl.allowed) return { data: null, error: rl.error };

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      date: validation.data.date,
      description: validation.data.description,
      credit: validation.data.credit,
      debit: validation.data.debit,
      categorie: validation.data.categorie,
      artiste_id: null,
      projet_id: null,
      created_by: user?.id || null,
    })
    .select('id')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteAsblTransaction(id: string): Promise<{
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
    .eq('id', idValidation.data)
    .is('artiste_id', null)
    .is('projet_id', null);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
