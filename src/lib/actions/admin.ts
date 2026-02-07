'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { uuidSchema, roleSchema, validateInput } from '@/lib/schemas';

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

export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'editor' | 'viewer'
): Promise<{ error: string | null }> {
  // Validate inputs
  const userIdValidation = validateInput(uuidSchema, userId);
  if (!userIdValidation.success) return { error: userIdValidation.error };
  const roleValidation = validateInput(roleSchema, newRole);
  if (!roleValidation.success) return { error: roleValidation.error };

  const supabase = await createClient();

  // Vérifier que l'utilisateur actuel est admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Non authentifié' };
  }

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentUserProfile?.role !== 'admin') {
    return { error: 'Seuls les administrateurs peuvent modifier les rôles' };
  }

  // Empêcher un admin de changer son propre rôle
  if (userIdValidation.data === user.id) {
    return { error: 'Vous ne pouvez pas modifier votre propre rôle' };
  }

  // Mettre à jour le rôle
  const { error } = await supabase
    .from('profiles')
    .update({ role: roleValidation.data })
    .eq('id', userIdValidation.data);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

export async function deleteUser(userId: string): Promise<{ error: string | null }> {
  // Validate userId
  const userIdValidation = validateInput(uuidSchema, userId);
  if (!userIdValidation.success) return { error: userIdValidation.error };

  const supabase = await createClient();

  // Vérifier que l'utilisateur actuel est admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Non authentifié' };
  }

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentUserProfile?.role !== 'admin') {
    return { error: 'Seuls les administrateurs peuvent supprimer des utilisateurs' };
  }

  // Empêcher un admin de se supprimer lui-même
  if (userIdValidation.data === user.id) {
    return { error: 'Vous ne pouvez pas supprimer votre propre compte depuis cette interface' };
  }

  try {
    const adminClient = createAdminClient();

    // Supprimer l'utilisateur de Supabase Auth (cela supprimera aussi le profil via CASCADE ou trigger)
    const { error: authError } = await adminClient.auth.admin.deleteUser(userIdValidation.data);

    if (authError) {
      return { error: authError.message };
    }

    // Supprimer le profil manuellement au cas où il n'y aurait pas de CASCADE
    await supabase.from('profiles').delete().eq('id', userIdValidation.data);

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erreur lors de la suppression' };
  }
}
