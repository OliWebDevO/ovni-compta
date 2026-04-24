'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { forgotPassword } from '@/lib/auth/actions';
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
import { KeyRound, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const result = await forgotPassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
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
            <KeyRound className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Mot de passe oublié
          </CardTitle>
          <CardDescription>
            {submitted
              ? 'Vérifiez votre boîte mail'
              : 'Entrez votre email pour recevoir un lien de réinitialisation'}
          </CardDescription>
        </CardHeader>

        {submitted ? (
          <>
            <CardContent className="grid gap-4 pt-4">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 flex gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                  Si un compte existe avec cet email, un lien de réinitialisation vient
                  d&apos;être envoyé. Vérifiez votre boîte de réception (et vos spams).
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Link href="/login" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  size="lg"
                >
                  <ArrowLeft />
                  Retour à la connexion
                </Button>
              </Link>
            </CardFooter>
          </>
        ) : (
          <form action={handleSubmit}>
            <CardContent className="grid gap-4 pt-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  required
                  autoComplete="email"
                  autoFocus
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
                {loading ? <Loader2 className="animate-spin" /> : <KeyRound />}
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </Button>

              <Link
                href="/login"
                className="text-center text-sm text-violet-600 hover:text-violet-700 font-medium hover:underline underline-offset-4 inline-flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la connexion
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </>
  );
}
