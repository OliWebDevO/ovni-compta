'use server';

import { createClient } from '@/lib/supabase/server';
import type { BilanAnnuel, BilanMensuel, TransactionWithRelations } from '@/types/database';
import { anneeSchema, validateInput } from '@/lib/schemas';

export async function getBilansAnnuels(): Promise<{
  data: BilanAnnuel[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bilans_annuels')
    .select('*')
    .order('annee', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as BilanAnnuel[], error: null };
}

export async function getBilansMensuels(annee: number): Promise<{
  data: BilanMensuel[] | null;
  error: string | null;
}> {
  // Validate year
  const anneeValidation = validateInput(anneeSchema, annee);
  if (!anneeValidation.success) {
    return { data: null, error: anneeValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bilans_mensuels')
    .select('*')
    .eq('annee', anneeValidation.data)
    .order('mois');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as BilanMensuel[], error: null };
}

export async function getBilansLast12Months(): Promise<{
  data: Array<{ annee: number; mois: number; total_credit: number; total_debit: number }> | null;
  error: string | null;
}> {
  const supabase = await createClient();

  // Calculer la plage des 12 derniers mois
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  // Mois de début (il y a 11 mois)
  let startYear = currentYear;
  let startMonth = currentMonth - 11;
  if (startMonth <= 0) {
    startMonth += 12;
    startYear -= 1;
  }

  // Récupérer les données pour les deux années potentielles
  const { data, error } = await supabase
    .from('bilans_mensuels')
    .select('annee, mois, total_credit, total_debit')
    .or(`annee.eq.${startYear},annee.eq.${currentYear}`)
    .order('annee')
    .order('mois');

  if (error) {
    return { data: null, error: error.message };
  }

  // Filtrer pour ne garder que les 12 derniers mois
  const filteredData = (data || []).filter((item) => {
    if (item.annee === startYear && item.mois >= startMonth) return true;
    if (item.annee === currentYear && item.mois <= currentMonth) return true;
    if (item.annee > startYear && item.annee < currentYear) return true;
    return false;
  });

  // Trier chronologiquement
  filteredData.sort((a, b) => {
    if (a.annee !== b.annee) return a.annee - b.annee;
    return a.mois - b.mois;
  });

  return { data: filteredData, error: null };
}

/**
 * Récupère les transactions pour le bilan (SANS les transferts internes)
 * Ces transactions sont destinées à l'export fiscal
 */
/**
 * Récupère les années disponibles et ajoute l'année courante si nécessaire.
 * Note: bilans_annuels est une View SQL calculée automatiquement à partir des transactions.
 * Si une année n'a pas de transactions, elle n'apparaîtra pas dans la view,
 * mais on l'ajoute quand même au dropdown pour permettre la sélection.
 */
export async function getAvailableYears(): Promise<{
  data: number[] | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const currentYear = new Date().getFullYear();

  const { data, error } = await supabase
    .from('bilans_annuels')
    .select('annee')
    .order('annee', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const years = (data || []).map((b) => b.annee);

  // Ajouter l'année courante si elle n'existe pas encore (pas de transactions pour cette année)
  if (!years.includes(currentYear)) {
    years.unshift(currentYear);
  }

  return { data: years, error: null };
}

export async function getBilanTransactions(): Promise<{
  data: TransactionWithRelations[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select('*, artistes ( nom, couleur ), projets ( code, nom )')
    .is('transfert_id', null) // Exclure les transferts internes (par ID)
    .neq('categorie', 'transfert_interne') // Exclure les transferts internes (par catégorie)
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
