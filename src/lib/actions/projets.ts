'use server';

import { createClient } from '@/lib/supabase/server';
import type { ProjetWithStats, Projet } from '@/types/database';
import {
  createProjetSchema,
  updateProjetSchema,
  uuidSchema,
  validateInput,
} from '@/lib/schemas';

export async function getProjets(): Promise<{
  data: ProjetWithStats[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projets_with_stats')
    .select('*')
    .order('nom');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as ProjetWithStats[], error: null };
}

export async function getProjetById(id: string): Promise<{
  data: ProjetWithStats | null;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { data: null, error: idValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projets_with_stats')
    .select('*')
    .eq('id', idValidation.data)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as ProjetWithStats, error: null };
}

export async function getProjetTransactions(projetId: string): Promise<{
  data: Array<{
    id: string;
    date: string;
    description: string;
    credit: number;
    debit: number;
    categorie: string | null;
    artiste_id: string | null;
    artiste_nom?: string;
  }> | null;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, projetId);
  if (!idValidation.success) {
    return { data: null, error: idValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('id, date, description, credit, debit, categorie, artiste_id, artistes ( nom )')
    .eq('projet_id', idValidation.data)
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
    artiste_id: t.artiste_id,
    artiste_nom: (t.artistes as { nom: string } | null)?.nom,
  }));

  return { data: transactions, error: null };
}

export async function getProjetArtistes(projetId: string): Promise<{
  data: Array<{
    id: string;
    artiste_id: string;
    artiste_nom: string;
    artiste_couleur: string | null;
    role_projet: string;
  }> | null;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, projetId);
  if (!idValidation.success) {
    return { data: null, error: idValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projet_artistes')
    .select('id, artiste_id, role_projet, artistes ( nom, couleur )')
    .eq('projet_id', idValidation.data);

  if (error) {
    return { data: null, error: error.message };
  }

  const artistes = (data || []).map((pa) => {
    const artiste = pa.artistes as { nom: string; couleur: string | null } | null;
    return {
      id: pa.id,
      artiste_id: pa.artiste_id,
      artiste_nom: artiste?.nom || '',
      artiste_couleur: artiste?.couleur || null,
      role_projet: pa.role_projet,
    };
  });

  return { data: artistes, error: null };
}

export async function createProjet(input: {
  nom: string;
  code: string;
  description?: string | null;
  budget?: number | null;
  date_debut?: string | null;
  date_fin?: string | null;
}): Promise<{ data: Projet | null; error: string | null }> {
  // Validate input
  const validation = validateInput(createProjetSchema, input);
  if (!validation.success) {
    return { data: null, error: validation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projets')
    .insert({
      nom: validation.data.nom,
      code: validation.data.code,
      description: validation.data.description || null,
      budget: validation.data.budget || null,
      date_debut: validation.data.date_debut || null,
      date_fin: validation.data.date_fin || null,
      statut: 'actif',
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Projet, error: null };
}

export async function updateProjet(
  id: string,
  updates: {
    nom?: string;
    code?: string;
    description?: string | null;
    budget?: number | null;
    date_debut?: string | null;
    date_fin?: string | null;
    statut?: 'actif' | 'termine' | 'annule';
  }
): Promise<{ success: boolean; error: string | null }> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { success: false, error: idValidation.error };
  }

  // Validate updates
  const validation = validateInput(updateProjetSchema, updates);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('projets')
    .update(validation.data)
    .eq('id', idValidation.data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteProjet(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { success: false, error: idValidation.error };
  }

  const supabase = await createClient();

  // Vérifier que l'utilisateur est admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifié.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { success: false, error: 'Seuls les administrateurs peuvent supprimer un projet.' };
  }

  // Supprimer le projet (les transactions et associations seront supprimées par CASCADE)
  const { error } = await supabase
    .from('projets')
    .delete()
    .eq('id', idValidation.data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
