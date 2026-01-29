'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Calendar,
  Euro,
  TrendingUp,
  TrendingDown,
  Receipt,
  Pencil,
  User,
  Loader2,
  Trash2,
} from 'lucide-react';
import { getProjetById, getProjetTransactions, getProjetArtistes, deleteProjet } from '@/lib/actions/projets';
import { deleteTransaction } from '@/lib/actions/transactions';
import { toast } from 'sonner';
import type { ProjetWithStats } from '@/types/database';
import { CATEGORIES } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  getStatutColor,
  getSoldeColor,
} from '@/lib/utils';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Types for project data
interface ProjetTransaction {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  categorie: string | null;
  artiste_id: string | null;
  artiste_nom?: string;
}

interface ProjetArtiste {
  id: string;
  artiste_id: string;
  artiste_nom: string;
  artiste_couleur: string | null;
  role_projet: string | null;
}

// Couleurs pour les catégories
const CATEGORY_COLORS: Record<string, string> = {
  cachet: '#10b981',      // emerald
  subvention: '#3b82f6',  // blue
  smart: '#8b5cf6',       // violet
  thoman: '#f59e0b',      // amber
  materiel: '#6366f1',    // indigo
  loyer: '#ec4899',       // pink
  deplacement: '#f97316', // orange
  frais_bancaires: '#64748b', // slate
  transfert_interne: '#a855f7', // purple
  autre: '#94a3b8',       // gray
};

// Fonction pour obtenir le label d'une catégorie
const getCategoryLabel = (value: string): string => {
  const cat = CATEGORIES.find(c => c.value === value);
  return cat?.label || value;
};

