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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Receipt,
  Pencil,
  Loader2,
  Trash2,
} from 'lucide-react';
import { getArtisteById, getArtisteTransactions, deleteArtiste } from '@/lib/actions/artistes';
import { deleteTransaction } from '@/lib/actions/transactions';
import { toast } from 'sonner';
import type { ArtisteWithStats } from '@/types/database';
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  getInitials,
  getSoldeColor,
} from '@/lib/utils';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CATEGORIES } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

// Type for artiste transactions
interface ArtisteTransaction {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  categorie: string | null;
  projet_id: string | null;
  projet_code?: string;
}

// Couleurs pour les catégories
const CATEGORY_COLORS: Record<string, string> = {
  cachet: '#10b981',
  subvention: '#3b82f6',
  smart: '#8b5cf6',
  thoman: '#f59e0b',
  materiel: '#6366f1',
  loyer: '#ec4899',
  deplacement: '#f97316',
  frais_bancaires: '#64748b',
  transfert_interne: '#a855f7',
  autre: '#94a3b8',
};

const getCategoryLabel = (value: string): string => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat?.label || value;
};

export default function ArtisteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [artiste, setArtiste] = useState<ArtisteWithStats | null>(null);
  const [artisteTransactions, setArtisteTransactions] = useState<ArtisteTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);
  const { canEdit, isAdmin } = usePermissions();

  useEffect(() => {
    async function fetchData() {
      const [artisteRes, txRes] = await Promise.all([
        getArtisteById(id),
        getArtisteTransactions(id),
      ]);

      if (!artisteRes.data) {
        setNotFoundState(true);
        return;
      }

      setArtiste(artisteRes.data);
      if (txRes.data) setArtisteTransactions(txRes.data);
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
    setArtisteTransactions(artisteTransactions.filter((tx) => tx.id !== txId));
  };

  const handleDeleteArtiste = async () => {
    setIsDeleting(true);
    const { error } = await deleteArtiste(id);
    if (error) {
      toast.error(`Erreur: ${error}`);
      setIsDeleting(false);
      return;
    }
    toast.success('Artiste supprimé');
    router.push('/dashboard/artistes');
  };

  if (notFoundState) {
    notFound();
  }

  if (isLoading || !artiste) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Calcul des données par catégorie pour les dépenses (débits)
  const debitsByCategory = artisteTransactions
    .filter((t) => t.debit > 0)
    .reduce(
      (acc, t) => {
        const cat = t.categorie || 'autre';
        acc[cat] = (acc[cat] || 0) + t.debit;
        return acc;
      },
      {} as Record<string, number>
    );

  const debitCategoryData = Object.entries(debitsByCategory)
    .map(([key, value]) => ({
      name: getCategoryLabel(key),
      value,
      color: CATEGORY_COLORS[key] || CATEGORY_COLORS.autre,
    }))
    .sort((a, b) => b.value - a.value);

  // Calcul des données par catégorie pour les rentrées (crédits)
  const creditsByCategory = artisteTransactions
    .filter((t) => t.credit > 0)
    .reduce(
      (acc, t) => {
        const cat = t.categorie || 'autre';
        acc[cat] = (acc[cat] || 0) + t.credit;
        return acc;
      },
      {} as Record<string, number>
    );

  const creditCategoryData = Object.entries(creditsByCategory)
    .map(([key, value]) => ({
      name: getCategoryLabel(key),
      value,
      color: CATEGORY_COLORS[key] || CATEGORY_COLORS.autre,
    }))
    .sort((a, b) => b.value - a.value);

  // Calcul des données mensuelles pour le graphique d'évolution (6 derniers mois)
  const monthlyData = (() => {
    const now = new Date();
    const months: { mois: string; credit: number; debit: number }[] = [];
    const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        mois: MOIS[d.getMonth()],
        credit: 0,
        debit: 0,
      });

      artisteTransactions.forEach(tx => {
        const txDate = new Date(tx.date);
        const txMonthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
        if (txMonthKey === monthKey) {
          months[months.length - 1].credit += tx.credit;
          months[months.length - 1].debit += tx.debit;
        }
      });
    }

    return months;
  })();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <div className="animate-slide-up relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 p-6 text-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="outline" size="icon" asChild className="bg-white/20 border-white/30 text-white hover:bg-white/30 shrink-0">
              <Link href="/dashboard/artistes">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-4 ring-white/30 shrink-0">
              <AvatarFallback
                className="text-white text-xl sm:text-2xl font-bold"
                style={{ backgroundColor: artiste.couleur || '#6366f1' }}
              >
                {getInitials(artiste.nom)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                {artiste.nom}
              </h1>
              <p className="text-white/80">Fiche artiste</p>
            </div>
          </div>
          {canEdit && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="flex-1 sm:flex-none bg-white text-indigo-600 hover:bg-white/90">
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
                      <AlertDialogTitle>Supprimer cet artiste ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes les transactions associées à
                        <strong> {artiste.nom}</strong> seront également supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteArtiste}
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
        <Card className="card-hover bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Solde actuel</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div
              className={`text-xl sm:text-2xl font-bold ${getSoldeColor(
                artiste.solde || 0
              )}`}
            >
              {formatCurrency(artiste.solde || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total crédits</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {formatCurrency(artiste.total_credit || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total débits</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-rose-500">
              {formatCurrency(artiste.total_debit || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-violet-700">
              {artiste.nb_transactions || 0}
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
            {artiste.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{artiste.email}</span>
              </div>
            )}
            {artiste.telephone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{artiste.telephone}</span>
              </div>
            )}
            <Separator />
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Créé le</p>
                <p>{formatDateLong(artiste.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={artiste.actif ? 'default' : 'secondary'}>
                {artiste.actif ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
            {artiste.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{artiste.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="lg:col-span-2 card-hover bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
          <CardHeader>
            <CardTitle>Évolution (6 derniers mois)</CardTitle>
            <CardDescription>
              Crédits et débits mensuels pour cet artiste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area
                  type="monotone"
                  dataKey="credit"
                  stroke="#4ade80"
                  fill="#86efac"
                  fillOpacity={0.6}
                  name="Crédits"
                />
                <Area
                  type="monotone"
                  dataKey="debit"
                  stroke="#fb7185"
                  fill="#fda4af"
                  fillOpacity={0.6}
                  name="Débits"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Dépenses par catégorie */}
        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardHeader>
            <CardTitle>Dépenses par catégorie</CardTitle>
            <CardDescription>
              Distribution des débits par type de dépense
            </CardDescription>
          </CardHeader>
          <CardContent>
            {debitCategoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={debitCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
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
                <div className="mt-4 space-y-2">
                  {debitCategoryData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.name}</span>
                      </div>
                      <span className="font-medium text-rose-600">
                        {formatCurrency(entry.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucune dépense enregistrée
              </p>
            )}
          </CardContent>
        </Card>

        {/* Rentrées par catégorie */}
        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardHeader>
            <CardTitle>Rentrées par catégorie</CardTitle>
            <CardDescription>
              Distribution des crédits par type de rentrée
            </CardDescription>
          </CardHeader>
          <CardContent>
            {creditCategoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={creditCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
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
                <div className="mt-4 space-y-2">
                  {creditCategoryData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.name}</span>
                      </div>
                      <span className="font-medium text-emerald-600">
                        {formatCurrency(entry.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucune rentrée enregistrée
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        <h2 className="text-lg font-semibold">Historique des transactions</h2>
        <p className="text-sm text-muted-foreground">
          {artisteTransactions.length} transaction(s)
        </p>
        {artisteTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Aucune transaction pour cet artiste
              </p>
            </CardContent>
          </Card>
        ) : (
          artisteTransactions.map((tx) => (
            <Card key={tx.id} className="bg-gradient-to-br from-slate-50/50 to-gray-50/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                      {tx.projet_code && (
                        <Badge variant="secondary" className="text-xs">{tx.projet_code}</Badge>
                      )}
                    </div>
                    <p className="font-medium mt-1 text-sm truncate">{tx.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      {tx.credit > 0 ? (
                        <div>
                          <p className="text-xs text-muted-foreground">Crédit</p>
                          <p className="text-emerald-600 font-semibold">+{formatCurrency(tx.credit)}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-muted-foreground">Débit</p>
                          <p className="text-rose-500 font-semibold">-{formatCurrency(tx.debit)}</p>
                        </div>
                      )}
                    </div>
                    {canEdit && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                          asChild
                        >
                          <Link href={`/dashboard/transactions/${tx.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                          onClick={() => handleDeleteTransaction(tx.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
          <CardTitle>Historique des transactions</CardTitle>
          <CardDescription>
            Toutes les transactions liées à cet artiste
          </CardDescription>
        </CardHeader>
        <CardContent>
          {artisteTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune transaction pour cet artiste
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead className="text-right">Crédit</TableHead>
                  <TableHead className="text-right">Débit</TableHead>
                  {canEdit && <TableHead className="w-[100px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {artisteTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      {formatDate(tx.date)}
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell>
                      {tx.projet_code ? (
                        <Badge variant="secondary">{tx.projet_code}</Badge>
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
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-blue-500"
                            asChild
                          >
                            <Link href={`/dashboard/transactions/${tx.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                            onClick={() => handleDeleteTransaction(tx.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
