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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  BookOpen,
  ExternalLink,
  Star,
  Tag,
  Loader2,
  ArrowLeft,
  FileText,
  Scale,
  Calculator,
  Music,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import {
  getRessources,
  createRessource,
  updateRessource,
  deleteRessource,
} from '@/lib/actions/ressources';
import type { Ressource, RessourceCategorie } from '@/types';
import { RESSOURCE_CATEGORIES } from '@/types';

const getCategoryIcon = (categorie: RessourceCategorie) => {
  switch (categorie) {
    case 'guide':
      return <FileText className="h-4 w-4" />;
    case 'juridique':
      return <Scale className="h-4 w-4" />;
    case 'comptabilite':
      return <Calculator className="h-4 w-4" />;
    case 'artistes':
      return <Music className="h-4 w-4" />;
    case 'liens':
      return <LinkIcon className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};

const getCategoryColor = (categorie: RessourceCategorie) => {
  switch (categorie) {
    case 'guide':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'juridique':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'comptabilite':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'artistes':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'liens':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getCategoryLabel = (categorie: RessourceCategorie) => {
  return RESSOURCE_CATEGORIES.find((c) => c.value === categorie)?.label || categorie;
};

interface RessourceFormData {
  titre: string;
  description: string;
  contenu: string;
  categorie: RessourceCategorie;
  url: string;
  tags: string[];
  important: boolean;
}

const emptyFormData: RessourceFormData = {
  titre: '',
  description: '',
  contenu: '',
  categorie: 'guide',
  url: '',
  tags: [],
  important: false,
};

export default function AdminRessourcesPage() {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState<string>('all');

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRessource, setEditingRessource] = useState<Ressource | null>(null);
  const [deletingRessource, setDeletingRessource] = useState<Ressource | null>(null);

  // Form state
  const [formData, setFormData] = useState<RessourceFormData>(emptyFormData);
  const [newTag, setNewTag] = useState('');

  // Fetch ressources
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await getRessources();
      if (error) {
        toast.error('Erreur lors du chargement des ressources');
      } else if (data) {
        setRessources(data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Filter ressources
  const filteredRessources = ressources.filter((r) => {
    const matchesSearch =
      r.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategorie = filterCategorie === 'all' || r.categorie === filterCategorie;
    return matchesSearch && matchesCategorie;
  });

  // Group by category for display
  const ressourcesByCategory = RESSOURCE_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.value] = filteredRessources.filter((r) => r.categorie === cat.value);
      return acc;
    },
    {} as Record<RessourceCategorie, Ressource[]>
  );

  // Open create dialog
  const handleCreate = () => {
    setEditingRessource(null);
    setFormData(emptyFormData);
    setIsFormDialogOpen(true);
  };

  // Open edit dialog
  const handleEdit = (ressource: Ressource) => {
    setEditingRessource(ressource);
    setFormData({
      titre: ressource.titre,
      description: ressource.description,
      contenu: ressource.contenu || '',
      categorie: ressource.categorie,
      url: ressource.url || '',
      tags: ressource.tags,
      important: ressource.important,
    });
    setIsFormDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (ressource: Ressource) => {
    setDeletingRessource(ressource);
    setIsDeleteDialogOpen(true);
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    if (!formData.titre || !formData.description || !formData.categorie) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingRessource) {
        // Update
        const { success, error } = await updateRessource(editingRessource.id, {
          titre: formData.titre,
          description: formData.description,
          contenu: formData.contenu || null,
          categorie: formData.categorie,
          url: formData.url || null,
          tags: formData.tags,
          important: formData.important,
        });

        if (error) {
          toast.error(`Erreur: ${error}`);
        } else {
          toast.success('Ressource mise à jour');
          // Refresh list
          const { data } = await getRessources();
          if (data) setRessources(data);
          setIsFormDialogOpen(false);
        }
      } else {
        // Create
        const { data, error } = await createRessource({
          titre: formData.titre,
          description: formData.description,
          contenu: formData.contenu || null,
          categorie: formData.categorie,
          url: formData.url || null,
          tags: formData.tags,
          important: formData.important,
        });

        if (error) {
          toast.error(`Erreur: ${error}`);
        } else if (data) {
          toast.success('Ressource créée');
          // Refresh list
          const { data: refreshed } = await getRessources();
          if (refreshed) setRessources(refreshed);
          setIsFormDialogOpen(false);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deletingRessource) return;

    setIsSubmitting(true);
    try {
      const { success, error } = await deleteRessource(deletingRessource.id);

      if (error) {
        toast.error(`Erreur: ${error}`);
      } else {
        toast.success('Ressource supprimée');
        setRessources((prev) => prev.filter((r) => r.id !== deletingRessource.id));
        setIsDeleteDialogOpen(false);
        setDeletingRessource(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add tag
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {/* Header */}
      <PageHeader
        title="Gestion des ressources"
        description="Créer, modifier et supprimer les ressources ASBL"
        gradient="from-teal-600 via-emerald-600 to-green-600"
        icon={<BookOpen className="h-7 w-7 text-white" />}
      />

      {/* Back link */}
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à l&apos;administration
      </Link>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {RESSOURCE_CATEGORIES.map((cat) => (
          <Card key={cat.value} className="card-hover">
            <CardContent className="p-3 sm:pt-4 sm:p-4">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 sm:p-2 rounded-lg ${getCategoryColor(cat.value)}`}>
                  {getCategoryIcon(cat.value)}
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold">
                    {ressources.filter((r) => r.categorie === cat.value).length}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{cat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Card className="card-hover bg-gradient-to-br from-slate-50 to-slate-100">
          <CardContent className="p-3 sm:pt-4 sm:p-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-slate-200">
                <Star className="h-4 w-4 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">
                  {ressources.filter((r) => r.important).length}
                </p>
                <p className="text-xs text-muted-foreground truncate">Importants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">Toutes les ressources</CardTitle>
              <CardDescription>
                {ressources.length} ressource(s) au total
              </CardDescription>
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle ressource
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategorie} onValueChange={setFilterCategorie}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {RESSOURCE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(cat.value)}
                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Tabs defaultValue="all" className="space-y-4 min-w-0">
            <div className="overflow-x-auto pb-1">
              <TabsList className="inline-flex w-max">
                <TabsTrigger value="all" className="text-xs sm:text-sm whitespace-nowrap">
                  Tout ({filteredRessources.length})
                </TabsTrigger>
                {RESSOURCE_CATEGORIES.map((cat) => (
                  <TabsTrigger key={cat.value} value={cat.value} className="text-xs sm:text-sm whitespace-nowrap">
                    {cat.label} ({ressourcesByCategory[cat.value]?.length || 0})
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="all">
              <RessourceTable
                ressources={filteredRessources}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </TabsContent>

            {RESSOURCE_CATEGORIES.map((cat) => (
              <TabsContent key={cat.value} value={cat.value}>
                <RessourceTable
                  ressources={ressourcesByCategory[cat.value] || []}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRessource ? 'Modifier la ressource' : 'Nouvelle ressource'}
            </DialogTitle>
            <DialogDescription>
              {editingRessource
                ? 'Modifiez les informations de la ressource'
                : 'Créez une nouvelle ressource pour les membres de l\'ASBL'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Titre */}
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData((prev) => ({ ...prev, titre: e.target.value }))}
                placeholder="Ex: Guide de création d'ASBL"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description courte *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Résumé en une ou deux phrases..."
                rows={2}
              />
            </div>

            {/* Catégorie */}
            <div className="grid gap-2">
              <Label>Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value: RessourceCategorie) =>
                  setFormData((prev) => ({ ...prev, categorie: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESSOURCE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(cat.value)}
                        <div>
                          <span className="font-medium">{cat.label}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            - {cat.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* URL (pour liens) */}
            <div className="grid gap-2">
              <Label htmlFor="url">URL externe (optionnel)</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            {/* Contenu Markdown */}
            <div className="grid gap-2">
              <Label htmlFor="contenu">
                Contenu (Markdown) {formData.categorie !== 'liens' && '- optionnel'}
              </Label>
              <Textarea
                id="contenu"
                value={formData.contenu}
                onChange={(e) => setFormData((prev) => ({ ...prev, contenu: e.target.value }))}
                placeholder="## Titre&#10;&#10;Contenu en markdown...&#10;&#10;- Point 1&#10;- Point 2"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supporte la syntaxe Markdown : ## titres, **gras**, *italique*, - listes, etc.
              </p>
            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ajouter un tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Important */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="important">Marquer comme important</Label>
                <p className="text-sm text-muted-foreground">
                  Les ressources importantes sont mises en avant dans la liste
                </p>
              </div>
              <Switch
                id="important"
                checked={formData.important}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, important: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingRessource ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette ressource ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer la ressource &quot;{deletingRessource?.titre}&quot;.
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Sous-composant Table
function RessourceTable({
  ressources,
  onEdit,
  onDelete,
}: {
  ressources: Ressource[];
  onEdit: (r: Ressource) => void;
  onDelete: (r: Ressource) => void;
}) {
  if (ressources.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune ressource trouvée
      </div>
    );
  }

  return (
    <>
      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {ressources.map((ressource) => (
          <Card key={ressource.id} className="bg-gradient-to-br from-slate-50/50 to-gray-50/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge className={`${getCategoryColor(ressource.categorie)} text-xs`} variant="outline">
                      {getCategoryIcon(ressource.categorie)}
                      <span className="ml-1">{getCategoryLabel(ressource.categorie)}</span>
                    </Badge>
                    {ressource.important && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{ressource.titre}</p>
                    {ressource.url && (
                      <a
                        href={ressource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary shrink-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {ressource.description}
                  </p>
                  {ressource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ressource.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {ressource.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{ressource.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(ressource)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/ressources/${ressource.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Voir
                      </Link>
                    </DropdownMenuItem>
                    {ressource.url && (
                      <DropdownMenuItem asChild>
                        <a href={ressource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ouvrir le lien
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(ressource)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Titre</TableHead>
              <TableHead className="min-w-[120px]">Catégorie</TableHead>
              <TableHead className="min-w-[150px]">Tags</TableHead>
              <TableHead className="text-center min-w-[80px]">Important</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ressources.map((ressource) => (
              <TableRow key={ressource.id}>
                <TableCell>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {ressource.titre}
                      {ressource.url && (
                        <a
                          href={ressource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {ressource.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(ressource.categorie)} variant="outline">
                    {getCategoryIcon(ressource.categorie)}
                    <span className="ml-1">{getCategoryLabel(ressource.categorie)}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {ressource.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {ressource.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{ressource.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {ressource.important && <Star className="h-4 w-4 text-amber-500 mx-auto fill-amber-500" />}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(ressource)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/ressources/${ressource.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Voir la ressource
                        </Link>
                      </DropdownMenuItem>
                      {ressource.url && (
                        <DropdownMenuItem asChild>
                          <a href={ressource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ouvrir le lien
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(ressource)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
