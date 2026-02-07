'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  Plus,
  Search,
  Trash2,
  Landmark,
  Loader2,
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import {
  getAsblTransactions,
  getAsblStats,
  createAsblTransaction,
  deleteAsblTransaction,
  type AsblTransaction,
} from '@/lib/actions/caisse-ovni';
import { toast } from 'sonner';
import { CATEGORIES, type TransactionCategorie } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { EmptyState } from '@/components/ui/empty-state';
import { IllustrationWallet } from '@/components/illustrations';
import { usePermissions } from '@/hooks/usePermissions';

const getCategoryLabel = (value: string): string => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat?.label || value;
};

export default function CaisseOvniPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<AsblTransaction[]>([]);
  const [stats, setStats] = useState({
    totalCredits: 0,
    totalDebits: 0,
    solde: 0,
    transactionsCount: 0,
  });
  const { canCreate, canEdit } = usePermissions();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<'credit' | 'debit'>('credit');
  const [formMontant, setFormMontant] = useState('');
  const [formCategorie, setFormCategorie] = useState<TransactionCategorie | ''>('');

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const [txRes, statsRes] = await Promise.all([
        getAsblTransactions(),
        getAsblStats(),
      ]);

      if (txRes.data) setTransactions(txRes.data);
      if (statsRes.data) setStats(statsRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const resetForm = () => {
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormType('credit');
    setFormMontant('');
    setFormCategorie('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formDescription.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    const montant = parseFloat(formMontant);
    if (isNaN(montant) || montant <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }

    setIsSubmitting(true);

    const { error } = await createAsblTransaction({
      date: formDate,
      description: formDescription.trim(),
      credit: formType === 'credit' ? montant : 0,
      debit: formType === 'debit' ? montant : 0,
      categorie: formCategorie || null,
    });

    if (error) {
      toast.error(`Erreur: ${error}`);
      setIsSubmitting(false);
      return;
    }

    toast.success('Transaction ajoutée');
    setDialogOpen(false);
    resetForm();
    setIsSubmitting(false);

    // Refresh data
    const [txRes, statsRes] = await Promise.all([
      getAsblTransactions(),
      getAsblStats(),
    ]);
    if (txRes.data) setTransactions(txRes.data);
    if (statsRes.data) setStats(statsRes.data);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteAsblTransaction(id);
    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }
    toast.success('Transaction supprimée');
    setTransactions(transactions.filter((tx) => tx.id !== id));

    // Update stats
    const statsRes = await getAsblStats();
    if (statsRes.data) setStats(statsRes.data);
  };

  const filteredTransactions = useMemo(
    () => transactions.filter((tx) =>
      tx.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [transactions, searchTerm]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <PageHeader
        title="Caisse OVNI"
        description="Transactions de l'ASBL (non liées à un artiste ou projet)"
        gradient="from-slate-600 via-zinc-600 to-stone-600"
        icon={<Landmark className="h-7 w-7 text-white" />}
      >
        {canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-white text-slate-700 hover:bg-white/90 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Nouvelle transaction ASBL</DialogTitle>
                  <DialogDescription>
                    Ajouter une transaction à la caisse de l'ASBL
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Date */}
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

                  {/* Description */}
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Description de la transaction..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Type (crédit/débit) */}
                  <div className="grid gap-2">
                    <Label>Type</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={formType === 'credit' ? 'default' : 'outline'}
                        className={formType === 'credit' ? 'flex-1 bg-emerald-600 hover:bg-emerald-700' : 'flex-1'}
                        onClick={() => setFormType('credit')}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Crédit
                      </Button>
                      <Button
                        type="button"
                        variant={formType === 'debit' ? 'default' : 'outline'}
                        className={formType === 'debit' ? 'flex-1 bg-rose-600 hover:bg-rose-700' : 'flex-1'}
                        onClick={() => setFormType('debit')}
                      >
                        <TrendingDown className="mr-2 h-4 w-4" />
                        Débit
                      </Button>
                    </div>
                  </div>

                  {/* Montant */}
                  <div className="grid gap-2">
                    <Label htmlFor="montant">Montant (€)</Label>
                    <Input
                      id="montant"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={formMontant}
                      onChange={(e) => setFormMontant(e.target.value)}
                      required
                    />
                  </div>

                  {/* Catégorie */}
                  <div className="grid gap-2">
                    <Label>Catégorie (optionnel)</Label>
                    <Select
                      value={formCategorie}
                      onValueChange={(v) => setFormCategorie(v as TransactionCategorie)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.filter(c => c.value !== 'transfert_interne').map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-slate-700 hover:bg-slate-800"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ajout...
                      </>
                    ) : (
                      'Ajouter'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Card className="card-hover bg-gradient-to-br from-slate-50 to-zinc-50 border-slate-200">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-slate-500" />
              <span className="text-lg sm:text-2xl font-bold text-slate-700">
                {stats.transactionsCount}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Transactions</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className={`text-lg sm:text-2xl font-bold ${stats.solde >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {formatCurrency(stats.solde)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Solde</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="text-lg sm:text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.totalCredits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Crédits</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="text-lg sm:text-2xl font-bold text-rose-500">
              {formatCurrency(stats.totalDebits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Débits</p>
          </CardContent>
        </Card>
      </div>

      {/* Section header */}
      <SectionHeader
        icon={<IllustrationWallet size={60} />}
        title="Transactions ASBL"
        description="Mouvements financiers de la caisse commune"
      />

      {/* Search */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="Aucune transaction trouvée"
              description={
                searchTerm
                  ? 'Essayez de modifier votre recherche.'
                  : "La caisse ASBL ne contient pas encore de transactions."
              }
              illustration="document"
            />
          </CardContent>
        </Card>
      )}

      {/* Transactions List - Mobile */}
      {filteredTransactions.length > 0 && (
        <div className="block lg:hidden space-y-3">
          <p className="text-sm text-muted-foreground px-1">
            {filteredTransactions.length} transaction(s)
          </p>
          <TooltipProvider>
            {filteredTransactions.map((tx) => (
              <Card key={tx.id} className="bg-gradient-to-br from-slate-50/50 to-zinc-50/50 border-slate-100/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block">
                        {formatDate(tx.date)}
                      </span>
                      {tx.categorie && (
                        <Badge variant="outline" className="text-xs text-muted-foreground mt-2">
                          {getCategoryLabel(tx.categorie)}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {tx.credit > 0 ? (
                        <span className="text-emerald-600 font-semibold text-base">
                          +{formatCurrency(tx.credit)}
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold text-base">
                          -{formatCurrency(tx.debit)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 mt-3">
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-sm text-foreground flex-1">{tx.description}</p>
                      {canEdit && (
                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-slate-600 hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Supprimer</TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette transaction ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(tx.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
        <Card className="hidden lg:block bg-gradient-to-br from-slate-50/40 to-zinc-50/40 border-slate-100/50">
          <CardHeader>
            <CardTitle>Liste des transactions</CardTitle>
            <CardDescription>{filteredTransactions.length} transaction(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Crédit</TableHead>
                    <TableHead className="text-right">Débit</TableHead>
                    {canEdit && <TableHead className="w-[80px] text-center">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">{formatDate(tx.date)}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>
                        {tx.categorie ? (
                          <Badge variant="outline" className="text-muted-foreground">
                            {getCategoryLabel(tx.categorie)}
                          </Badge>
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
                        <TableCell className="text-center">
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 text-slate-600 hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Supprimer</TooltipContent>
                            </Tooltip>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cette transaction ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(tx.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
