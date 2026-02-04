'use server';

import { createClient } from '@/lib/supabase/server';
import {
  createInvitationSchema,
  invitationCodeSchema,
  uuidSchema,
  validateInput,
} from '@/lib/schemas';

// =============================================
// Types
// =============================================

export interface Invitation {
  id: string;
  email: string;
  code: string;
  role: 'admin' | 'editor' | 'viewer';
  artiste_id: string | null;
  artiste_nom?: string;
  can_create_artiste: boolean;
  used: boolean;
  used_at: string | null;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
  invited_by_nom?: string;
}

export interface CreateInvitationInput {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  artiste_id: string | null;
  can_create_artiste: boolean;
  notes: string | null;
}

export interface CreateInvitationResult {
  success: boolean;
  code: string | null;
  message: string | null;
  error: string | null;
}

interface ArtisteOption {
  id: string;
  nom: string;
  couleur: string | null;
  actif: boolean;
}

// =============================================
// Constants for timing attack prevention
// =============================================

const MIN_RESPONSE_TIME_MS = 200;

// =============================================
// Helpers
// =============================================

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans I, O, 0, 1 pour éviter confusion
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function buildInvitationMessage(code: string, registerUrl: string): string {
  return `Bonjour,

Vous êtes invité(e) à rejoindre la plateforme de gestion comptable de l'ASBL O.V.N.I.

Votre code d'activation : ${code}

Pour créer votre compte, rendez-vous sur :
${registerUrl}

À bientôt !`;
}

/**
 * Adds a constant delay to prevent timing attacks
 */
async function ensureMinResponseTime(startTime: number): Promise<void> {
  const elapsed = Date.now() - startTime;
  if (elapsed < MIN_RESPONSE_TIME_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_RESPONSE_TIME_MS - elapsed));
  }
}

// =============================================
// Actions
// =============================================

export async function getInvitations(): Promise<{
  data: Invitation[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('allowed_emails')
    .select(`
      *,
      artistes ( nom ),
      profiles!allowed_emails_invited_by_fkey ( nom )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  const invitations: Invitation[] = (data || []).map((row) => ({
    id: row.id,
    email: row.email,
    code: row.code,
    role: row.role,
    artiste_id: row.artiste_id,
    artiste_nom: (row.artistes as { nom: string } | null)?.nom,
    can_create_artiste: row.can_create_artiste,
    used: row.used,
    used_at: row.used_at,
    expires_at: row.expires_at,
    notes: row.notes,
    created_at: row.created_at,
    invited_by_nom: (row.profiles as { nom: string } | null)?.nom,
  }));

  return { data: invitations, error: null };
}

export async function getArtistes(): Promise<{
  data: ArtisteOption[] | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('artistes')
    .select('id, nom, couleur, actif')
    .eq('actif', true)
    .order('nom');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as ArtisteOption[], error: null };
}

export async function createInvitation(input: CreateInvitationInput): Promise<CreateInvitationResult> {
  // Validate input
  const validation = validateInput(createInvitationSchema, input);
  if (!validation.success) {
    return { success: false, code: null, message: null, error: validation.error };
  }

  const supabase = await createClient();

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, code: null, message: null, error: 'Non authentifié.' };
  }

  // Générer un code unique
  let code = generateCode();
  let attempts = 0;
  const maxAttempts = 10;

  // S'assurer que le code est unique
  while (attempts < maxAttempts) {
    const { data: existing } = await supabase
      .from('allowed_emails')
      .select('id')
      .eq('code', code)
      .single();

    if (!existing) break;
    code = generateCode();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    return { success: false, code: null, message: null, error: 'Impossible de générer un code unique.' };
  }

  // Insérer l'invitation en base
  const { error: insertError } = await supabase
    .from('allowed_emails')
    .insert({
      email: validation.data.email,
      code,
      role: validation.data.role,
      artiste_id: validation.data.artiste_id,
      can_create_artiste: validation.data.can_create_artiste,
      invited_by: user.id,
      notes: validation.data.notes,
    });

  if (insertError) {
    if (insertError.code === '23505') {
      return {
        success: false,
        code: null,
        message: null,
        error: 'Cet email a déjà une invitation en cours.',
      };
    }
    return { success: false, code: null, message: null, error: insertError.message };
  }

  // Construire l'URL d'inscription et le message
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const registerUrl = `${appUrl}/register`;
  const message = buildInvitationMessage(code, registerUrl);

  return { success: true, code, message, error: null };
}

export async function deleteInvitation(id: string): Promise<{
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
    .from('allowed_emails')
    .delete()
    .eq('id', idValidation.data)
    .eq('used', false);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function getInvitationByCode(code: string): Promise<{
  data: {
    email: string;
    artiste_id: string | null;
    artiste_nom: string | null;
    can_create_artiste: boolean;
  } | null;
  error: string | null;
}> {
  const startTime = Date.now();

  // Validate and normalize code
  const codeValidation = validateInput(invitationCodeSchema, code);
  if (!codeValidation.success) {
    await ensureMinResponseTime(startTime);
    // Generic error message to prevent enumeration
    return { data: null, error: 'Code d\'invitation invalide.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('allowed_emails')
    .select('email, artiste_id, can_create_artiste, artistes ( nom )')
    .eq('code', codeValidation.data)
    .eq('used', false)
    .single();

  // Always wait minimum time to prevent timing attacks
  await ensureMinResponseTime(startTime);

  // Generic error message for both "not found" and "already used"
  if (error || !data) {
    return { data: null, error: 'Code d\'invitation invalide.' };
  }

  return {
    data: {
      email: data.email,
      artiste_id: data.artiste_id,
      artiste_nom: (data.artistes as { nom: string } | null)?.nom || null,
      can_create_artiste: data.can_create_artiste,
    },
    error: null,
  };
}

export async function getInvitationMessage(id: string): Promise<{
  code: string | null;
  message: string | null;
  error: string | null;
}> {
  // Validate ID
  const idValidation = validateInput(uuidSchema, id);
  if (!idValidation.success) {
    return { code: null, message: null, error: idValidation.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('allowed_emails')
    .select('code')
    .eq('id', idValidation.data)
    .single();

  if (error || !data) {
    return { code: null, message: null, error: 'Invitation introuvable.' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const registerUrl = `${appUrl}/register`;
  const message = buildInvitationMessage(data.code, registerUrl);

  return { code: data.code, message, error: null };
}
