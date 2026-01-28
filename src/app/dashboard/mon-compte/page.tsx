'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Calendar,
  Receipt,
  Download,
  Euro,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/actions/profile';
import { getArtisteById, getArtisteTransactions } from '@/lib/actions/artistes';
import { getProjets } from '@/lib/actions/projets';
import type { ArtisteWithStats, ProjetWithStats } from '@/types/database';
import type { CurrentUser } from '@/lib/actions/profile';
import {
  formatCurrency,
  formatDate,
  formatDateLong,
  getInitials,
  getSoldeColor,
  MOIS,
} from '@/lib/utils';
import { SectionHeader } from '@/components/ui/section-header';
import { IllustrationWallet, IllustrationChart, IllustrationProject, IllustrationDocuments } from '@/components/illustrations';
import { Sparkles } from 'lucide-react';
import {
  ModernTooltip,
  ChartGradients,
  modernAxisConfig,
  modernGridConfig,
} from '@/components/ui/chart-components';
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
import { EmptyState } from '@/components/ui/empty-state';

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

export default function MonComptePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [artiste, setArtiste] = useState<ArtisteWithStats | null>(null);
  const [mesTransactions, setMesTransactions] = useState<ArtisteTransaction[]>([]);
  const [mesProjets, setMesProjets] = useState<ProjetWithStats[]>([]);

  useEffect(() => {
    async function fetchData() {
      // First get the current user to find their artiste_id
      const userRes = await getCurrentUser();
      if (!userRes.data?.artiste_id) {
        setIsLoading(false);
        return;
      }

      const artisteId = userRes.data.artiste_id;

      // Fetch artiste data, transactions, and projets in parallel
      const [artisteRes, txRes, projetsRes] = await Promise.all([
        getArtisteById(artisteId),
        getArtisteTransactions(artisteId),
        getProjets(),
      ]);

      if (artisteRes.data) setArtiste(artisteRes.data);
      if (txRes.data) setMesTransactions(txRes.data);
      // Filter projets to only those linked to this artiste
      if (projetsRes.data) {
        setMesProjets(projetsRes.data.filter(p => p.artiste_id === artisteId));
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Compute monthly data from transactions
  const monthlyData = mesTransactions.reduce((acc, tx) => {
    const date = new Date(tx.date);
    const monthKey = MOIS[date.getMonth()].slice(0, 4);
    const existing = acc.find(m => m.mois === monthKey);
    if (existing) {
      existing.credit += tx.credit;
      existing.debit += tx.debit;
    } else {
      acc.push({ mois: monthKey, credit: tx.credit, debit: tx.debit });
    }
    return acc;
  }, [] as { mois: string; credit: number; debit: number }[]);

  // Compute expense breakdown by category
  const expensesByCategory = mesTransactions
    .filter(tx => tx.debit > 0)
    .reduce((acc, tx) => {
      const cat = tx.categorie || 'Autre';
      const existing = acc.find(e => e.cat === cat);
      if (existing) {
        existing.montant += tx.debit;
      } else {
        acc.push({ cat, montant: tx.debit });
      }
      return acc;
    }, [] as { cat: string; montant: number }[])
    .sort((a, b) => b.montant - a.montant)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!artiste) {
    return (
      <Card>
        <CardContent className="p-0">
          <EmptyState
            title="Aucun artiste associé"
            description="Votre compte n'est pas lié à un profil artiste. Contactez un administrateur."
            illustration="document"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <div className="animate-slide-up relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-6 sm:p-8 text-white shadow-2xl">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Large decorative blur circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

        {/* Small floating dots - animated */}
        <div className="absolute top-4 right-[12%] w-3 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
        <div className="absolute top-6 right-[4%] w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.5s' }} />
        <div className="absolute bottom-4 right-[15%] w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2.3s' }} />
        <div className="absolute bottom-6 right-[6%] w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.8s' }} />

        {/* Sparkle decorations */}
        <Sparkles className="absolute top-4 left-4 w-5 h-5 text-white/30" />
        <Sparkles className="absolute bottom-4 right-4 w-4 h-4 text-white/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-14 w-14 sm:h-20 sm:w-20 shrink-0 ring-4 ring-white/30 shadow-xl">
              <AvatarFallback
                className="text-white text-xl sm:text-2xl font-bold"
                style={{ backgroundColor: artiste.couleur || '#3b82f6' }}
              >
                {getInitials(artiste.nom)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight truncate">
                Bonjour, {artiste.nom}
              </h1>
              <p className="text-sm sm:text-base text-white/80">
                Bienvenue sur votre espace personnel O.V.N.I
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {artiste.email && (
              <span className="flex items-center gap-1 text-xs sm:text-sm text-white/80 bg-white/10 rounded-full px-3 py-1">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                {artiste.email}
              </span>
            )}
            <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">Artiste actif</Badge>
          </div>
          <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-white/90 shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            Exporter mon relevé
          </Button>
        </div>
      </div>

      {/* Section header - Résumé */}
      <SectionHeader
        icon={<IllustrationWallet size={60} />}
        title="Mon résumé"
        description="Aperçu de votre situation financière"
      />

      {/* Cartes de résumé */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Mon Solde</CardTitle>
            <Euro className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-xl sm:text-3xl font-bold ${getSoldeColor(artiste.solde || 0)}`}>
              {formatCurrency(artiste.solde || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              Solde disponible sur votre compte
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Reçu</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {formatCurrency(artiste.total_credit || 0)}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Cachets, subventions, etc.
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Dépensé</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-rose-500">
              {formatCurrency(artiste.total_debit || 0)}
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Matériel, Smart, frais, etc.
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl sm:text-2xl font-bold text-violet-700">{artiste.nb_transactions || 0}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Mouvements enregistrés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section header - Graphiques */}
      <SectionHeader
        icon={<IllustrationChart size={60} />}
        title="Mon évolution"
        description="Statistiques et graphiques de vos finances"
      />

      {/* Graphiques */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="card-hover bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100">
          <CardHeader>
            <CardTitle>Mon évolution</CardTitle>
            <CardDescription>
              Entrées et sorties sur les derniers mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <ChartGradients />
                <CartesianGrid {...modernGridConfig} />
                <XAxis dataKey="mois" {...modernAxisConfig} />
                <YAxis {...modernAxisConfig} />
                <Tooltip content={<ModernTooltip />} />
                <Area
                  type="monotone"
                  dataKey="credit"
                  stroke="url(#creditStroke)"
                  strokeWidth={2.5}
                  fill="url(#creditGradient)"
                  name="Entrées"
                  animationDuration={1000}
                />
                <Area
                  type="monotone"
                  dataKey="debit"
                  stroke="url(#debitStroke)"
                  strokeWidth={2.5}
                  fill="url(#debitGradient)"
                  name="Sorties"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-100">
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
            <CardDescription>Par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={expensesByCategory}
                layout="vertical"
              >
                <ChartGradients />
                <CartesianGrid {...modernGridConfig} horizontal={true} vertical={false} />
                <XAxis type="number" {...modernAxisConfig} />
                <YAxis dataKey="cat" type="category" width={70} {...modernAxisConfig} />
                <Tooltip content={<ModernTooltip />} />
                <Bar
                  dataKey="montant"
                  fill="url(#primaryBarGradient)"
                  name="Montant"
                  radius={[0, 8, 8, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section header - Projets */}
      {mesProjets.length > 0 && (
        <SectionHeader
          icon={<IllustrationProject size={60} />}
          title="Mes projets"
          description="Projets auxquels vous êtes associé"
        />
      )}

      {/* Mes Projets */}
      {mesProjets.length > 0 && (
        <Card className="card-hover bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
          <CardHeader>
            <CardTitle>Mes Projets</CardTitle>
            <CardDescription>Projets auxquels vous êtes associé</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {mesProjets.map((projet) => (
                <div
                  key={projet.id}
                  className="p-4 bg-white/60 border border-purple-100 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{projet.nom}</h3>
                      <p className="text-sm text-muted-foreground">
                        {projet.code}
                      </p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>
                  {projet.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {projet.description}
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">
                      +{formatCurrency(projet.total_credit || 0)}
                    </span>
                    <span className="text-rose-500">
                      -{formatCurrency(projet.total_debit || 0)}
                    </span>
                    <span className={`font-medium ${getSoldeColor(projet.solde || 0)}`}>
                      = {formatCurrency(projet.solde || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section header - Transactions */}
      <SectionHeader
        icon={<IllustrationDocuments size={60} />}
        title="Mes transactions"
        description="Historique de vos mouvements financiers"
      />

      {/* Mes Transactions - Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        <p className="text-sm text-muted-foreground">
          {mesTransactions.length} transaction(s)
        </p>
        {mesTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Aucune transaction enregistrée
              </p>
            </CardContent>
          </Card>
        ) : (
          mesTransactions.map((tx) => (
            <Card key={tx.id} className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 border-cyan-100/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                      {tx.projet_code && (
                        <Badge variant="secondary" className="text-xs">{tx.projet_code}</Badge>
                      )}
                      {tx.categorie && (
                        <Badge variant="outline" className="text-xs">{tx.categorie}</Badge>
                      )}
                    </div>
                    <p className="font-medium mt-1 text-sm">{tx.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {tx.credit > 0 ? (
                      <span className="text-emerald-600 font-semibold">
                        +{formatCurrency(tx.credit)}
                      </span>
                    ) : (
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

      {/* Mes Transactions - Desktop Table */}
      <Card className="hidden lg:block bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border-blue-100/50">
        <CardHeader>
          <CardTitle>Mes Transactions</CardTitle>
          <CardDescription>
            Historique de vos mouvements financiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mesTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune transaction enregistrée
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mesTransactions.map((tx) => (
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
                    <TableCell>
                      {tx.categorie ? (
                        <Badge variant="outline">{tx.categorie}</Badge>
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
                        <span className="text-rose-500 font-medium">
                          -{formatCurrency(tx.debit)}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pied de page informatif */}
      <Card className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 border-cyan-100">
        <CardContent className="p-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>
                Membre depuis le {formatDateLong(artiste.created_at)}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <span>
              Dernière mise à jour : {formatDateLong(artiste.updated_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
