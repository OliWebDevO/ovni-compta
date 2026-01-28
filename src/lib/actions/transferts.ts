'use server';

import { createClient } from '@/lib/supabase/server';

export interface TransfertWithRelations {
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
  created_at: string;
  source_nom?: string;
  destination_nom?: string;
}

export async function getTransferts(): Promise<{
  data: TransfertWithRelations[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transferts')
    .select(`
      *,
      source_artiste:artistes!transferts_source_artiste_id_fkey ( nom ),
      source_projet:projets!transferts_source_projet_id_fkey ( nom ),
      dest_artiste:artistes!transferts_destination_artiste_id_fkey ( nom ),
      dest_projet:projets!transferts_destination_projet_id_fkey ( nom )
    `)
    .order('date', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const transferts: TransfertWithRelations[] = (data || []).map((t) => ({
    id: t.id,
    date: t.date,
    montant: t.montant,
    description: t.description,
    source_type: t.source_type,
    source_artiste_id: t.source_artiste_id,
    source_projet_id: t.source_projet_id,
    destination_type: t.destination_type,
    destination_artiste_id: t.destination_artiste_id,
    destination_projet_id: t.destination_projet_id,
    transaction_debit_id: t.transaction_debit_id,
    transaction_credit_id: t.transaction_credit_id,
    created_at: t.created_at,
    source_nom:
      (t.source_artiste as { nom: string } | null)?.nom ||
      (t.source_projet as { nom: string } | null)?.nom,
    destination_nom:
      (t.dest_artiste as { nom: string } | null)?.nom ||
      (t.dest_projet as { nom: string } | null)?.nom,
  }));

  return { data: transferts, error: null };
}

export async function createTransfert(input: {
  date: string;
  montant: number;
  description: string;
  source_type: 'artiste' | 'projet';
  source_artiste_id: string | null;
  source_projet_id: string | null;
  destination_type: 'artiste' | 'projet';
  destination_artiste_id: string | null;
  destination_projet_id: string | null;
}): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Créer la transaction de débit (sortie de la source)
  const { data: debitTx, error: debitError } = await supabase
    .from('transactions')
    .insert({
      date: input.date,
      description: `Transfert: ${input.description}`,
      credit: 0,
      debit: input.montant,
      artiste_id: input.source_type === 'artiste' ? input.source_artiste_id : null,
      projet_id: input.source_type === 'projet' ? input.source_projet_id : null,
      categorie: 'transfert_interne',
      created_by: user?.id || null,
    })
    .select('id')
    .single();

  if (debitError) {
    return { success: false, error: debitError.message };
  }

  // Créer la transaction de crédit (entrée dans la destination)
  const { data: creditTx, error: creditError } = await supabase
    .from('transactions')
    .insert({
      date: input.date,
      description: `Transfert: ${input.description}`,
      credit: input.montant,
      debit: 0,
      artiste_id: input.destination_type === 'artiste' ? input.destination_artiste_id : null,
      projet_id: input.destination_type === 'projet' ? input.destination_projet_id : null,
      categorie: 'transfert_interne',
      created_by: user?.id || null,
    })
    .select('id')
    .single();

  if (creditError) {
    return { success: false, error: creditError.message };
  }

  // Créer le transfert liant les deux transactions
  const { error: transfertError } = await supabase
    .from('transferts')
    .insert({
      date: input.date,
      montant: input.montant,
      description: input.description,
      source_type: input.source_type,
      source_artiste_id: input.source_artiste_id,
      source_projet_id: input.source_projet_id,
      destination_type: input.destination_type,
      destination_artiste_id: input.destination_artiste_id,
      destination_projet_id: input.destination_projet_id,
      transaction_debit_id: debitTx.id,
      transaction_credit_id: creditTx.id,
      created_by: user?.id || null,
    });

  if (transfertError) {
    return { success: false, error: transfertError.message };
  }

  return { success: true, error: null };
}

export async function deleteTransfert(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClient();

  // Récupérer les IDs des transactions liées
  const { data: transfert, error: fetchError } = await supabase
    .from('transferts')
    .select('transaction_debit_id, transaction_credit_id')
    .eq('id', id)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  // Supprimer le transfert (les transactions seront supprimées par cascade ou manuellement)
  const { error: deleteError } = await supabase
    .from('transferts')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  // Supprimer les transactions liées
  if (transfert) {
    await supabase
      .from('transactions')
      .delete()
      .in('id', [transfert.transaction_debit_id, transfert.transaction_credit_id]);
  }

  return { success: true, error: null };
}
