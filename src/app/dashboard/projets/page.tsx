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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  ChevronRight,
  Calendar,
  Euro,
  FolderKanban,
  Loader2,
} from 'lucide-react';
import { getProjets, createProjet } from '@/lib/actions/projets';
import { toast } from 'sonner';
import { getArtistes } from '@/lib/actions/artistes';
import type { ArtisteWithStats, ProjetWithStats } from '@/types/database';
import { formatCurrency, formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/components/ui/page-header';
import { IllustrationProject, IllustrationWallet } from '@/components/illustrations';
import { usePermissions } from '@/hooks/usePermissions';

export default function ProjetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [projets, setProjets] = useState<ProjetWithStats[]>([]);
  const [artistes, setArtistes] = useState<ArtisteWithStats[]>([]);
  const { canCreate } = usePermissions();

  // Form state
  const [formNom, setFormNom] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDateDebut, setFormDateDebut] = useState('');
  const [formDateFin, setFormDateFin] = useState('');
  const [formBudget, setFormBudget] = useState('');

  const resetForm = () => {
    setFormNom('');
    setFormCode('');
    setFormDescription('');
    setFormDateDebut('');
    setFormDateFin('');
    setFormBudget('');
  };

  const handleCreateProjet = async () => {
    if (!formNom.trim()) {
      toast.error('Le nom est requis');
      return;
    }
    if (!formCode.trim()) {
      toast.error('Le code est requis');
      return;
    }

    setIsCreating(true);
    const { data, error } = await createProjet({
      nom: formNom.trim(),
      code: formCode.trim().toUpperCase(),
      description: formDescription.trim() || null,
      date_debut: formDateDebut || null,
      date_fin: formDateFin || null,
      budget: formBudget ? parseFloat(formBudget) : null,
    });

    if (error) {
      toast.error(`Erreur: ${error}`);
      setIsCreating(false);
      return;
    }

    toast.success('Projet créé avec succès');
    setIsDialogOpen(false);
    resetForm();
    setIsCreating(false);

    // Refresh list
    const { data: refreshed } = await getProjets();
    if (refreshed) setProjets(refreshed);
  };

  // Fetch data and prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    async function fetchData() {
      const [projetsRes, artistesRes] = await Promise.all([
        getProjets(),
        getArtistes(),
      ]);

      if (projetsRes.data) setProjets(projetsRes.data);
      if (artistesRes.data) setArtistes(artistesRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const filteredProjets = projets.filter((projet) => {
    const matchesSearch =
      projet.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut =
      filterStatut === 'all' || projet.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  const totalCredits = projets.reduce((sum, p) => sum + (p.total_credit || 0), 0);
  const totalDebits = projets.reduce((sum, p) => sum + (p.total_debit || 0), 0);
  const solde = totalCredits - totalDebits;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <PageHeader
        title="Projets"
        description="Gérer les projets et leur budget"
        gradient="from-purple-500 via-fuchsia-500 to-pink-500"
        icon={<FolderKanban className="h-7 w-7 text-white" />}
      >
        {canCreate && (
          isMounted ? (
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
                    <Label htmlFor="nom">Nom du projet *</Label>
                    <Input
                      id="nom"
                      placeholder="Ex: Le Vagabond & Le Renard"
                      value={formNom}
                      onChange={(e) => setFormNom(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Code *</Label>
                    <Input
                      id="code"
                      placeholder="Ex: LVLR"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      placeholder="Description du projet..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date_debut">Date de début</Label>
                      <Input
                        id="date_debut"
                        type="date"
                        value={formDateDebut}
                        onChange={(e) => setFormDateDebut(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date_fin">Date de fin</Label>
                      <Input
                        id="date_fin"
                        type="date"
                        value={formDateFin}
                        onChange={(e) => setFormDateFin(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget (€)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    className="w-full sm:w-auto"
                    disabled={isCreating}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateProjet}
                    className="w-full sm:w-auto"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      'Créer'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button className="w-full sm:w-auto bg-white text-fuchsia-600 hover:bg-white/90 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Button>
          )
        )}
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
        <Card className="card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardContent className="p-4 sm:pt-6">
            <div className={`text-xl sm:text-2xl font-bold ${solde >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {formatCurrency(solde)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Solde</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {formatCurrency(totalCredits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Crédits</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-100">
          <CardContent className="p-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold text-rose-500">
              {formatCurrency(totalDebits)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Débits</p>
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
            {isMounted ? (
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
            ) : (
              <div className="w-full sm:w-[180px] h-10 bg-background border rounded-md" />
            )}
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
            <Link key={projet.id} href={`/dashboard/projets/${projet.id}`} className="block">
              <Card className="bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 border-purple-100/50 hover:shadow-md transition-all hover:from-purple-50 hover:to-fuchsia-50 cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{projet.nom}</CardTitle>
                      <CardDescription>{projet.code}</CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
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
            </Link>
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
