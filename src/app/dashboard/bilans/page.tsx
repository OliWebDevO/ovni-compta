'use client';

import { useState, useRef, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  FileSpreadsheet,
  FileText,
  Loader2,
} from 'lucide-react';
import { getBilansAnnuels, getBilansMensuels, getBilanTransactions, getAvailableYears } from '@/lib/actions/bilans';
import type { BilanAnnuel, BilanMensuel, TransactionWithRelations } from '@/types/database';
import { formatCurrency, formatDate, getSoldeColor, MOIS } from '@/lib/utils';

const getCategoryLabel = (value: string): string => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat?.label || value;
};
import { exportBilanToCSV, exportYearTransactionsToCSV } from '@/lib/export';
import { TEXT_COLORS } from '@/lib/colors';
import {
  ModernTooltip,
  ChartGradients,
  MODERN_COLORS,
  modernAxisConfig,
  modernGridConfig,
  modernDotConfig,
  modernActiveDotConfig,
} from '@/components/ui/chart-components';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/components/ui/page-header';
import { IllustrationChart, IllustrationWallet, IllustrationDocuments } from '@/components/illustrations';
import { CATEGORIES } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export default function BilansPage() {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const chartsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bilansAnnuels, setBilansAnnuels] = useState<BilanAnnuel[]>([]);
  const [bilansMensuels, setBilansMensuels] = useState<BilanMensuel[]>([]);
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Fetch data and prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    async function fetchData() {
      const currentYear = new Date().getFullYear();

      const [annuelsRes, mensuelsRes, txRes, yearsRes] = await Promise.all([
        getBilansAnnuels(),
        getBilansMensuels(currentYear),
        getBilanTransactions(), // Sans les transferts internes
        getAvailableYears(),
      ]);

      if (annuelsRes.data) {
        setBilansAnnuels(annuelsRes.data);
      }
      if (mensuelsRes.data) setBilansMensuels(mensuelsRes.data);
      if (txRes.data) setTransactions(txRes.data);
      if (yearsRes.data) {
        setAvailableYears(yearsRes.data);
        // S'assurer que l'année courante est sélectionnée
        setSelectedYear(currentYear.toString());
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Refetch monthly data when year changes
  useEffect(() => {
    if (!isMounted) return;

    async function fetchMonthlyData() {
      const year = parseInt(selectedYear);

      // Récupérer les données mensuelles (sera vide si pas de transactions pour cette année)
      const mensuelsRes = await getBilansMensuels(year);
      if (mensuelsRes.data) setBilansMensuels(mensuelsRes.data);
    }
    fetchMonthlyData();
  }, [selectedYear, isMounted]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Prepare monthly data for export
  const monthlyDataForExport = bilansMensuels.map((b) => ({
    mois: MOIS[b.mois - 1],
    total_credit: b.total_credit,
    total_debit: b.total_debit,
    solde: b.solde,
  }));

  // Handle PDF export (print)
  const handlePrintPDF = () => {
    window.print();
  };

  // Handle Excel export of transactions
  const handleExportExcel = () => {
    exportYearTransactionsToCSV(transactions, parseInt(selectedYear));
  };

  // Handle Excel export of bilan summary
  const handleExportBilanExcel = () => {
    exportBilanToCSV(monthlyDataForExport, `bilan_mensuel_${selectedYear}`, 'mensuel');
  };

  // Handle Excel export of annual bilan
  const handleExportAnnualBilanExcel = () => {
    const annualData = bilansAnnuels.map((b) => ({
      annee: b.annee,
      nb_transactions: b.nb_transactions,
      total_credit: b.total_credit,
      total_debit: b.total_debit,
      solde: b.solde,
    }));
    exportBilanToCSV(annualData, 'bilan_annuel', 'annuel');
  };

  const currentBilan = bilansAnnuels.find(
    (b) => b.annee === parseInt(selectedYear)
  );

  const monthlyDataForChart = bilansMensuels.map((b) => ({
    mois: MOIS[b.mois - 1].slice(0, 3),
    credit: b.total_credit,
    debit: b.total_debit,
    solde: b.solde,
  }));

  const cumulativeData = bilansMensuels.reduce(
    (acc, b, i) => {
      const prev = i > 0 ? acc[i - 1] : { cumulCredit: 0, cumulDebit: 0, cumulSolde: 0 };
      acc.push({
        mois: MOIS[b.mois - 1].slice(0, 3),
        cumulCredit: prev.cumulCredit + b.total_credit,
        cumulDebit: prev.cumulDebit + b.total_debit,
        cumulSolde: prev.cumulSolde + b.solde,
      });
      return acc;
    },
    [] as { mois: string; cumulCredit: number; cumulDebit: number; cumulSolde: number }[]
  );

  // Filtrer les transactions par année sélectionnée
  const yearTransactions = transactions.filter((tx) => {
    const txYear = new Date(tx.date).getFullYear();
    return txYear === parseInt(selectedYear);
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Print Title - Only visible when printing */}
      <div className="print-only print-title">
        <h1 className="text-2xl font-bold text-center mb-2">
          Bilan Comptable O.V.N.I
        </h1>
        <h2 className="text-xl text-center text-muted-foreground mb-6">
          Année : {selectedYear}
        </h2>
      </div>

      {/* Header avec gradient - Hidden in print */}
      <div className="no-print">
        <PageHeader
          title="Bilans"
          description="Analyse financière annuelle et mensuelle"
          gradient="from-amber-500 via-orange-500 to-red-500"
          icon={<BarChart3 className="h-7 w-7 text-white" />}
        >
          {isMounted ? (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[120px] bg-white/20 border-white/30 text-white shadow-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((annee) => (
                  <SelectItem key={annee} value={annee.toString()}>
                    {annee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="w-full sm:w-[120px] h-10 bg-white/20 border border-white/30 rounded-md shadow-lg" />
          )}
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-lg"
            onClick={handleExportExcel}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-white text-orange-600 hover:bg-white/90 border-white/30 shadow-lg"
            onClick={handlePrintPDF}
          >
            <FileText className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
        </PageHeader>
      </div>

      {/* Section Résumé - Titre + Contenu groupés pour l'impression */}
      <div className="print-section-with-content">
        <SectionHeader
          icon={<IllustrationWallet size={60} />}
          title="Résumé annuel"
          description={`Données financières pour ${selectedYear}`}
        />

        {/* Year Summary Cards */}
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 mt-4">
          <Card className="card-hover bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Année</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold text-amber-700">{selectedYear}</div>
              <p className="text-xs text-muted-foreground">
                {currentBilan?.nb_transactions ?? 0} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Crédits</CardTitle>
              <TrendingUp className={`h-4 w-4 ${TEXT_COLORS.credit}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className={`text-xl sm:text-2xl font-bold ${TEXT_COLORS.credit}`}>
                {formatCurrency(currentBilan?.total_credit ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Débits</CardTitle>
              <TrendingDown className={`h-4 w-4 ${TEXT_COLORS.debit}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className={`text-xl sm:text-2xl font-bold ${TEXT_COLORS.debit}`}>
                {formatCurrency(currentBilan?.total_debit ?? 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Solde Annuel</CardTitle>
              <BarChart3 className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div
                className={`text-xl sm:text-2xl font-bold ${getSoldeColor(
                  currentBilan?.solde ?? 0
                )}`}
              >
                {formatCurrency(currentBilan?.solde ?? 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message si pas de données pour l'année */}
        {!currentBilan && (
          <Card className="mt-4 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">
                Aucune transaction enregistrée pour {selectedYear}.
                Les données apparaîtront automatiquement dès qu&apos;une transaction sera ajoutée.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Section Graphiques - Large section, let content flow naturally */}
      <div className="print-section-large">
        <SectionHeader
          icon={<IllustrationChart size={60} />}
          title="Analyse graphique"
          description="Visualisation des données financières"
          className="print-section-header"
        />

        {isMounted ? (
        <Tabs defaultValue="mensuel" className="space-y-4 mt-4">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="mensuel" className="flex-1 sm:flex-none text-xs sm:text-sm">Vue Mensuelle</TabsTrigger>
          <TabsTrigger value="annuel" className="flex-1 sm:flex-none text-xs sm:text-sm">Comparaison Annuelle</TabsTrigger>
          <TabsTrigger value="cumul" className="flex-1 sm:flex-none text-xs sm:text-sm">Cumul Progressif</TabsTrigger>
        </TabsList>

        <TabsContent value="mensuel" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 print-keep-together">
            {/* Monthly Bar Chart */}
            <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-100/50">
              <CardHeader>
                <CardTitle>Crédits vs Débits ({selectedYear})</CardTitle>
                <CardDescription>Comparaison mensuelle</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyDataForChart} barGap={2}>
                    <ChartGradients />
                    <CartesianGrid {...modernGridConfig} />
                    <XAxis dataKey="mois" {...modernAxisConfig} />
                    <YAxis {...modernAxisConfig} />
                    <Tooltip content={<ModernTooltip />} />
                    <Bar
                      dataKey="credit"
                      fill="url(#creditBarGradient)"
                      name="Crédits"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="debit"
                      fill="url(#debitBarGradient)"
                      name="Débits"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Solde Chart */}
            <Card className="bg-gradient-to-br from-orange-50/50 to-red-50/40 border-orange-100/50">
              <CardHeader>
                <CardTitle>Solde Mensuel ({selectedYear})</CardTitle>
                <CardDescription>Évolution du solde par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyDataForChart}>
                    <ChartGradients />
                    <CartesianGrid {...modernGridConfig} />
                    <XAxis dataKey="mois" {...modernAxisConfig} />
                    <YAxis {...modernAxisConfig} />
                    <Tooltip content={<ModernTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="solde"
                      stroke="url(#soldeStroke)"
                      strokeWidth={2.5}
                      fill="url(#soldeGradient)"
                      name="Solde"
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Table */}
          <Card className="bg-gradient-to-br from-amber-50/40 to-orange-50/40 border-amber-100/50 print-keep-together">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Détail Mensuel {selectedYear}</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportBilanExcel}
                className="no-print"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead className="text-right">Crédits</TableHead>
                    <TableHead className="text-right">Débits</TableHead>
                    <TableHead className="text-right">Solde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bilansMensuels.map((bilan) => (
                    <TableRow key={bilan.mois}>
                      <TableCell className="font-medium">
                        {MOIS[bilan.mois - 1]}
                      </TableCell>
                      <TableCell className={`text-right ${TEXT_COLORS.credit}`}>
                        {formatCurrency(bilan.total_credit)}
                      </TableCell>
                      <TableCell className={`text-right ${TEXT_COLORS.debit}`}>
                        {formatCurrency(bilan.total_debit)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${getSoldeColor(
                          bilan.solde
                        )}`}
                      >
                        {formatCurrency(bilan.solde)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className={`text-right ${TEXT_COLORS.credit}`}>
                      {formatCurrency(
                        bilansMensuels.reduce((s, b) => s + b.total_credit, 0)
                      )}
                    </TableCell>
                    <TableCell className={`text-right ${TEXT_COLORS.debit}`}>
                      {formatCurrency(
                        bilansMensuels.reduce((s, b) => s + b.total_debit, 0)
                      )}
                    </TableCell>
                    <TableCell
                      className={`text-right ${getSoldeColor(
                        bilansMensuels.reduce((s, b) => s + b.solde, 0)
                      )}`}
                    >
                      {formatCurrency(
                        bilansMensuels.reduce((s, b) => s + b.solde, 0)
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="annuel" className="space-y-4">
          <div className="grid gap-4">
            {/* Annual Comparison Chart */}
            <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-100/50 print-keep-together">
              <CardHeader>
                <CardTitle>Comparaison Annuelle</CardTitle>
                <CardDescription>
                  Évolution des crédits, débits et soldes par année
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={bilansAnnuels} barGap={3}>
                    <ChartGradients />
                    <CartesianGrid {...modernGridConfig} />
                    <XAxis dataKey="annee" {...modernAxisConfig} />
                    <YAxis {...modernAxisConfig} />
                    <Tooltip content={<ModernTooltip />} />
                    <Bar
                      dataKey="total_credit"
                      fill="url(#creditBarGradient)"
                      name="Crédits"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="total_debit"
                      fill="url(#debitBarGradient)"
                      name="Débits"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    />
                    <Bar
                      dataKey="solde"
                      fill="url(#soldeBarGradient)"
                      name="Solde"
                      radius={[6, 6, 0, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Annual Table */}
          <Card className="bg-gradient-to-br from-orange-50/40 to-red-50/30 border-orange-100/50 print-keep-together">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Récapitulatif par Année</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportAnnualBilanExcel}
                className="no-print"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Année</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Crédits</TableHead>
                    <TableHead className="text-right">Débits</TableHead>
                    <TableHead className="text-right">Solde</TableHead>
                    <TableHead>Tendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bilansAnnuels.map((bilan, index) => {
                    const prevBilan = bilansAnnuels[index + 1];
                    const trend = prevBilan
                      ? bilan.solde - prevBilan.solde
                      : 0;

                    return (
                      <TableRow key={bilan.annee}>
                        <TableCell className="font-medium">
                          {bilan.annee}
                        </TableCell>
                        <TableCell className="text-right">
                          {bilan.nb_transactions}
                        </TableCell>
                        <TableCell className={`text-right ${TEXT_COLORS.credit}`}>
                          {formatCurrency(bilan.total_credit)}
                        </TableCell>
                        <TableCell className={`text-right ${TEXT_COLORS.debit}`}>
                          {formatCurrency(bilan.total_debit)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${getSoldeColor(
                            bilan.solde
                          )}`}
                        >
                          {formatCurrency(bilan.solde)}
                        </TableCell>
                        <TableCell>
                          {prevBilan && (
                            <Badge
                              variant={trend >= 0 ? 'default' : 'destructive'}
                              className="flex items-center gap-1 w-fit"
                            >
                              {trend >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {trend >= 0 ? '+' : ''}
                              {formatCurrency(trend)}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cumul" className="space-y-4">
          <Card className="bg-gradient-to-br from-amber-50/50 to-red-50/40 border-amber-100/50 print-keep-together">
            <CardHeader>
              <CardTitle>Cumul Progressif ({selectedYear})</CardTitle>
              <CardDescription>
                Évolution cumulative tout au long de l&apos;année
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={cumulativeData}>
                  <ChartGradients />
                  <CartesianGrid {...modernGridConfig} />
                  <XAxis dataKey="mois" {...modernAxisConfig} />
                  <YAxis {...modernAxisConfig} />
                  <Tooltip content={<ModernTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="cumulCredit"
                    stroke={MODERN_COLORS.credit.main}
                    strokeWidth={2.5}
                    name="Crédits cumulés"
                    dot={{ ...modernDotConfig, stroke: MODERN_COLORS.credit.main }}
                    activeDot={{ ...modernActiveDotConfig, stroke: MODERN_COLORS.credit.main }}
                    animationDuration={1200}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulDebit"
                    stroke={MODERN_COLORS.debit.main}
                    strokeWidth={2.5}
                    name="Débits cumulés"
                    dot={{ ...modernDotConfig, stroke: MODERN_COLORS.debit.main }}
                    activeDot={{ ...modernActiveDotConfig, stroke: MODERN_COLORS.debit.main }}
                    animationDuration={1200}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulSolde"
                    stroke={MODERN_COLORS.solde.main}
                    strokeWidth={3}
                    name="Solde cumulé"
                    dot={{ ...modernDotConfig, stroke: MODERN_COLORS.solde.main }}
                    activeDot={{ ...modernActiveDotConfig, stroke: MODERN_COLORS.solde.main }}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
        ) : (
          <div className="space-y-4 mt-4">
            <div className="w-full sm:w-auto flex h-10 bg-muted rounded-md animate-pulse" />
          </div>
        )}
      </div>

      {/* Section Transactions du Bilan */}
      <div className="print-section-large">
        <SectionHeader
          icon={<IllustrationDocuments size={60} />}
          title={`Transactions ${selectedYear}`}
          description="Liste des transactions comptables (hors transferts internes)"
          className="print-section-header"
        />

        {/* Transactions Mobile Cards */}
        <div className="block lg:hidden space-y-3 mt-4">
          <p className="text-sm text-muted-foreground px-1">
            {yearTransactions.length} transaction(s)
          </p>
          {yearTransactions.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune transaction pour {selectedYear}
                </p>
              </CardContent>
            </Card>
          ) : (
            yearTransactions.map((tx) => (
              <Card key={tx.id} className="bg-gradient-to-br from-amber-50/30 to-orange-50/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                        {tx.artiste_nom && (
                          <Badge variant="outline" className="text-xs">{tx.artiste_nom}</Badge>
                        )}
                        {tx.projet_code && (
                          <Badge variant="secondary" className="text-xs">{tx.projet_code}</Badge>
                        )}
                      </div>
                      <p className="font-medium mt-1 text-sm">{tx.description}</p>
                      {tx.categorie && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {getCategoryLabel(tx.categorie)}
                        </p>
                      )}
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
        <Card className="hidden lg:block bg-gradient-to-br from-amber-50/40 to-orange-50/40 border-amber-100/50 mt-4 print-keep-together">
          <CardHeader>
            <CardTitle>Détail des transactions {selectedYear}</CardTitle>
            <CardDescription>
              {yearTransactions.length} transaction(s) • Transferts internes exclus
            </CardDescription>
          </CardHeader>
          <CardContent>
            {yearTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune transaction pour {selectedYear}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Artiste</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead className="text-right">Crédit</TableHead>
                    <TableHead className="text-right">Débit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yearTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>
                        {tx.categorie ? (
                          <span className="text-sm">{getCategoryLabel(tx.categorie)}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {tx.artiste_nom ? (
                          <Badge variant="outline">{tx.artiste_nom}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
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
                    </TableRow>
                  ))}
                  {/* Ligne de total */}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={5}>TOTAL</TableCell>
                    <TableCell className="text-right text-emerald-600">
                      +{formatCurrency(yearTransactions.reduce((sum, tx) => sum + tx.credit, 0))}
                    </TableCell>
                    <TableCell className="text-right text-rose-500">
                      -{formatCurrency(yearTransactions.reduce((sum, tx) => sum + tx.debit, 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
