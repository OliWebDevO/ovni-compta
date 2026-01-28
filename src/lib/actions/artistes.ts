'use server';

import { createClient } from '@/lib/supabase/server';
import type { ArtisteWithStats, Artiste } from '@/types/database';

export async function getArtistes(): Promise<{
  data: ArtisteWithStats[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('artistes_with_stats')
    .select('*')
    .order('nom');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as ArtisteWithStats[], error: null };
}

export async function getArtisteById(id: string): Promise<{
  data: ArtisteWithStats | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('artistes_with_stats')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as ArtisteWithStats, error: null };
}

export async function getArtisteTransactions(artisteId: string): Promise<{
  data: Array<{
    id: string;
    date: string;
    description: string;
    credit: number;
    debit: number;
    categorie: string | null;
    projet_id: string | null;
    projet_code?: string;
  }> | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('id, date, description, credit, debit, categorie, projet_id, projets ( code )')
    .eq('artiste_id', artisteId)
    .order('date', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const transactions = (data || []).map((t) => ({
    id: t.id,
    date: t.date,
    description: t.description,
    credit: t.credit,
    debit: t.debit,
    categorie: t.categorie,
    projet_id: t.projet_id,
    projet_code: (t.projets as { code: string } | null)?.code,
  }));

  return { data: transactions, error: null };
}

export async function getArtisteProjets(artisteId: string): Promise<{
  data: Array<{
    id: string;
    projet_id: string;
    projet_nom: string;
    projet_code: string;
    role_projet: string;
  }> | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projet_artistes')
    .select('id, projet_id, role_projet, projets ( nom, code )')
    .eq('artiste_id', artisteId);

  if (error) {
    return { data: null, error: error.message };
  }

  const projets = (data || []).map((pa) => {
    const projet = pa.projets as { nom: string; code: string } | null;
    return {
      id: pa.id,
      projet_id: pa.projet_id,
      projet_nom: projet?.nom || '',
      projet_code: projet?.code || '',
      role_projet: pa.role_projet,
    };
  });

  return { data: projets, error: null };
}

export async function createArtiste(input: {
  nom: string;
  email?: string | null;
  telephone?: string | null;
  notes?: string | null;
  couleur?: string | null;
}): Promise<{ data: Artiste | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('artistes')
    .insert({
      nom: input.nom,
      email: input.email || null,
      telephone: input.telephone || null,
      notes: input.notes || null,
      couleur: input.couleur || null,
      actif: true,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Artiste, error: null };
}

export async function updateArtiste(
  id: string,
  updates: {
    nom?: string;
    email?: string | null;
    telephone?: string | null;
    notes?: string | null;
    couleur?: string | null;
    actif?: boolean;
  }
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('artistes')
    .update(updates)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
