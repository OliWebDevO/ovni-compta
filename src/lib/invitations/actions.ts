'use server';

import { createClient } from '@/lib/supabase/server';
import { resend, EMAIL_FROM } from '@/lib/email/resend';
import { buildInvitationEmail } from '@/lib/email/templates/invitation';

// =============================================
// Types
// =============================================

export interface Invitation {
  id: string;
  email: string;
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
  inviteType: 'existing' | 'new' | 'viewer';
}

interface ArtisteOption {
  id: string;
  nom: string;
  couleur: string | null;
  actif: boolean;
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

  // Aplatir les jointures
  const invitations: Invitation[] = (data || []).map((row) => ({
    id: row.id,
    email: row.email,
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

export async function createInvitation(input: CreateInvitationInput): Promise<{
  success: boolean;
  emailSent: boolean;
  error: string | null;
}> {
  const supabase = await createClient();

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, emailSent: false, error: 'Non authentifié.' };
  }

  // Insérer l'invitation en base
  const { data: invitation, error: insertError } = await supabase
    .from('allowed_emails')
    .insert({
      email: input.email,
      role: input.role,
      artiste_id: input.artiste_id,
      can_create_artiste: input.can_create_artiste,
      invited_by: user.id,
      notes: input.notes,
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      return {
        success: false,
        emailSent: false,
        error: 'Cet email a déjà une invitation en cours.',
      };
    }
    return { success: false, emailSent: false, error: insertError.message };
  }

  // Récupérer le nom de l'artiste si applicable
  let artisteName: string | undefined;
  if (input.artiste_id) {
    const { data: artiste } = await supabase
      .from('artistes')
      .select('nom')
      .eq('id', input.artiste_id)
      .single();
    artisteName = artiste?.nom;
  }

  // Construire l'URL d'inscription
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const registerUrl = `${appUrl}/register?email=${encodeURIComponent(input.email)}`;

  // Envoyer l'email
  try {
    const { error: emailError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.email,
      subject: 'Invitation - O.V.N.I Compta',
      html: buildInvitationEmail({
        inviteType: input.inviteType,
        artisteName,
        role: input.role,
        registerUrl,
        notes: input.notes,
      }),
    });

    if (emailError) {
      console.error('Erreur envoi email Resend:', emailError);
      return { success: true, emailSent: false, error: null };
    }

    return { success: true, emailSent: true, error: null };
  } catch (err) {
    console.error('Erreur envoi email:', err);
    return { success: true, emailSent: false, error: null };
  }
}

export async function deleteInvitation(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('allowed_emails')
    .delete()
    .eq('id', id)
    .eq('used', false);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function resendInvitationEmail(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const supabase = await createClient();

  // Récupérer l'invitation avec l'artiste associé
  const { data: invitation, error: fetchError } = await supabase
    .from('allowed_emails')
    .select('*, artistes ( nom )')
    .eq('id', id)
    .single();

  if (fetchError || !invitation) {
    return { success: false, error: 'Invitation introuvable.' };
  }

  if (invitation.used) {
    return { success: false, error: 'Cette invitation a déjà été utilisée.' };
  }

  // Déterminer le type d'invitation
  let inviteType: 'existing' | 'new' | 'viewer';
  if (invitation.artiste_id) {
    inviteType = 'existing';
  } else if (invitation.can_create_artiste) {
    inviteType = 'new';
  } else {
    inviteType = 'viewer';
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const registerUrl = `${appUrl}/register?email=${encodeURIComponent(invitation.email)}`;

  try {
    const { error: emailError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: invitation.email,
      subject: 'Rappel - Invitation O.V.N.I Compta',
      html: buildInvitationEmail({
        inviteType,
        artisteName: (invitation.artistes as { nom: string } | null)?.nom,
        role: invitation.role,
        registerUrl,
        notes: invitation.notes,
      }),
    });

    if (emailError) {
      console.error('Erreur renvoi email Resend:', emailError);
      return { success: false, error: "L'email n'a pas pu être envoyé." };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Erreur renvoi email:', err);
    return { success: false, error: "L'email n'a pas pu être envoyé." };
  }
}
