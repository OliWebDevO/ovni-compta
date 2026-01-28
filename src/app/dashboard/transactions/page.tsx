'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Download,
  Filter,
  Receipt,
  Loader2,
} from 'lucide-react';
import { getTransactions, deleteTransaction } from '@/lib/actions/transactions';
import { toast } from 'sonner';
import { getArtistes } from '@/lib/actions/artistes';
import { getProjets } from '@/lib/actions/projets';
import type { ArtisteWithStats, ProjetWithStats, TransactionWithRelations } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportTransactionsToCSV } from '@/lib/export';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/components/ui/page-header';
import { IllustrationWallet, IllustrationDocuments } from '@/components/illustrations';
import { usePermissions } from '@/hooks/usePermissions';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArtiste, setFilterArtiste] = useState<string>('all');
  const [filterProjet, setFilterProjet] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>([]);
  const [artistes, setArtistes] = useState<ArtisteWithStats[]>([]);
  const [projets, setProjets] = useState<ProjetWithStats[]>([]);
  const { canEdit, canCreate } = usePermissions();

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const [txRes, artistesRes, projetsRes] = await Promise.all([
        getTransactions(),
        getArtistes(),
        getProjets(),
      ]);

      if (txRes.data) setTransactions(txRes.data);
      if (artistesRes.data) setArtistes(artistesRes.data);
      if (projetsRes.data) setProjets(projetsRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await deleteTransaction(id);
    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }
    toast.success('Transaction supprimée');
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesArtiste =
      filterArtiste === 'all' || tx.artiste_id === filterArtiste;
    const matchesProjet =
      filterProjet === 'all' || tx.projet_id === filterProjet;
    return matchesSearch && matchesArtiste && matchesProjet;
  });

  const totalCredits = filteredTransactions.reduce((sum, tx) => sum + tx.credit, 0);
  const totalDebits = filteredTransactions.reduce((sum, tx) => sum + tx.debit, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <PageHeader
        title="Transactions"
        description="Gérer toutes les entrées et sorties comptables"
        gradient="from-emerald-500 via-teal-500 to-cyan-500"
        icon={<Receipt className="h-7 w-7 text-white" />}
      >
        <Button
          variant="outline"
          className="w-full sm:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-lg"
          onClick={() => exportTransactionsToCSV(filteredTransactions, 'transactions')}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
        {canCreate && (
          <Button asChild className="w-full sm:w-auto bg-white text-teal-600 hover:bg-white/90 shadow-lg">
            <Link href="/dashboard/transactions/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle transaction
            </Link>
          </Button>
        )}
      </PageHeader>

      {/* Section header - Résumé */}
      <SectionHeader
        icon={<IllustrationWallet size={60} />}
        title="Résumé financier"
        description="Aperçu des crédits et débits"
      />

      {/* Filters */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-100">
              <Filter className="h-4 w-4 text-slate-600" />
            </div>
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select value={filterArtiste} onValueChange={setFilterArtiste}>
                <SelectTrigger>
                  <SelectValue placeholder="Artiste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les artistes</SelectItem>
                  {artistes.map((artiste) => (
                    <SelectItem key={artiste.id} value={artiste.id}>
                      {artiste.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterProjet} onValueChange={setFilterProjet}>
                <SelectTrigger>
                  <SelectValue placeholder="Projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les projets</SelectItem>
                  {projets.map((projet) => (
                    <SelectItem key={projet.id} value={projet.id}>
                      {projet.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="text-lg sm:text-2xl font-bold text-emerald-600">
              {formatCurrency(totalCredits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Crédits</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="text-lg sm:text-2xl font-bold text-rose-500">
              {formatCurrency(totalDebits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Débits</p>
          </CardContent>
        </Card>
        <Card className="card-hover col-span-2 sm:col-span-1 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className={`text-lg sm:text-2xl font-bold ${totalCredits - totalDebits >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {formatCurrency(totalCredits - totalDebits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Solde</p>
          </CardContent>
        </Card>
      </div>

      {/* Section header - Liste */}
      <SectionHeader
        icon={<IllustrationDocuments size={60} />}
        title="Liste des transactions"
        description="Historique complet de vos mouvements"
      />

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="Aucune transaction trouvée"
              description={searchTerm || filterArtiste !== 'all' || filterProjet !== 'all'
                ? "Essayez de modifier vos filtres pour trouver ce que vous cherchez."
                : "Commencez par ajouter votre premi\u00e8re transaction pour suivre vos finances."}
              illustration="document"
              actionLabel={!searchTerm && filterArtiste === 'all' && filterProjet === 'all' ? "Nouvelle transaction" : undefined}
              actionHref={!searchTerm && filterArtiste === 'all' && filterProjet === 'all' ? "#" : undefined}
            />
          </CardContent>
        </Card>
      )}

      {/* Transactions List - Mobile Cards */}
      {filteredTransactions.length > 0 && (
      <div className="block lg:hidden space-y-3">
        <p className="text-sm text-muted-foreground px-1">
          {filteredTransactions.length} transaction(s) trouvée(s)
        </p>
        <TooltipProvider>
          {filteredTransactions.map((tx) => (
            <Card key={tx.id} className="bg-gradient-to-br from-teal-50/50 to-cyan-50/50 border-teal-100/50">
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
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right shrink-0 mr-2">
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
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                              asChild
                            >
                              <Link href={`/dashboard/transactions/${tx.id}/edit`}>
                                <Pencil className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Modifier</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                              onClick={() => handleDelete(tx.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Supprimer</TooltipContent>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TooltipProvider>
      </div>
      )}

      {/* Transactions Table - Desktop */}
      {filteredTransactions.length > 0 && (
      <Card className="hidden lg:block bg-gradient-to-br from-teal-50/40 to-cyan-50/40 border-teal-100/50">
        <CardHeader>
          <CardTitle>Liste des transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Artiste</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead className="text-right">Crédit</TableHead>
                  <TableHead className="text-right">Débit</TableHead>
                  {canEdit && <TableHead className="w-[100px] text-center">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-teal-50/50 transition-colors"
                  >
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
                          {formatCurrency(tx.credit)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.debit > 0 ? (
                        <span className="text-rose-500 font-medium">
                          {formatCurrency(tx.debit)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                                asChild
                              >
                                <Link href={`/dashboard/transactions/${tx.id}/edit`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Modifier</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                onClick={() => handleDelete(tx.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Supprimer</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
