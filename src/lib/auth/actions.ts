'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nom = formData.get('nom') as string;
  const couleur = formData.get('couleur') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nom,
        couleur: couleur || '#888888',
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

  // Redirection vers une page de confirmation
  redirect('/login?message=Vérifiez votre email pour confirmer votre inscription.');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
