'use client';

import { useState, useSyncExternalStore } from 'react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Users,
} from 'lucide-react';
import { artistes } from '@/data/mock';
import { formatCurrency, getInitials, getSoldeColor } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/components/ui/page-header';
import { IllustrationArtist, IllustrationWallet } from '@/components/illustrations';

// Hook to safely detect client-side mounting without triggering cascading renders
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // Client: always mounted
    () => false  // Server: not mounted
  );
}

export default function ArtistesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactifs, setShowInactifs] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMounted = useIsMounted();

  const filteredArtistes = artistes.filter((artiste) => {
    const matchesSearch = artiste.nom
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesActif = showInactifs || artiste.actif;
    return matchesSearch && matchesActif;
  });

  const totalSolde = filteredArtistes.reduce(
    (sum, a) => sum + (a.solde || 0),
    0
  );
  const totalCredits = filteredArtistes.reduce(
    (sum, a) => sum + (a.total_credit || 0),
    0
  );
  const totalDebits = filteredArtistes.reduce(
    (sum, a) => sum + (a.total_debit || 0),
    0
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <PageHeader
        title="Artistes"
        description="Gérer les fiches des artistes et leur comptabilité"
        gradient="from-blue-500 via-indigo-500 to-violet-500"
        icon={<Users className="h-7 w-7 text-white" />}
      >
        {isMounted ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-white/90 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel artiste
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
              <DialogHeader>
                <DialogTitle>Nouvel artiste</DialogTitle>
                <DialogDescription>
                  Créer une nouvelle fiche artiste
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" placeholder="Nom de l'artiste" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (optionnel)</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telephone">Téléphone (optionnel)</Label>
                  <Input id="telephone" placeholder="+32 xxx xx xx xx" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Notes supplémentaires..." />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Annuler
                </Button>
                <Button onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-white/90 shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel artiste
          </Button>
        )}
      </PageHeader>

      {/* Section header - Aperçu */}
      <SectionHeader
        icon={<IllustrationWallet size={60} />}
        title="Aperçu financier"
        description="Vue d'ensemble des artistes"
      />

      {/* Summary Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover bg-linear-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-blue-700">{filteredArtistes.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Artistes {showInactifs ? 'total' : 'actifs'}
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-linear-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardContent className="p-4 sm:pt-6">
            <div className={`text-xl sm:text-2xl font-bold ${getSoldeColor(totalSolde)}`}>
              {formatCurrency(totalSolde)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Solde total</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-linear-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {formatCurrency(totalCredits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total crédits</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-linear-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-rose-500">
              {formatCurrency(totalDebits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total débits</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-linear-to-br from-slate-50 to-gray-50 border-slate-100">
        <CardContent className="p-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un artiste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-inactifs"
                checked={showInactifs}
                onCheckedChange={setShowInactifs}
              />
              <Label htmlFor="show-inactifs" className="text-sm">Afficher les inactifs</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section header - Liste */}
      <SectionHeader
        icon={<IllustrationArtist size={60} />}
        title="Liste des artistes"
        description="Tous les artistes enregistrés"
      />

      {/* Empty State */}
      {filteredArtistes.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="Aucun artiste trouv\u00e9"
              description={searchTerm
                ? "Essayez de modifier votre recherche pour trouver ce que vous cherchez."
                : "Commencez par ajouter votre premier artiste pour g\u00e9rer leur comptabilit\u00e9."}
              illustration="artist"
              actionLabel={!searchTerm ? "Nouvel artiste" : undefined}
              actionHref={!searchTerm ? "#" : undefined}
            />
          </CardContent>
        </Card>
      )}

      {/* Artistes List - Mobile Cards */}
      {filteredArtistes.length > 0 && (
      <div className="block lg:hidden space-y-3">
        <p className="text-sm text-muted-foreground px-1">
          {filteredArtistes.length} artiste(s) trouvé(s)
        </p>
        {filteredArtistes.map((artiste) => (
          <Link key={artiste.id} href={`/dashboard/artistes/${artiste.id}`}>
            <Card className="bg-linear-to-br from-blue-50/50 to-indigo-50/50 border-blue-100/50 hover:from-blue-50 hover:to-indigo-50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback
                      style={{
                        backgroundColor: artiste.couleur || '#e5e7eb',
                        color: '#ffffff',
                      }}
                    >
                      {getInitials(artiste.nom)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{artiste.nom}</span>
                      <Badge variant={artiste.actif ? 'default' : 'secondary'} className="shrink-0 text-xs">
                        {artiste.actif ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {artiste.nb_transactions || 0} transactions
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-semibold ${getSoldeColor(artiste.solde || 0)}`}>
                      {formatCurrency(artiste.solde || 0)}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <span className="text-emerald-600">+{formatCurrency(artiste.total_credit || 0)}</span>
                      <span className="text-rose-500">-{formatCurrency(artiste.total_debit || 0)}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      )}

      {/* Artistes Table - Desktop */}
      {filteredArtistes.length > 0 && (
      <Card className="hidden lg:block bg-linear-to-br from-indigo-50/40 to-violet-50/40 border-indigo-100/50">
        <CardHeader>
          <CardTitle>Liste des artistes</CardTitle>
          <CardDescription>
            {filteredArtistes.length} artiste(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artiste</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Crédits</TableHead>
                <TableHead className="text-right">Débits</TableHead>
                <TableHead className="text-right">Solde</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-25"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArtistes.map((artiste) => (
                <TableRow
                  key={artiste.id}
                  className="cursor-pointer hover:bg-indigo-50/50 transition-colors"
                  onClick={() => window.location.href = `/dashboard/artistes/${artiste.id}`}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          style={{
                            backgroundColor: artiste.couleur || '#e5e7eb',
                            color: '#ffffff',
                          }}
                        >
                          {getInitials(artiste.nom)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{artiste.nom}</div>
                        <div className="text-sm text-muted-foreground">
                          {artiste.nb_transactions || 0} transactions
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {artiste.email ? (
                      <span className="text-sm">{artiste.email}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-emerald-600">
                      <TrendingUp className="h-3 w-3" />
                      {formatCurrency(artiste.total_credit || 0)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 text-rose-500">
                      <TrendingDown className="h-3 w-3" />
                      {formatCurrency(artiste.total_debit || 0)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-semibold ${getSoldeColor(
                        artiste.solde || 0
                      )}`}
                    >
                      {formatCurrency(artiste.solde || 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={artiste.actif ? 'default' : 'secondary'}>
                      {artiste.actif ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
