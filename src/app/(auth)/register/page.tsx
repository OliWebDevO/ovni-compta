'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { signup } from '@/lib/auth/actions';
import { getInvitationByCode } from '@/lib/invitations/actions';
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
import { UserPlus, Loader2, Key, CheckCircle2, ArrowRight } from 'lucide-react';

function CodeStep({
  onSuccess,
}: {
  onSuccess: (email: string, artisteNom: string | null) => void;
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await getInvitationByCode(code);

    if (result.error || !result.data) {
      setError(result.error || 'Code invalide.');
      setLoading(false);
      return;
    }

    onSuccess(result.data.email, result.data.artiste_nom);
  }

  return (
    <Card className="border-violet-200 shadow-xl shadow-violet-100/50">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200">
          <Key className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Code d&apos;invitation
        </CardTitle>
        <CardDescription>
          Entrez le code à 6 caractères que vous avez reçu.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4 pt-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="code">Code d&apos;activation</Label>
            <Input
              id="code"
              type="text"
              placeholder="AB3K9X"
              required
              autoFocus
              autoComplete="off"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="text-center text-2xl font-mono tracking-widest border-gray-200 focus:border-violet-300 focus:ring-violet-200"
            />
            <p className="text-xs text-muted-foreground text-center">
              Ce code vous a été envoyé par un administrateur.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-6">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:shadow-violet-300"
            size="lg"
            disabled={loading || code.length < 6}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ArrowRight />
            )}
            {loading ? 'Vérification...' : 'Continuer'}
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

function RegisterStep({
  email,
  artisteNom,
  onBack,
}: {
  email: string;
  artisteNom: string | null;
  onBack: () => void;
}) {
  const [nom, setNom] = useState(artisteNom || '');
  const [password, setPassword] = useState('');
  const [couleur, setCouleur] = useState('#4DABF7');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set('nom', nom);
    formData.set('email', email);
    formData.set('password', password);
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
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-200">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Créer votre compte
        </CardTitle>
        <CardDescription>
          Code validé ! Complétez votre inscription.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4 pt-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="nom">Nom / Pseudo</Label>
            <Input
              id="nom"
              type="text"
              placeholder="Votre nom ou pseudo"
              required
              autoComplete="off"
              autoFocus={!artisteNom}
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={artisteNom
                ? "border-violet-200 bg-violet-50 focus:border-violet-300 focus:ring-violet-200"
                : "border-gray-200 focus:border-violet-300 focus:ring-violet-200"
              }
            />
            {artisteNom && (
              <p className="text-xs text-violet-600">
                Pré-rempli avec le nom de l&apos;artiste associé.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              className="bg-violet-50 border-violet-200"
            />
            <p className="text-xs text-muted-foreground">
              Email associé à votre invitation.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-200 focus:border-violet-300 focus:ring-violet-200"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 6 caractères.
            </p>
          </div>

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

          <Button
            type="button"
            variant="ghost"
            className="text-muted-foreground"
            onClick={onBack}
          >
            ← Utiliser un autre code
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function RegisterForm() {
  const [step, setStep] = useState<'code' | 'register'>('code');
  const [email, setEmail] = useState('');
  const [artisteNom, setArtisteNom] = useState<string | null>(null);

  if (step === 'code') {
    return (
      <CodeStep
        key="code-step"
        onSuccess={(validatedEmail, validatedArtisteNom) => {
          setEmail(validatedEmail);
          setArtisteNom(validatedArtisteNom);
          setStep('register');
        }}
      />
    );
  }

  return (
    <RegisterStep
      key="register-step"
      email={email}
      artisteNom={artisteNom}
      onBack={() => {
        setStep('code');
        setEmail('');
        setArtisteNom(null);
      }}
    />
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
