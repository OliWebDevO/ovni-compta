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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Download,
  Filter,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { transactions, artistes, projets, CATEGORIES } from '@/data/mock';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportTransactionsToCSV } from '@/lib/export';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/components/ui/page-header';
import { IllustrationWallet, IllustrationDocuments } from '@/components/illustrations';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArtiste, setFilterArtiste] = useState<string>('all');
  const [filterProjet, setFilterProjet] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch with Radix UI components
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        {isMounted ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-white text-teal-600 hover:bg-white/90 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvelle transaction</DialogTitle>
                <DialogDescription>
                  Ajouter une nouvelle entrée ou sortie comptable
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Description de la transaction" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="credit">Crédit (€)</Label>
                    <Input id="credit" type="number" placeholder="0.00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="debit">Débit (€)</Label>
                    <Input id="debit" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="artiste">Artiste (optionnel)</Label>
                  <Select>
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
                  <Select>
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
                  <Select>
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
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Annuler
                </Button>
                <Button onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="w-full sm:w-auto bg-white text-teal-600 hover:bg-white/90 shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle transaction
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
      <div className="grid gap-3 grid-cols-3">
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
        <Card className="card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
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
        {filteredTransactions.map((tx) => (
          isMounted ? (
            <DropdownMenu key={tx.id}>
              <DropdownMenuTrigger asChild>
                <Card className="bg-gradient-to-br from-teal-50/50 to-cyan-50/50 border-teal-100/50 cursor-pointer hover:from-teal-50 hover:to-cyan-50 hover:shadow-sm transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                          {tx.artiste && (
                            <Badge variant="outline" className="text-xs">{tx.artiste.nom}</Badge>
                          )}
                          {tx.projet && (
                            <Badge variant="secondary" className="text-xs">{tx.projet.code}</Badge>
                          )}
                        </div>
                        <p className="font-medium mt-1 text-sm">{tx.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
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
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem className="text-rose-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Card key={tx.id} className="bg-gradient-to-br from-teal-50/50 to-cyan-50/50 border-teal-100/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                      {tx.artiste && (
                        <Badge variant="outline" className="text-xs">{tx.artiste.nom}</Badge>
                      )}
                      {tx.projet && (
                        <Badge variant="secondary" className="text-xs">{tx.projet.code}</Badge>
                      )}
                    </div>
                    <p className="font-medium mt-1 text-sm">{tx.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
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
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ))}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Artiste</TableHead>
                <TableHead>Projet</TableHead>
                <TableHead className="text-right">Crédit</TableHead>
                <TableHead className="text-right">Débit</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="cursor-pointer hover:bg-teal-50/50 transition-colors"
                  onClick={() => setOpenDropdownId(openDropdownId === tx.id ? null : tx.id)}
                >
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
                  <TableCell>
                    {isMounted ? (
                      <DropdownMenu
                        open={openDropdownId === tx.id}
                        onOpenChange={(open) => setOpenDropdownId(open ? tx.id : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <div className="flex items-center justify-center">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-500">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div className="flex items-center justify-center">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
