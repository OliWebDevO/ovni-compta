'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  FileText,
  Download,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronRight,
  Upload,
  Building2,
  Users,
  FolderKanban,
  Calendar,
  File,
} from 'lucide-react';
import {
  getFactures,
  getFacturesStats,
  createFacture,
  deleteFacture,
  getFactureDownloadUrl,
  uploadFactureFile,
} from '@/lib/actions/factures';
import { getArtistes } from '@/lib/actions/artistes';
import { getProjets } from '@/lib/actions/projets';
import { toast } from 'sonner';
import type { ArtisteWithStats, ProjetWithStats } from '@/types/database';
import type { FactureWithRelations, TypeLiaison } from '@/types';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';

export default function FacturesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [factures, setFactures] = useState<FactureWithRelations[]>([]);
  const [artistes, setArtistes] = useState<ArtisteWithStats[]>([]);
  const [projets, setProjets] = useState<ProjetWithStats[]>([]);
  const [stats, setStats] = useState({ total: 0, byArtiste: 0, byProjet: 0, byAsbl: 0 });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    asbl: true,
  });
  const { canCreate, canEdit } = usePermissions();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formTypeLiaison, setFormTypeLiaison] = useState<TypeLiaison>('asbl');
  const [formArtisteId, setFormArtisteId] = useState<string>('');
  const [formProjetId, setFormProjetId] = useState<string>('');
  const [formFile, setFormFile] = useState<File | null>(null);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const [facturesRes, artistesRes, projetsRes, statsRes] = await Promise.all([
        getFactures(),
        getArtistes(),
        getProjets(),
        getFacturesStats(),
      ]);

      if (facturesRes.data) setFactures(facturesRes.data);
      if (artistesRes.data) setArtistes(artistesRes.data);
      if (projetsRes.data) setProjets(projetsRes.data);
      if (statsRes.data) setStats(statsRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Seuls les fichiers PDF sont acceptés');
        return;
      }
      setFormFile(file);
    }
  };

  const resetForm = () => {
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDescription('');
    setFormTypeLiaison('asbl');
    setFormArtisteId('');
    setFormProjetId('');
    setFormFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formFile) {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    if (!formDescription.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    if (formTypeLiaison === 'artiste' && !formArtisteId) {
      toast.error('Veuillez sélectionner un artiste');
      return;
    }

    if (formTypeLiaison === 'projet' && !formProjetId) {
      toast.error('Veuillez sélectionner un projet');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload file
      const formData = new FormData();
      formData.append('file', formFile);

      const uploadRes = await uploadFactureFile(formData);
      if (uploadRes.error || !uploadRes.data) {
        toast.error(`Erreur upload: ${uploadRes.error}`);
        setIsSubmitting(false);
        return;
      }

      // 2. Create facture entry
      const createRes = await createFacture({
        date: formDate,
        description: formDescription.trim(),
        type_liaison: formTypeLiaison,
        artiste_id: formTypeLiaison === 'artiste' ? formArtisteId : null,
        projet_id: formTypeLiaison === 'projet' ? formProjetId : null,
        fichier_nom: formFile.name,
        fichier_path: uploadRes.data.path,
        fichier_size: uploadRes.data.size,
      });

      if (createRes.error) {
        toast.error(`Erreur: ${createRes.error}`);
        setIsSubmitting(false);
        return;
      }

      toast.success('Facture ajoutée avec succès');
      setDialogOpen(false);
      resetForm();

      // Refresh data
      const [facturesRes, statsRes] = await Promise.all([
        getFactures(),
        getFacturesStats(),
      ]);
      if (facturesRes.data) setFactures(facturesRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteFacture(id);
    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }
    toast.success('Facture supprimée');
    setFactures(factures.filter((f) => f.id !== id));

    // Update stats
    const statsRes = await getFacturesStats();
    if (statsRes.data) setStats(statsRes.data);
  };

  const handleDownload = async (id: string) => {
    const { data, error } = await getFactureDownloadUrl(id);
    if (error || !data) {
      toast.error(`Erreur: ${error || 'Impossible de générer le lien'}`);
      return;
    }
    window.open(data.url, '_blank');
  };

  // Group factures by entity
  const facturesAsbl = factures.filter((f) => f.type_liaison === 'asbl');

  const facturesByArtiste = artistes
    .map((artiste) => ({
      artiste,
      factures: factures.filter((f) => f.artiste_id === artiste.id),
    }))
    .filter((group) => group.factures.length > 0);

  const facturesByProjet = projets
    .map((projet) => ({
      projet,
      factures: factures.filter((f) => f.projet_id === projet.id),
    }))
    .filter((group) => group.factures.length > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <PageHeader
        title="Factures"
        description="Gérez les factures PDF liées aux artistes, projets ou à l'ASBL"
        gradient="from-teal-500 via-cyan-500 to-emerald-500"
        icon={<FileText className="h-7 w-7 text-white" />}
      >
        {canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-white text-teal-600 hover:bg-white/90 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle facture
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Ajouter une facture</DialogTitle>
                  <DialogDescription>
                    Uploadez un fichier PDF et associez-le à un artiste, un projet ou l'ASBL.
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
                    <Textarea
                      id="description"
                      placeholder="Description de la facture..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Type de liaison */}
                  <div className="grid gap-2">
                    <Label>Lier à</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={formTypeLiaison === 'asbl' ? 'default' : 'outline'}
                        className={cn(
                          'flex-1',
                          formTypeLiaison === 'asbl' && 'bg-teal-600 hover:bg-teal-700'
                        )}
                        onClick={() => setFormTypeLiaison('asbl')}
                      >
                        <Building2 className="mr-2 h-4 w-4" />
                        ASBL
                      </Button>
                      <Button
                        type="button"
                        variant={formTypeLiaison === 'artiste' ? 'default' : 'outline'}
                        className={cn(
                          'flex-1',
                          formTypeLiaison === 'artiste' && 'bg-blue-600 hover:bg-blue-700'
                        )}
                        onClick={() => setFormTypeLiaison('artiste')}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Artiste
                      </Button>
                      <Button
                        type="button"
                        variant={formTypeLiaison === 'projet' ? 'default' : 'outline'}
                        className={cn(
                          'flex-1',
                          formTypeLiaison === 'projet' && 'bg-purple-600 hover:bg-purple-700'
                        )}
                        onClick={() => setFormTypeLiaison('projet')}
                      >
                        <FolderKanban className="mr-2 h-4 w-4" />
                        Projet
                      </Button>
                    </div>
                  </div>

                  {/* Select artiste */}
                  {formTypeLiaison === 'artiste' && (
                    <div className="grid gap-2">
                      <Label>Artiste</Label>
                      <Select value={formArtisteId} onValueChange={setFormArtisteId}>
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
                  )}

                  {/* Select projet */}
                  {formTypeLiaison === 'projet' && (
                    <div className="grid gap-2">
                      <Label>Projet</Label>
                      <Select value={formProjetId} onValueChange={setFormProjetId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un projet" />
                        </SelectTrigger>
                        <SelectContent>
                          {projets.map((projet) => (
                            <SelectItem key={projet.id} value={projet.id}>
                              {projet.code} - {projet.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* File upload */}
                  <div className="grid gap-2">
                    <Label htmlFor="file">Fichier PDF</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                    </div>
                    {formFile && (
                      <p className="text-sm text-muted-foreground">
                        Fichier sélectionné: {formFile.name} ({formatFileSize(formFile.size)})
                      </p>
                    )}
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
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Ajouter la facture
                      </>
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
        <Card className="card-hover bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="text-lg sm:text-2xl font-bold text-teal-600">{stats.total}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Total factures</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500" />
              <span className="text-lg sm:text-2xl font-bold text-slate-600">{stats.byAsbl}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">ASBL</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-lg sm:text-2xl font-bold text-blue-600">{stats.byArtiste}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Artistes</p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-purple-500" />
              <span className="text-lg sm:text-2xl font-bold text-purple-600">{stats.byProjet}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Projets</p>
          </CardContent>
        </Card>
      </div>

      {/* Factures ASBL */}
      <Collapsible open={openSections.asbl ?? true} onOpenChange={() => toggleSection('asbl')}>
        <Card className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-slate-100">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-slate-50/50 transition-colors rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 text-white shadow">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">ASBL</CardTitle>
                    <CardDescription>{facturesAsbl.length} facture(s)</CardDescription>
                  </div>
                </div>
                {openSections.asbl ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              {facturesAsbl.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune facture ASBL
                </p>
              ) : (
                <div className="space-y-2">
                  {facturesAsbl.map((facture) => (
                    <FactureItem
                      key={facture.id}
                      facture={facture}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                      canEdit={canEdit}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Factures par Artiste */}
      {facturesByArtiste.map(({ artiste, factures: artisteFactures }) => (
        <Collapsible
          key={artiste.id}
          open={openSections[artiste.id] ?? false}
          onOpenChange={() => toggleSection(artiste.id)}
        >
          <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-100">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-blue-50/50 transition-colors rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg text-white shadow"
                      style={{
                        background: artiste.couleur
                          ? artiste.couleur
                          : 'linear-gradient(to bottom right, rgb(59 130 246), rgb(99 102 241))',
                      }}
                    >
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{artiste.nom}</CardTitle>
                      <CardDescription>{artisteFactures.length} facture(s)</CardDescription>
                    </div>
                  </div>
                  {(openSections[artiste.id] ?? false) ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {artisteFactures.map((facture) => (
                    <FactureItem
                      key={facture.id}
                      facture={facture}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                      canEdit={canEdit}
                    />
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}

      {/* Factures par Projet */}
      {facturesByProjet.map(({ projet, factures: projetFactures }) => (
        <Collapsible
          key={projet.id}
          open={openSections[projet.id] ?? false}
          onOpenChange={() => toggleSection(projet.id)}
        >
          <Card className="bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 border-purple-100">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-purple-50/50 transition-colors rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        <Badge variant="secondary" className="mr-2">
                          {projet.code}
                        </Badge>
                        {projet.nom}
                      </CardTitle>
                      <CardDescription>{projetFactures.length} facture(s)</CardDescription>
                    </div>
                  </div>
                  {(openSections[projet.id] ?? false) ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {projetFactures.map((facture) => (
                    <FactureItem
                      key={facture.id}
                      facture={facture}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                      canEdit={canEdit}
                    />
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}

      {/* Empty state */}
      {factures.length === 0 && (
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Aucune facture enregistrée
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par ajouter votre première facture PDF.
            </p>
            {canCreate && (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une facture
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant pour afficher une facture
interface FactureItemProps {
  facture: FactureWithRelations;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

function FactureItem({ facture, onDownload, onDelete, canEdit }: FactureItemProps) {
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-white/70 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 shrink-0">
          <File className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{facture.description}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(facture.date)}
            </span>
            <span className="truncate max-w-[150px]">{facture.fichier_nom}</span>
            <span>{formatFileSize(facture.fichier_size)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <TooltipProvider>
        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-slate-600 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50"
                onClick={() => onDownload(facture.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Télécharger</TooltipContent>
          </Tooltip>

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
                  <AlertDialogTitle>Supprimer cette facture ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Le fichier PDF sera également supprimé.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(facture.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
