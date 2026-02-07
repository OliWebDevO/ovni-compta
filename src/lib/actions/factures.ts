'use server';

import { createClient } from '@/lib/supabase/server';
import type { TypeLiaison, FactureWithRelations } from '@/types/database';
import { createFactureSchema, typeLiaisonSchema, uuidSchema, validateInput } from '@/lib/schemas';
import { rateLimit } from '@/lib/rate-limit';

export async function getFactures(): Promise<{
  data: FactureWithRelations[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('factures')
    .select('*, artistes ( nom, couleur ), projets ( nom, code )')
    .order('date', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const factures: FactureWithRelations[] = (data || []).map((f) => ({
    id: f.id,
    date: f.date,
    description: f.description,
    type_liaison: f.type_liaison,
    artiste_id: f.artiste_id,
    projet_id: f.projet_id,
    fichier_nom: f.fichier_nom,
    fichier_path: f.fichier_path,
    fichier_size: f.fichier_size,
    created_by: f.created_by,
    created_at: f.created_at,
    updated_at: f.updated_at,
    artiste_nom: (f.artistes as { nom: string; couleur: string | null } | null)?.nom,
    artiste_couleur: (f.artistes as { nom: string; couleur: string | null } | null)?.couleur ?? undefined,
    projet_nom: (f.projets as { nom: string; code: string } | null)?.nom,
    projet_code: (f.projets as { nom: string; code: string } | null)?.code,
  }));

  return { data: factures, error: null };
}

export async function getFacturesByType(
  type: TypeLiaison,
  entityId?: string
): Promise<{
  data: FactureWithRelations[] | null;
  error: string | null;
}> {
  // Validate type
  const typeValidation = validateInput(typeLiaisonSchema, type);
  if (!typeValidation.success) {
    return { data: null, error: typeValidation.error };
  }

  // Validate entityId if provided
  if (entityId) {
    const idValidation = validateInput(uuidSchema, entityId);
    if (!idValidation.success) {
      return { data: null, error: idValidation.error };
    }
    entityId = idValidation.data;
  }

  const supabase = await createClient();

  let query = supabase
    .from('factures')
    .select('*, artistes ( nom, couleur ), projets ( nom, code )')
    .eq('type_liaison', typeValidation.data);

  if (typeValidation.data === 'artiste' && entityId) {
    query = query.eq('artiste_id', entityId);
  } else if (typeValidation.data === 'projet' && entityId) {
    query = query.eq('projet_id', entityId);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const factures: FactureWithRelations[] = (data || []).map((f) => ({
    id: f.id,
    date: f.date,
    description: f.description,
    type_liaison: f.type_liaison,
    artiste_id: f.artiste_id,
    projet_id: f.projet_id,
    fichier_nom: f.fichier_nom,
    fichier_path: f.fichier_path,
    fichier_size: f.fichier_size,
    created_by: f.created_by,
    created_at: f.created_at,
    updated_at: f.updated_at,
    artiste_nom: (f.artistes as { nom: string; couleur: string | null } | null)?.nom,
    artiste_couleur: (f.artistes as { nom: string; couleur: string | null } | null)?.couleur ?? undefined,
    projet_nom: (f.projets as { nom: string; code: string } | null)?.nom,
    projet_code: (f.projets as { nom: string; code: string } | null)?.code,
  }));

  return { data: factures, error: null };
}

export async function createFacture(input: {
  date: string;
  description: string;
  type_liaison: TypeLiaison;
  artiste_id: string | null;
  projet_id: string | null;
  fichier_nom: string;
  fichier_path: string;
  fichier_size: number | null;
}): Promise<{ data: { id: string } | null; error: string | null }> {
  // Validate input
  const validation = validateInput(createFactureSchema, input);
  if (!validation.success) {
    return { data: null, error: validation.error };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Rate limit per user
  const rl = rateLimit(`createFacture:${user?.id}`, 20, 60_000);
  if (!rl.allowed) return { data: null, error: rl.error };

  const { data, error } = await supabase
    .from('factures')
    .insert({
      date: validation.data.date,
      description: validation.data.description,
      type_liaison: validation.data.type_liaison,
      artiste_id: validation.data.artiste_id,
      projet_id: validation.data.projet_id,
      fichier_nom: validation.data.fichier_nom,
      fichier_path: validation.data.fichier_path,
      fichier_size: validation.data.fichier_size,
      created_by: user?.id || null,
    })
    .select('id')
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteFacture(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { success: false, error: idValidation.error };
  }

  const supabase = await createClient();

  // D'abord récupérer le fichier_path pour pouvoir supprimer le fichier du storage
  const { data: facture, error: fetchError } = await supabase
    .from('factures')
    .select('fichier_path')
    .eq('id', idValidation.data)
    .single();

  if (fetchError) {
    return { success: false, error: fetchError.message };
  }

  // Supprimer le fichier du storage
  if (facture?.fichier_path) {
    const { error: storageError } = await supabase.storage
      .from('factures')
      .remove([facture.fichier_path]);

    if (storageError) {
      console.error('Erreur lors de la suppression du fichier:', storageError);
      // On continue quand même pour supprimer l'entrée DB
    }
  }

  // Supprimer l'entrée de la base de données
  const { error } = await supabase
    .from('factures')
    .delete()
    .eq('id', idValidation.data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function getFactureDownloadUrl(id: string): Promise<{
  data: { url: string } | null;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { data: null, error: idValidation.error };
  }

  const supabase = await createClient();

  // Récupérer le fichier_path de la facture
  const { data: facture, error: fetchError } = await supabase
    .from('factures')
    .select('fichier_path, fichier_nom')
    .eq('id', idValidation.data)
    .single();

  if (fetchError || !facture) {
    return { data: null, error: fetchError?.message || 'Facture non trouvée' };
  }

  // Générer une URL signée valide pendant 1 heure
  const { data, error } = await supabase.storage
    .from('factures')
    .createSignedUrl(facture.fichier_path, 3600, {
      download: facture.fichier_nom,
    });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { url: data.signedUrl }, error: null };
}

export async function uploadFactureFile(formData: FormData): Promise<{
  data: { path: string; size: number } | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const file = formData.get('file') as File;
  if (!file) {
    return { data: null, error: 'Aucun fichier fourni' };
  }

  // Vérifier que c'est un PDF (MIME type + magic bytes)
  if (file.type !== 'application/pdf') {
    return { data: null, error: 'Seuls les fichiers PDF sont acceptés' };
  }

  // Validate PDF magic bytes (%PDF-)
  const headerBytes = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const pdfMagic = [0x25, 0x50, 0x44, 0x46, 0x2D]; // %PDF-
  const isValidPdf = pdfMagic.every((byte, i) => headerBytes[i] === byte);
  if (!isValidPdf) {
    return { data: null, error: 'Le fichier ne semble pas être un PDF valide' };
  }

  // Limit file size to 10MB
  if (file.size > 10 * 1024 * 1024) {
    return { data: null, error: 'Le fichier ne doit pas dépasser 10 Mo' };
  }

  // Générer un nom de fichier unique
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${timestamp}_${safeName}`;

  // Upload vers Supabase Storage
  const { error } = await supabase.storage
    .from('factures')
    .upload(filePath, file, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (error) {
    return { data: null, error: error.message };
  }

  return {
    data: {
      path: filePath,
      size: file.size,
    },
    error: null,
  };
}

export async function getFacturesStats(): Promise<{
  data: {
    total: number;
    byArtiste: number;
    byProjet: number;
    byAsbl: number;
  } | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('factures')
    .select('type_liaison');

  if (error) {
    return { data: null, error: error.message };
  }

  const stats = {
    total: data?.length || 0,
    byArtiste: data?.filter((f) => f.type_liaison === 'artiste').length || 0,
    byProjet: data?.filter((f) => f.type_liaison === 'projet').length || 0,
    byAsbl: data?.filter((f) => f.type_liaison === 'asbl').length || 0,
  };

  return { data: stats, error: null };
}
