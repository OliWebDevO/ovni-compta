'use server';

import { createClient } from '@/lib/supabase/server';
import type { Ressource, RessourceCategorie } from '@/types/database';
import { createRessourceSchema, updateRessourceSchema, ressourceCategorieSchema, uuidSchema, validateInput } from '@/lib/schemas';
import { rateLimit } from '@/lib/rate-limit';

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
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { data: null, error: idValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ressources')
    .select('*')
    .eq('id', idValidation.data)
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
  // Validate categorie
  const catValidation = validateInput(ressourceCategorieSchema, categorie);
  if (!catValidation.success) {
    return { data: null, error: catValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ressources')
    .select('*')
    .eq('categorie', catValidation.data)
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
  // Validate input
  const validation = validateInput(createRessourceSchema, input);
  if (!validation.success) {
    return { data: null, error: validation.error };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rate limit per user
  const rl = rateLimit(`createRessource:${user?.id}`, 10, 60_000);
  if (!rl.allowed) return { data: null, error: rl.error };

  const { data, error } = await supabase
    .from('ressources')
    .insert({
      titre: validation.data.titre,
      description: validation.data.description,
      contenu: validation.data.contenu || null,
      categorie: validation.data.categorie,
      url: validation.data.url || null,
      tags: validation.data.tags || [],
      icon: validation.data.icon || null,
      important: validation.data.important || false,
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
  // Validate ID and updates
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { success: false, error: idValidation.error };
  }

  const validation = validateInput(updateRessourceSchema, updates);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('ressources')
    .update(validation.data)
    .eq('id', idValidation.data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteRessource(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { success: false, error: idValidation.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('ressources')
    .delete()
    .eq('id', idValidation.data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
