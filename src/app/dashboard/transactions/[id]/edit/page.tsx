'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Pencil, Loader2 } from 'lucide-react';
import { getTransaction, updateTransaction } from '@/lib/actions/transactions';
import { getArtistes } from '@/lib/actions/artistes';
import { getProjets } from '@/lib/actions/projets';
import type { ArtisteWithStats, ProjetWithStats, TransactionCategorie } from '@/types/database';
import { CATEGORIES } from '@/types';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';

export default function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard/transactions';
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artistes, setArtistes] = useState<ArtisteWithStats[]>([]);
  const [projets, setProjets] = useState<ProjetWithStats[]>([]);

  // Form state
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCredit, setFormCredit] = useState('');
  const [formDebit, setFormDebit] = useState('');
  const [formArtisteId, setFormArtisteId] = useState<string>('');
  const [formProjetId, setFormProjetId] = useState<string>('');
  const [formCategorie, setFormCategorie] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const [txRes, artistesRes, projetsRes] = await Promise.all([
        getTransaction(id),
        getArtistes(),
        getProjets(),
      ]);

      if (txRes.error || !txRes.data) {
        toast.error('Transaction introuvable');
        router.push('/dashboard/transactions');
        return;
      }

      const tx = txRes.data;
      setFormDate(tx.date);
      setFormDescription(tx.description);
      setFormCredit(tx.credit > 0 ? tx.credit.toString() : '');
      setFormDebit(tx.debit > 0 ? tx.debit.toString() : '');
      setFormArtisteId(tx.artiste_id || '');
      setFormProjetId(tx.projet_id || '');
      setFormCategorie(tx.categorie || '');

      if (artistesRes.data) setArtistes(artistesRes.data);
      if (projetsRes.data) setProjets(projetsRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formDescription.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    const credit = parseFloat(formCredit) || 0;
    const debit = parseFloat(formDebit) || 0;

    if (credit === 0 && debit === 0) {
      toast.error('Veuillez entrer un montant (credit ou debit)');
      return;
    }

    if (credit > 0 && debit > 0) {
      toast.error('Une transaction ne peut pas avoir un credit ET un debit');
      return;
    }

    setIsSubmitting(true);

    const { success, error } = await updateTransaction(id, {
      date: formDate,
      description: formDescription.trim(),
      credit,
      debit,
      artiste_id: formArtisteId || null,
      projet_id: formProjetId || null,
      categorie: (formCategorie as TransactionCategorie) || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }

    toast.success('Transaction modifiee avec succes');
    router.push(returnUrl);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Modifier la transaction"
        description="Mettre a jour les informations de la transaction"
        gradient="from-emerald-500 via-teal-500 to-cyan-500"
        icon={<Pencil className="h-7 w-7 text-white" />}
      >
        <Button
          variant="outline"
          asChild
          className="w-full sm:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <Link href={returnUrl}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </PageHeader>

      {/* Form Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Details de la transaction</CardTitle>
          <CardDescription>
            Modifiez les informations de la transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Description de la transaction"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="credit">Credit (EUR)</Label>
                  <Input
                    id="credit"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formCredit}
                    onChange={(e) => setFormCredit(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="debit">Debit (EUR)</Label>
                  <Input
                    id="debit"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formDebit}
                    onChange={(e) => setFormDebit(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="artiste">Artiste (optionnel)</Label>
                <Select value={formArtisteId || '__none__'} onValueChange={(val) => setFormArtisteId(val === '__none__' ? '' : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner un artiste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Aucun</SelectItem>
                    {artistes.map((artiste) => (
                      <SelectItem key={artiste.id} value={artiste.id}>
                        {artiste.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="projet">Projet (optionnel)</Label>
                <Select value={formProjetId || '__none__'} onValueChange={(val) => setFormProjetId(val === '__none__' ? '' : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Aucun</SelectItem>
                    {projets.map((projet) => (
                      <SelectItem key={projet.id} value={projet.id}>
                        {projet.nom} ({projet.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="categorie">Categorie</Label>
                <Select value={formCategorie || '__none__'} onValueChange={(val) => setFormCategorie(val === '__none__' ? '' : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner une categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Aucune</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(returnUrl)}
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
