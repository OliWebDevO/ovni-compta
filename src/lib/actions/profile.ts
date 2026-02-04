'use server';

import { createClient } from '@/lib/supabase/server';
import { updateProfileSchema, validateInput } from '@/lib/schemas';

export interface CurrentUser {
  id: string;
  email: string;
  nom: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar: string | null;
  artiste_id: string | null;
  couleur: string;
  artiste_nom?: string;
  artiste_couleur?: string;
}

export async function getCurrentUser(): Promise<{
  data: CurrentUser | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Non authentifié.' };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, artistes ( nom, couleur )')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return { data: null, error: error?.message || 'Profil introuvable.' };
  }

  const artiste = profile.artistes as { nom: string; couleur: string | null } | null;

  return {
    data: {
      id: profile.id,
      email: profile.email,
      nom: profile.nom,
      role: profile.role,
      avatar: profile.avatar,
      artiste_id: profile.artiste_id,
      couleur: profile.couleur,
      artiste_nom: artiste?.nom,
      artiste_couleur: artiste?.couleur ?? undefined,
    },
    error: null,
  };
}

export async function updateProfile(updates: {
  nom?: string;
  couleur?: string;
  avatar?: string | null;
}): Promise<{ success: boolean; error: string | null }> {
  // Validate input
  const validation = validateInput(updateProfileSchema, updates);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Non authentifié.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update(validation.data)
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
