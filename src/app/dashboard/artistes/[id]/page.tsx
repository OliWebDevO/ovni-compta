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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Receipt,
  Pencil,
} from 'lucide-react';
import { getArtisteById, transactions } from '@/data/mock';
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const monthlyData = [
  { mois: 'Jan', credit: 500, debit: 200 },
  { mois: 'Fév', credit: 300, debit: 150 },
  { mois: 'Mar', credit: 800, debit: 400 },
  { mois: 'Avr', credit: 200, debit: 100 },
  { mois: 'Mai', credit: 600, debit: 300 },
  { mois: 'Juin', credit: 400, debit: 250 },
];

export default function ArtisteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const artiste = getArtisteById(id);

  if (!artiste) {
    notFound();
  }

  const artisteTransactions = transactions.filter(
    (t) => t.artiste_id === artiste.id
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <div className="animate-slide-up relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 p-6 text-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <Link href="/dashboard/artistes">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Badge className="bg-white/20 text-white border-white/30">
              {artiste.actif ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 ring-4 ring-white/30">
              <AvatarFallback className="bg-white text-indigo-600 text-xl sm:text-2xl font-bold">
                {getInitials(artiste.nom)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {artiste.nom}
              </h1>
              <p className="text-white/80">Fiche artiste</p>
            </div>
          </div>
          <Button className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-white/90">
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
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

      {/* Transactions Table */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
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
                      {tx.projet ? (
                        <Badge variant="secondary">{tx.projet.code}</Badge>
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
