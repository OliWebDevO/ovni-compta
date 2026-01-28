'use server';

import { createClient } from '@/lib/supabase/server';
import type { Ressource, RessourceCategorie } from '@/types/database';

export async function getRessources(): Promise<{
  data: Ressource[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ressources')
    .select('*')
    .order('categorie')
    .order('important', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Ressource[], error: null };
}

export async function getRessourceById(id: string): Promise<{
  data: Ressource | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ressources')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Ressource, error: null };
}

export async function getRessourcesByCategorie(categorie: RessourceCategorie): Promise<{
  data: Ressource[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ressources')
    .select('*')
    .eq('categorie', categorie)
    .order('important', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Ressource[], error: null };
}

export async function createRessource(input: {
  titre: string;
  description: string;
  contenu?: string | null;
  categorie: RessourceCategorie;
  url?: string | null;
  tags?: string[];
  icon?: string | null;
  important?: boolean;
}): Promise<{ data: Ressource | null; error: string | null }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ressources')
    .insert({
      titre: input.titre,
      description: input.description,
      contenu: input.contenu || null,
      categorie: input.categorie,
      url: input.url || null,
      tags: input.tags || [],
      icon: input.icon || null,
      important: input.important || false,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Ressource, error: null };
}

export async function updateRessource(
  id: string,
  updates: {
    titre?: string;
    description?: string;
    contenu?: string | null;
    categorie?: RessourceCategorie;
    url?: string | null;
    tags?: string[];
    icon?: string | null;
    important?: boolean;
  }
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('ressources')
    .update(updates)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteRessource(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('ressources')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
