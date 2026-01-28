'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signup } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { UserPlus, Loader2 } from 'lucide-react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const emailFromInvite = searchParams.get('email') || '';

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [couleur, setCouleur] = useState('#4DABF7');

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    // Ajouter la couleur au formData (le ColorPicker ne fait pas partie d'un input natif)
    formData.set('couleur', couleur);

    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Créer un compte</CardTitle>
        <CardDescription>
          Vous devez avoir reçu une invitation pour créer votre compte.
        </CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="grid gap-4">
          {/* Erreur */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="nom">Nom / Pseudo</Label>
            <Input
              id="nom"
              name="nom"
              type="text"
              placeholder="Votre nom ou pseudo"
              required
              autoComplete="name"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              required
              autoComplete="email"
              defaultValue={emailFromInvite}
              readOnly={!!emailFromInvite}
              className={emailFromInvite ? 'bg-muted' : ''}
            />
            <p className="text-xs text-muted-foreground">
              {emailFromInvite
                ? 'Email pré-rempli depuis votre invitation.'
                : "Utilisez l'email qui a reçu l'invitation."}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 6 caractères.
            </p>
          </div>

          {/* Sélection de couleur */}
          <ColorPicker
            value={couleur}
            onChange={setCouleur}
            label="Votre couleur"
          />
          <p className="-mt-2 text-xs text-muted-foreground">
            Cette couleur sera associée à votre profil dans l&apos;application.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <UserPlus />
            )}
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