export default function ProjetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetWithStats | null>(null);
  const [projetTransactions, setProjetTransactions] = useState<ProjetTransaction[]>([]);
  const [projetArtistes, setProjetArtistes] = useState<ProjetArtiste[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);
  const { canEdit, isAdmin } = usePermissions();

  useEffect(() => {
    async function fetchData() {
      const [projetRes, txRes, artistesRes] = await Promise.all([
        getProjetById(id),
        getProjetTransactions(id),
        getProjetArtistes(id),
      ]);

      if (!projetRes.data) {
        setNotFoundState(true);
        return;
      }

      setProjet(projetRes.data);
      if (txRes.data) setProjetTransactions(txRes.data);
      if (artistesRes.data) setProjetArtistes(artistesRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  const handleDeleteTransaction = async (txId: string) => {
    const { error } = await deleteTransaction(txId);
    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }
    toast.success('Transaction supprimée');
    setProjetTransactions(projetTransactions.filter((tx) => tx.id !== txId));
  };

  const handleDeleteProjet = async () => {
    setIsDeleting(true);
    const { error } = await deleteProjet(id);
    if (error) {
      toast.error(`Erreur: ${error}`);
      setIsDeleting(false);
      return;
    }
    toast.success('Projet supprimé');
    router.push('/dashboard/projets');
  };

  if (notFoundState) {
    notFound();
  }

  if (isLoading || !projet) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Get the first artiste if any
  const artiste = projetArtistes.length > 0 ? projetArtistes[0] : null;

  const budgetUsed = projet.budget
    ? ((projet.total_debit || 0) / projet.budget) * 100
    : 0;
  const budgetUsedCapped = Math.min(budgetUsed, 100);

  // Calcul de la répartition des débits par catégorie
  const debitsByCategory = projetTransactions
    .filter(t => t.debit > 0)
    .reduce((acc, t) => {
      const cat = t.categorie || 'autre';
      acc[cat] = (acc[cat] || 0) + t.debit;
      return acc;
    }, {} as Record<string, number>);

  const debitCategoryData = Object.entries(debitsByCategory)
    .map(([key, value]) => ({
      name: getCategoryLabel(key),
      value,
      color: CATEGORY_COLORS[key] || CATEGORY_COLORS.autre,
    }))
    .sort((a, b) => b.value - a.value);

  // Calcul de la répartition des crédits par catégorie
  const creditsByCategory = projetTransactions
    .filter(t => t.credit > 0)
    .reduce((acc, t) => {
      const cat = t.categorie || 'autre';
      acc[cat] = (acc[cat] || 0) + t.credit;
      return acc;
    }, {} as Record<string, number>);

  const creditCategoryData = Object.entries(creditsByCategory)
    .map(([key, value]) => ({
      name: getCategoryLabel(key),
      value,
      color: CATEGORY_COLORS[key] || CATEGORY_COLORS.autre,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <div className="animate-slide-up relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 p-6 text-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="outline" size="icon" asChild className="bg-white/20 border-white/30 text-white hover:bg-white/30 shrink-0">
              <Link href="/dashboard/projets">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{projet.nom}</h1>
              <p className="text-white/80">Fiche projet</p>
            </div>
          </div>
          {canEdit && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="flex-1 sm:flex-none bg-white text-fuchsia-600 hover:bg-white/90">
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              {isAdmin && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none bg-white/20 border-white/30 text-white hover:bg-red-500 hover:border-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes les transactions associées au projet
                        <strong> {projet.nom}</strong> seront également supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteProjet}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Suppression...
                          </>
                        ) : (
                          'Oui, supprimer'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Solde</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div
              className={`text-xl sm:text-2xl font-bold ${getSoldeColor(
                projet.solde || 0
              )}`}
            >
              {formatCurrency(projet.solde || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Crédits</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {formatCurrency(projet.total_credit || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Débits</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-rose-500">
              {formatCurrency(projet.total_debit || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-amber-700">
              {projetTransactions.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Info Card */}
        <Card className="card-hover bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projet.date_debut && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Période</p>
                  <p>
                    {formatDateLong(projet.date_debut)}
                    {projet.date_fin && ` - ${formatDateLong(projet.date_fin)}`}
                  </p>
                </div>
              </div>
            )}

            {artiste && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Artiste associé</p>
                    <Link
                      href={`/dashboard/artistes/${artiste.artiste_id}`}
                      className="text-primary hover:underline"
                    >
                      {artiste.artiste_nom}
                    </Link>
                  </div>
                </div>
              </>
            )}

            {projet.budget && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget alloué</p>
                      <p className="font-semibold">
                        {formatCurrency(projet.budget)}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={budgetUsedCapped}
                    className={
                      budgetUsed > 90
                        ? '[&>div]:bg-red-500'
                        : budgetUsed > 70
                        ? '[&>div]:bg-amber-500'
                        : ''
                    }
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {budgetUsed.toFixed(1)}% utilisé
                    </span>
                    <span className="font-medium">
                      {formatCurrency(projet.reste_budget || 0)} restant
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Dépenses par catégorie */}
        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-rose-500" />
              Dépenses par catégorie
            </CardTitle>
            <CardDescription>Distribution des débits</CardDescription>
          </CardHeader>
          <CardContent>
            {debitCategoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={debitCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {debitCategoryData.map((entry, index) => (
                        <Cell key={`cell-debit-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {debitCategoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-1 text-xs">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
                Aucune dépense enregistrée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rentrées par catégorie */}
        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Rentrées par catégorie
            </CardTitle>
            <CardDescription>Distribution des crédits</CardDescription>
          </CardHeader>
          <CardContent>
            {creditCategoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={creditCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {creditCategoryData.map((entry, index) => (
                        <Cell key={`cell-credit-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {creditCategoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-1 text-xs">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
                Aucune rentrée enregistrée
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        <h2 className="text-lg font-semibold">Transactions du projet</h2>
        <p className="text-sm text-muted-foreground">
          {projetTransactions.length} transaction(s)
        </p>
        {projetTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Aucune transaction pour ce projet
              </p>
            </CardContent>
          </Card>
        ) : (
          projetTransactions.map((tx) => (
            <Card key={tx.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                      {tx.artiste_nom && (
                        <Badge variant="outline" className="text-xs">{tx.artiste_nom}</Badge>
                      )}
                    </div>
                    <p className="font-medium mt-1 text-sm">{tx.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      {tx.credit > 0 && (
                        <span className="text-emerald-600 font-semibold">
                          +{formatCurrency(tx.credit)}
                        </span>
                      )}
                      {tx.debit > 0 && (
                        <span className="text-rose-500 font-semibold">
                          -{formatCurrency(tx.debit)}
                        </span>
                      )}
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                        onClick={() => handleDeleteTransaction(tx.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Transactions Table - Desktop */}
      <Card className="hidden lg:block bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
        <CardHeader>
          <CardTitle>Transactions du projet</CardTitle>
          <CardDescription>
            Historique des entrées et sorties pour ce projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projetTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune transaction pour ce projet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Artiste</TableHead>
                  <TableHead className="text-right">Crédit</TableHead>
                  <TableHead className="text-right">Débit</TableHead>
                  {canEdit && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {projetTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      {formatDate(tx.date)}
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>
                      {tx.artiste_nom ? (
                        <Badge variant="outline">{tx.artiste_nom}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.credit > 0 ? (
                        <span className="text-emerald-600 font-medium">
                          +{formatCurrency(tx.credit)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.debit > 0 ? (
                        <span className="text-rose-500 font-medium">
                          -{formatCurrency(tx.debit)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                          onClick={() => handleDeleteTransaction(tx.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
