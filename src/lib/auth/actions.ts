'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { resend, EMAIL_FROM } from '@/lib/email/resend';
import { rateLimit } from '@/lib/rate-limit';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  validateInput,
} from '@/lib/schemas';

export async function login(formData: FormData) {
  const rawInput = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Validate input
  const validation = validateInput(loginSchema, rawInput);
  if (!validation.success) {
    return { error: validation.error };
  }

  // Rate limit login attempts per email (5 per minute)
  const rl = rateLimit(`login:${validation.data.email.toLowerCase()}`, 5, 60_000);
  if (!rl.allowed) {
    return { error: 'Trop de tentatives de connexion. Veuillez réessayer dans quelques instants.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const rawInput = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    nom: formData.get('nom') as string,
    couleur: (formData.get('couleur') as string) || '#888888',
  };

  // Validate input
  const validation = validateInput(signupSchema, rawInput);
  if (!validation.success) {
    return { error: validation.error };
  }

  // Rate limit signup attempts (3 per minute)
  const rl = rateLimit(`signup:${validation.data.email.toLowerCase()}`, 3, 60_000);
  if (!rl.allowed) {
    return { error: 'Trop de tentatives. Veuillez réessayer dans quelques instants.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        nom: validation.data.nom,
        couleur: validation.data.couleur,
      },
    },
  });

  if (error) {
    // Message plus clair pour les erreurs courantes
    if (error.message.includes('non autorisée') || error.message.includes('not allowed')) {
      return {
        error: 'Inscription non autorisée. Vous devez avoir reçu une invitation pour créer un compte.',
      };
    }
    return { error: error.message };
  }

  // Redirection vers une page de confirmation avec un code prédéfini
  redirect('/login?message=signup_success');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function forgotPassword(formData: FormData) {
  const rawInput = {
    email: formData.get('email') as string,
  };

  const validation = validateInput(forgotPasswordSchema, rawInput);
  if (!validation.success) {
    return { error: validation.error };
  }

  // 3 tentatives par minute par email — protège contre l'envoi en masse
  const rl = rateLimit(`forgot:${validation.data.email.toLowerCase()}`, 3, 60_000);
  if (!rl.allowed) {
    return { error: 'Trop de tentatives. Veuillez réessayer dans quelques instants.' };
  }

  const adminClient = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // generateLink + Resend : même flow que le reset admin, template unifié.
  // Si l'email n'existe pas, generateLink échoue silencieusement
  // → on retourne toujours success (anti-énumération).
  try {
    const { data: linkData, error: linkError } =
      await adminClient.auth.admin.generateLink({
        type: 'recovery',
        email: validation.data.email,
        options: {
          redirectTo: `${appUrl}/reset-password`,
        },
      });

    if (!linkError && linkData?.properties?.action_link) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: validation.data.email,
        subject: 'Réinitialisation de votre mot de passe – O.V.N.I',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 16px;">
            <h2 style="color: #7c3aed; margin-bottom: 16px;">Réinitialisation de mot de passe</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe&nbsp;:</p>
            <p style="margin: 32px 0;">
              <a href="${linkData.properties.action_link}"
                 style="background: #7c3aed; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                Réinitialiser mon mot de passe
              </a>
            </p>
            <p style="color: #888; font-size: 13px;">Si vous n&rsquo;êtes pas à l&rsquo;origine de cette demande, ignorez cet email.</p>
            <p style="color: #888; font-size: 13px;">Ce lien expire dans 24&nbsp;heures.</p>
          </div>
        `,
      });
    }
  } catch {
    // Silencieux : anti-énumération
  }

  // Réponse identique que l'email existe ou non (anti-énumération)
  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const rawInput = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const validation = validateInput(resetPasswordSchema, rawInput);
  if (!validation.success) {
    return { error: validation.error };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error:
        'Session invalide ou expirée. Veuillez recommencer la procédure depuis l\'email reçu.',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Déconnexion forcée pour que l'utilisateur se reconnecte avec son nouveau mot de passe
  await supabase.auth.signOut();
  redirect('/login?message=password_updated');
}
