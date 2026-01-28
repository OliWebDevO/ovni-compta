'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft, Receipt, Loader2 } from 'lucide-react';
import { createTransaction } from '@/lib/actions/transactions';
import { getArtistes } from '@/lib/actions/artistes';
import { getProjets } from '@/lib/actions/projets';
import type { ArtisteWithStats, ProjetWithStats, TransactionCategorie } from '@/types/database';
import { CATEGORIES } from '@/types';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';

export default function NewTransactionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artistes, setArtistes] = useState<ArtisteWithStats[]>([]);
  const [projets, setProjets] = useState<ProjetWithStats[]>([]);

  // Form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formCredit, setFormCredit] = useState('');
  const [formDebit, setFormDebit] = useState('');
  const [formArtisteId, setFormArtisteId] = useState<string>('');
  const [formProjetId, setFormProjetId] = useState<string>('');
  const [formCategorie, setFormCategorie] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const [artistesRes, projetsRes] = await Promise.all([
        getArtistes(),
        getProjets(),
      ]);

      if (artistesRes.data) setArtistes(artistesRes.data);
      if (projetsRes.data) setProjets(projetsRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

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
      toast.error('Veuillez entrer un montant (crédit ou débit)');
      return;
    }

    if (credit > 0 && debit > 0) {
      toast.error('Une transaction ne peut pas avoir un crédit ET un débit');
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await createTransaction({
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

    toast.success('Transaction créée avec succès');
    router.push('/dashboard/transactions');
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
        title="Nouvelle transaction"
        description="Ajouter une nouvelle entrée ou sortie comptable"
        gradient="from-emerald-500 via-teal-500 to-cyan-500"
        icon={<Receipt className="h-7 w-7 text-white" />}
      >
        <Button
          variant="outline"
          asChild
          className="w-full sm:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <Link href="/dashboard/transactions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </PageHeader>

      {/* Form Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Détails de la transaction</CardTitle>
          <CardDescription>
            Remplissez les informations de la transaction
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
                  <Label htmlFor="credit">Crédit (€)</Label>
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
                  <Label htmlFor="debit">Débit (€)</Label>
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
                <Select value={formArtisteId} onValueChange={setFormArtisteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un artiste" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Select value={formProjetId} onValueChange={setFormProjetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projets.map((projet) => (
                      <SelectItem key={projet.id} value={projet.id}>
                        {projet.nom} ({projet.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select value={formCategorie} onValueChange={setFormCategorie}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
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
                onClick={() => router.push('/dashboard/transactions')}
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
                  'Enregistrer la transaction'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
