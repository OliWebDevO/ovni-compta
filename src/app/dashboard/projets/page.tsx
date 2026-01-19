'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  ExternalLink,
  Calendar,
  Euro,
  FolderKanban,
} from 'lucide-react';
import { projets, artistes } from '@/data/mock';
import { formatCurrency, formatDate, getStatutColor } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/components/ui/page-header';
import { IllustrationProject, IllustrationWallet } from '@/components/illustrations';

export default function ProjetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProjets = projets.filter((projet) => {
    const matchesSearch =
      projet.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut =
      filterStatut === 'all' || projet.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  const projetsActifs = projets.filter((p) => p.statut === 'actif').length;
  const budgetTotal = projets.reduce((sum, p) => sum + (p.budget || 0), 0);
  const depensesTotal = projets.reduce((sum, p) => sum + (p.total_debit || 0), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <PageHeader
        title="Projets"
        description="Gérer les projets et leur budget"
        gradient="from-purple-500 via-fuchsia-500 to-pink-500"
        icon={<FolderKanban className="h-7 w-7 text-white" />}
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-white text-fuchsia-600 hover:bg-white/90 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouveau projet</DialogTitle>
              <DialogDescription>
                Créer un nouveau projet avec son budget
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom du projet</Label>
                <Input id="nom" placeholder="Ex: Le Vagabond & Le Renard" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input id="code" placeholder="Ex: LVLR" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description du projet..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date_debut">Date de début</Label>
                  <Input id="date_debut" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date_fin">Date de fin (optionnel)</Label>
                  <Input id="date_fin" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">Budget (€)</Label>
                <Input id="budget" type="number" placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="artiste">Artiste associé (optionnel)</Label>
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
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Section header - Aperçu */}
      <SectionHeader
        icon={<IllustrationWallet size={60} />}
        title="Aperçu budgétaire"
        description="Vue d'ensemble des projets"
      />

      {/* Summary Cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <div className="text-xl sm:text-2xl font-bold text-purple-700">{projets.length}</div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Projets total</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {projetsActifs}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Projets actifs</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-amber-700">{formatCurrency(budgetTotal)}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Budget total alloué</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-rose-500">
              {formatCurrency(depensesTotal)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Dépenses totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
        <CardContent className="p-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterStatut} onValueChange={setFilterStatut}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
                <SelectItem value="annule">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section header - Liste */}
      <SectionHeader
        icon={<IllustrationProject size={60} />}
        title="Liste des projets"
        description="Tous les projets enregistrés"
      />

      {/* Projects Grid */}
      {filteredProjets.length > 0 && (
      <>
      <p className="text-sm text-muted-foreground px-1">
        {filteredProjets.length} projet(s) trouvé(s)
      </p>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjets.map((projet) => {
          const budgetUsed = projet.budget
            ? ((projet.total_debit || 0) / projet.budget) * 100
            : 0;
          const budgetUsedCapped = Math.min(budgetUsed, 100);

          return (
            <Card key={projet.id} className="bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 border-purple-100/50 hover:shadow-md transition-all hover:from-purple-50 hover:to-fuchsia-50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant={getStatutColor(projet.statut)}>
                      {projet.statut === 'actif'
                        ? 'Actif'
                        : projet.statut === 'termine'
                        ? 'Terminé'
                        : 'Annulé'}
                    </Badge>
                    <CardTitle className="mt-2">{projet.nom}</CardTitle>
                    <CardDescription>{projet.code}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/projets/${projet.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {projet.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {projet.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {projet.date_debut && (
                    <span>
                      Début: {formatDate(projet.date_debut)}
                      {projet.date_fin && ` - Fin: ${formatDate(projet.date_fin)}`}
                    </span>
                  )}
                </div>

                {projet.budget && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Euro className="h-4 w-4" />
                        Budget
                      </span>
                      <span className="font-medium">
                        {formatCurrency(projet.total_debit || 0)} /{' '}
                        {formatCurrency(projet.budget)}
                      </span>
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
                    <p className="text-xs text-muted-foreground text-right">
                      {budgetUsed.toFixed(1)}% utilisé •{' '}
                      {formatCurrency(projet.reste_budget || 0)} restant
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Crédits</p>
                    <p className="font-medium text-emerald-600">
                      {formatCurrency(projet.total_credit || 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Débits</p>
                    <p className="font-medium text-rose-500">
                      {formatCurrency(projet.total_debit || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </>
      )}

      {filteredProjets.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="Aucun projet trouv\u00e9"
              description={searchTerm || filterStatut !== 'all'
                ? "Essayez de modifier vos filtres pour trouver ce que vous cherchez."
                : "Commencez par cr\u00e9er votre premier projet pour organiser vos d\u00e9penses."}
              illustration="project"
              actionLabel={!searchTerm && filterStatut === 'all' ? "Nouveau projet" : undefined}
              actionHref={!searchTerm && filterStatut === 'all' ? "#" : undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
