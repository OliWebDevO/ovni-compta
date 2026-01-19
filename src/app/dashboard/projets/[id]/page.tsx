'use client';

import { use } from 'react';
import Link from 'next/link';
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
  ArrowLeft,
  Calendar,
  Euro,
  TrendingUp,
  TrendingDown,
  Receipt,
  Pencil,
  User,
} from 'lucide-react';
import { getProjetById, transactions, getArtisteById } from '@/data/mock';
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  getStatutColor,
  getSoldeColor,
} from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const monthlyData = [
  { mois: 'Jan', depenses: 1200 },
  { mois: 'Fév', depenses: 800 },
  { mois: 'Mar', depenses: 1500 },
  { mois: 'Avr', depenses: 600 },
  { mois: 'Mai', depenses: 900 },
  { mois: 'Juin', depenses: 1100 },
];

const categoryData = [
  { name: 'Cachets', value: 3500, color: '#10b981' },
  { name: 'Matériel', value: 2000, color: '#6366f1' },
  { name: 'Déplacements', value: 1200, color: '#f59e0b' },
  { name: 'Location', value: 800, color: '#8b5cf6' },
  { name: 'Autres', value: 500, color: '#94a3b8' },
];

export default function ProjetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const projet = getProjetById(id);

  if (!projet) {
    notFound();
  }

  const projetTransactions = transactions.filter(
    (t) => t.projet_id === projet.id
  );
  const artiste = projet.artiste_id ? getArtisteById(projet.artiste_id) : null;

  const budgetUsed = projet.budget
    ? ((projet.total_debit || 0) / projet.budget) * 100
    : 0;
  const budgetUsedCapped = Math.min(budgetUsed, 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <div className="animate-slide-up relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 p-6 text-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Link href="/dashboard/projets">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Badge className="bg-white/20 text-white border-white/30">
              {projet.statut === 'actif'
                ? 'Actif'
                : projet.statut === 'termine'
                ? 'Terminé'
                : 'Annulé'}
            </Badge>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{projet.nom}</h1>
            <p className="text-base sm:text-lg text-white/80">{projet.code}</p>
            {projet.description && (
              <p className="text-sm sm:text-base text-white/70 mt-1">{projet.description}</p>
            )}
          </div>
          <Button className="w-full sm:w-auto bg-white text-fuchsia-600 hover:bg-white/90">
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
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
                      href={`/dashboard/artistes/${artiste.id}`}
                      className="text-primary hover:underline"
                    >
                      {artiste.nom}
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

        {/* Monthly Expenses Chart */}
        <Card className="card-hover bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100">
          <CardHeader>
            <CardTitle>Dépenses mensuelles</CardTitle>
            <CardDescription>Évolution sur 6 mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="depenses" fill="#fda4af" name="Dépenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
            <CardDescription>Distribution des dépenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-1 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
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
                      {tx.artiste && (
                        <Badge variant="outline" className="text-xs">{tx.artiste.nom}</Badge>
                      )}
                    </div>
                    <p className="font-medium mt-1 text-sm">{tx.description}</p>
                  </div>
                  <div className="text-right shrink-0">
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
                      {tx.artiste ? (
                        <Badge variant="outline">{tx.artiste.nom}</Badge>
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
