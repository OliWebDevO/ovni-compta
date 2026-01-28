'use server';

import { createClient } from '@/lib/supabase/server';

export interface UserProfile {
  id: string;
  nom: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
}

export async function getUsers(): Promise<{
  data: UserProfile[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('id, nom, email, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as UserProfile[], error: null };
}

export interface AdminStats {
  totalUsers: number;
  totalArtistes: number;
  totalProjets: number;
  totalTransactions: number;
  totalCredit: number;
  totalDebit: number;
  solde: number;
  recentUsers: Array<{
    id: string;
    nom: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    created_at: string;
  }>;
}

export async function getAdminStats(): Promise<{
  data: AdminStats | null;
  error: string | null;
}> {
  const supabase = await createClient();

  // Exécuter toutes les requêtes en parallèle
  const [usersRes, artistesRes, projetsRes, transactionsRes, financesRes] =
    await Promise.all([
      supabase.from('profiles').select('id, nom, email, role, created_at').order('created_at', { ascending: false }),
      supabase.from('artistes').select('id', { count: 'exact', head: true }).eq('actif', true),
      supabase.from('projets').select('id', { count: 'exact', head: true }).eq('statut', 'actif'),
      supabase.from('transactions').select('id', { count: 'exact', head: true }),
      supabase.from('artistes_with_stats').select('total_credit, total_debit, solde'),
    ]);

  if (usersRes.error || artistesRes.error || projetsRes.error || transactionsRes.error || financesRes.error) {
    const firstError =
      usersRes.error || artistesRes.error || projetsRes.error || transactionsRes.error || financesRes.error;
    return { data: null, error: firstError!.message };
  }

  // Calculer les totaux financiers à partir des stats artistes
  const finances = financesRes.data || [];
  const totalCredit = finances.reduce((sum, a) => sum + (a.total_credit || 0), 0);
  const totalDebit = finances.reduce((sum, a) => sum + (a.total_debit || 0), 0);

  return {
    data: {
      totalUsers: usersRes.data?.length || 0,
      totalArtistes: artistesRes.count || 0,
      totalProjets: projetsRes.count || 0,
      totalTransactions: transactionsRes.count || 0,
      totalCredit,
      totalDebit,
      solde: totalCredit - totalDebit,
      recentUsers: (usersRes.data || []).map((u) => ({
        id: u.id,
        nom: u.nom,
        email: u.email,
        role: u.role,
        created_at: u.created_at,
      })),
    },
    error: null,
  };
}
