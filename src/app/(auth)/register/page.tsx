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
    <Card className="border-violet-200 shadow-xl shadow-violet-100/50">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200">
          <UserPlus className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Créer un compte
        </CardTitle>
        <CardDescription>
          Vous devez avoir reçu une invitation pour créer votre compte.
        </CardDescription>
      </CardHeader>

      <form action={handleSubmit}>
        <CardContent className="grid gap-4 pt-4">
          {/* Erreur */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
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
              className="border-gray-200 focus:border-violet-300 focus:ring-violet-200"
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
              className={emailFromInvite ? 'bg-violet-50 border-violet-200' : 'border-gray-200 focus:border-violet-300 focus:ring-violet-200'}
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
              className="border-gray-200 focus:border-violet-300 focus:ring-violet-200"
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

        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <UserPlus />
            )}
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </Button>

          <p className="text-center text-sm text-muted-foreground pt-2">
            Déjà un compte ?{' '}
            <Link
              href="/login"
              className="font-medium text-violet-600 underline-offset-4 hover:underline hover:text-violet-700"
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
