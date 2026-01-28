'use server';

import { createClient } from '@/lib/supabase/server';
import type { TransactionCategorie, TransactionWithRelations } from '@/types/database';

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*, artistes ( nom, couleur ), projets ( code, nom )')
    .order('date', { ascending: false })
    .limit(limit);

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

export async function getTransaction(id: string): Promise<{
  data: TransactionWithRelations | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*, artistes ( nom, couleur ), projets ( code, nom )')
    .eq('id', id)
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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...input,
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
  const supabase = await createClient();

  const { error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteTransaction(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
