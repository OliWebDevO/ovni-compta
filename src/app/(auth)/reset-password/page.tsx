'use client';

import { useState } from 'react';
import Image from 'next/image';
import { resetPassword } from '@/lib/auth/actions';
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
import { Lock, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await resetPassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <>
      {/* Logo / Titre */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 h-20 w-20 rounded-full overflow-hidden shadow-lg shadow-violet-200">
          <Image
            src="/logo-ovni.jpeg"
            alt="O.V.N.I Logo"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
          O.V.N.I
          <span className="ml-2 text-muted-foreground font-normal text-xl">
            Compta
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gestion comptable de l&apos;ASBL
        </p>
      </div>

      <Card className="border-violet-200 shadow-xl shadow-violet-100/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200">
            <Lock className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Nouveau mot de passe
          </CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe pour votre compte
          </CardDescription>
        </CardHeader>

        <form action={handleSubmit}>
          <CardContent className="grid gap-4 pt-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                autoFocus
                minLength={6}
                maxLength={72}
                className="border-gray-200 focus:border-violet-300 focus:ring-violet-200"
              />
              <p className="text-xs text-muted-foreground">Minimum 6 caractères.</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                minLength={6}
                maxLength={72}
                className="border-gray-200 focus:border-violet-300 focus:ring-violet-200"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300"
              size="lg"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Lock />}
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
