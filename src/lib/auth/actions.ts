'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { loginSchema, signupSchema, validateInput } from '@/lib/schemas';

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
