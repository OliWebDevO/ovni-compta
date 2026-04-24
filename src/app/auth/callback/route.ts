import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next') ?? '/dashboard';

  // En prod derrière un reverse proxy (nginx/apache → Next.js), request.url peut
  // contenir l'origine interne (localhost). On préfère NEXT_PUBLIC_APP_URL qui
  // est l'URL publique connue. Fallback sur request.url pour le dev local.
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  // Empêche les open redirects : seules les routes internes sont autorisées
  const next =
    nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?message=auth_error`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?message=auth_error`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
