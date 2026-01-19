'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Users,
  FolderKanban,
  Receipt,
  Plus,
  LayoutDashboard,
} from 'lucide-react';
import {
  transactions,
  artistes,
  projets,
  getTotalSolde,
  getTotalCredits,
  getTotalDebits,
  bilansAnnuels,
} from '@/data/mock';
import { formatCurrency, formatDate, getSoldeColor } from '@/lib/utils';
import { TEXT_COLORS } from '@/lib/colors';
import {
  ModernTooltip,
  ChartGradients,
  MODERN_COLORS,
  modernAxisConfig,
  modernGridConfig,
} from '@/components/ui/chart-components';
import {
  IllustrationChart,
  IllustrationOVNI,
  IllustrationDocuments,
  IllustrationWallet,
  IllustrationArtist,
  IllustrationProject,
} from '@/components/illustrations';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const monthlyData = [
  { mois: 'Jan', credit: 2500, debit: 1800 },
  { mois: 'Fév', credit: 3200, debit: 2100 },
  { mois: 'Mar', credit: 1800, debit: 2500 },
  { mois: 'Avr', credit: 4500, debit: 1900 },
  { mois: 'Mai', credit: 2800, debit: 2200 },
  { mois: 'Juin', credit: 3500, debit: 2800 },
  { mois: 'Juil', credit: 2100, debit: 1500 },
  { mois: 'Août', credit: 1500, debit: 1200 },
  { mois: 'Sept', credit: 4200, debit: 3100 },
  { mois: 'Oct', credit: 3800, debit: 2400 },
  { mois: 'Nov', credit: 2900, debit: 2000 },
  { mois: 'Déc', credit: 3100, debit: 2600 },
];

export default function DashboardPage() {
  const solde = getTotalSolde();
  const totalCredits = getTotalCredits();
  const totalDebits = getTotalDebits();
  const recentTransactions = transactions.slice(0, 5);
  const artistesActifs = artistes.filter((a) => a.actif).length;
  const projetsActifs = projets.filter((p) => p.statut === 'actif').length;

  return (
    <div className="space-y-6">
      {/* Hero Section avec gradient */}
      <PageHeader
        title="Dashboard"
        description="Vue d'ensemble de la comptabilité O.V.N.I"
        gradient="from-violet-500 via-purple-500 to-fuchsia-500"
        icon={<LayoutDashboard className="h-7 w-7 text-white" />}
      >
        <Button asChild className="w-full sm:w-auto bg-white text-purple-600 hover:bg-white/90 shadow-lg">
          <Link href="/dashboard/transactions/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle transaction
          </Link>
        </Button>
      </PageHeader>

      {/* Section header - Aperçu financier */}
      <SectionHeader
        icon={<IllustrationWallet size={60} />}
        title="Aperçu financier"
        description="Vue d'ensemble de vos finances"
      />

      {/* Stats Cards avec couleurs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-slide-up card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Global</CardTitle>
            <div className="p-2 rounded-full bg-violet-100">
              <TrendingUp className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSoldeColor(solde)}`}>
              {formatCurrency(solde)}
            </div>
            <p className="text-xs text-muted-foreground">
              {solde > 0 ? '+12% par rapport au mois dernier' : 'Attention: solde négatif'}
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up animation-delay-100 card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crédits</CardTitle>
            <div className="p-2 rounded-full bg-emerald-100">
              <ArrowUpRight className={`h-4 w-4 ${TEXT_COLORS.credit}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${TEXT_COLORS.credit}`}>
              {formatCurrency(totalCredits)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.credit > 0).length} entrées
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up animation-delay-200 card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Débits</CardTitle>
            <div className="p-2 rounded-full bg-rose-100">
              <ArrowDownRight className={`h-4 w-4 ${TEXT_COLORS.debit}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${TEXT_COLORS.debit}`}>
              {formatCurrency(totalDebits)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.debit > 0).length} sorties
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up animation-delay-300 card-hover bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <div className="p-2 rounded-full bg-amber-100">
              <Receipt className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {artistesActifs} artistes • {projetsActifs} projets actifs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section header - Graphiques */}
      <SectionHeader
        icon={<IllustrationChart size={60} />}
        title="Graphiques & Statistiques"
        description="Évolution de votre comptabilité"
      />

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-5">
        <Card className="xl:col-span-3 card-hover bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Évolution mensuelle</CardTitle>
            <CardDescription>
              Crédits et débits sur les 12 derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <ChartGradients />
                <CartesianGrid {...modernGridConfig} />
                <XAxis dataKey="mois" {...modernAxisConfig} />
                <YAxis {...modernAxisConfig} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip content={<ModernTooltip />} />
                <Area
                  type="monotone"
                  dataKey="credit"
                  stroke="url(#creditStroke)"
                  strokeWidth={2.5}
                  fill="url(#creditGradient)"
                  name="Crédits"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="debit"
                  stroke="url(#debitStroke)"
                  strokeWidth={2.5}
                  fill="url(#debitGradient)"
                  name="Débits"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 card-hover bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100">
          <CardHeader>
            <CardTitle className="text-teal-900">Bilans annuels</CardTitle>
            <CardDescription>Comparaison par année</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bilansAnnuels} barGap={4}>
                <ChartGradients />
                <CartesianGrid {...modernGridConfig} />
                <XAxis dataKey="annee" {...modernAxisConfig} />
                <YAxis {...modernAxisConfig} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip content={<ModernTooltip />} />
                <Bar
                  dataKey="total_credit"
                  fill="url(#creditBarGradient)"
                  name="Crédits"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="total_debit"
                  fill="url(#debitBarGradient)"
                  name="Débits"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section header - Activité récente */}
      <SectionHeader
        icon={<IllustrationDocuments size={60} />}
        title="Activité récente"
        description="Dernières transactions et accès rapides"
      />

      {/* Recent Activity & Quick Links */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-5">
        <Card className="xl:col-span-3 card-hover bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
          <CardHeader>
            <CardTitle>Transactions récentes</CardTitle>
            <CardDescription>
              Les 5 dernières transactions enregistrées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {tx.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(tx.date)}
                      {tx.artiste && ` • ${tx.artiste.nom}`}
                    </p>
                  </div>
                  <div className="text-right">
                    {tx.credit > 0 && (
                      <span className={`${TEXT_COLORS.credit} font-medium`}>
                        +{formatCurrency(tx.credit)}
                      </span>
                    )}
                    {tx.debit > 0 && (
                      <span className={`${TEXT_COLORS.debit} font-medium`}>
                        -{formatCurrency(tx.debit)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/transactions">Voir toutes les transactions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 card-hover bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-900">Accès rapides</CardTitle>
            <CardDescription>Navigation vers les sections principales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              href="/dashboard/artistes"
              className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Artistes</p>
                  <p className="text-sm text-muted-foreground">
                    {artistes.length} artistes enregistrés
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{artistesActifs} actifs</Badge>
            </Link>

            <Link
              href="/dashboard/projets"
              className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-purple-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-fuchsia-50 hover:border-purple-200 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Projets</p>
                  <p className="text-sm text-muted-foreground">
                    {projets.length} projets enregistrés
                  </p>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">{projetsActifs} actifs</Badge>
            </Link>

            <Link
              href="/dashboard/bilans"
              className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-amber-100 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:border-amber-200 transition-all duration-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Bilans</p>
                  <p className="text-sm text-muted-foreground">
                    {bilansAnnuels.length} années de données
                  </p>
                </div>
              </div>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">2020-2024</Badge>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
