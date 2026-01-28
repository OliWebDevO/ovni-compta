'use server';

import { createClient } from '@/lib/supabase/server';
import type { BilanAnnuel, BilanMensuel } from '@/types/database';

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bilans_mensuels')
    .select('*')
    .eq('annee', annee)
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
