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
  ArrowLeftRight,
  ArrowRight,
  Filter,
  Download,
  Loader2,
  Trash2,
} from 'lucide-react';
import { getTransferts, createTransfert, deleteTransfert } from '@/lib/actions/transferts';
import { toast } from 'sonner';
import { getArtistes } from '@/lib/actions/artistes';
import { getProjets } from '@/lib/actions/projets';
import type { ArtisteWithStats, ProjetWithStats } from '@/types/database';
import type { TransfertWithRelations } from '@/lib/actions/transferts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportTransfertsToCSV } from '@/lib/export';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeader } from '@/components/ui/section-header';
import { PageHeader } from '@/components/ui/page-header';
import { IllustrationTransfer, IllustrationDocuments } from '@/components/illustrations';
import type { CompteType } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';

export default function TransfertsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transferts, setTransferts] = useState<TransfertWithRelations[]>([]);
  const [artistes, setArtistes] = useState<ArtisteWithStats[]>([]);
  const [projets, setProjets] = useState<ProjetWithStats[]>([]);

  // Formulaire - DOIT être avant tout return conditionnel
  const [sourceType, setSourceType] = useState<CompteType>('artiste');
  const [sourceId, setSourceId] = useState<string>('');
  const [destinationType, setDestinationType] = useState<CompteType>('artiste');
  const [destinationId, setDestinationId] = useState<string>('');
  const [montant, setMontant] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { canCreate, canEdit } = usePermissions();

  // Fetch data and prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    async function fetchData() {
      const [transfertsRes, artistesRes, projetsRes] = await Promise.all([
        getTransferts(),
        getArtistes(),
        getProjets(),
      ]);

      if (transfertsRes.data) setTransferts(transfertsRes.data);
      if (artistesRes.data) setArtistes(artistesRes.data);
      if (projetsRes.data) setProjets(projetsRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
      </div>
    );
  }

  // Filtrage
  const filteredTransferts = transferts.filter((tf) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tf.description.toLowerCase().includes(searchLower) ||
      tf.source_nom?.toLowerCase().includes(searchLower) ||
      tf.destination_nom?.toLowerCase().includes(searchLower)
    );
  });

  // Calculs
  const totalTransferts = filteredTransferts.reduce((sum, tf) => sum + tf.montant, 0);

  // Handler creation transfert
  const handleCreateTransfert = async () => {
    // Validation
    if (!sourceId) {
      toast.error('Veuillez sélectionner une source');
      return;
    }
    if (!destinationId) {
      toast.error('Veuillez sélectionner une destination');
      return;
    }
    const montantNum = parseFloat(montant);
    if (!montant || montantNum <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }
    if (!description.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setIsSubmitting(true);

    const { success, error } = await createTransfert({
      date,
      montant: montantNum,
      description: description.trim(),
      source_type: sourceType,
      source_artiste_id: sourceType === 'artiste' ? sourceId : null,
      source_projet_id: sourceType === 'projet' ? sourceId : null,
      destination_type: destinationType,
      destination_artiste_id: destinationType === 'artiste' ? destinationId : null,
      destination_projet_id: destinationType === 'projet' ? destinationId : null,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }

    toast.success('Transfert effectué avec succès');
    setIsDialogOpen(false);

    // Reset form
    setSourceId('');
    setDestinationId('');
    setMontant('');
    setDescription('');

    // Refresh la liste
    const { data: newTransferts } = await getTransferts();
    if (newTransferts) setTransferts(newTransferts);
  };

  // Handler suppression transfert
  const handleDeleteTransfert = async (id: string) => {
    const { success, error } = await deleteTransfert(id);

    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }

    toast.success('Transfert supprimé');
    setTransferts(transferts.filter((tf) => tf.id !== id));
  };

  // Helper pour afficher source/destination
  const getCompteLabel = (nom?: string): string => {
    return nom || '-';
  };

  // Projets actifs uniquement
  const projetsActifs = projets.filter((p) => p.statut === 'actif');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Transferts Internes"
        description="Gerer les mouvements de fonds entre artistes et projets"
        gradient="from-fuchsia-500 via-purple-500 to-violet-500"
        icon={<ArrowLeftRight className="h-7 w-7 text-white" />}
      >
        <Button
          variant="outline"
          className="w-full sm:w-auto bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-lg"
          onClick={() => exportTransfertsToCSV(filteredTransferts, 'transferts')}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
        {canCreate && (isMounted ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-white text-fuchsia-600 hover:bg-white/90 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau transfert
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau transfert interne</DialogTitle>
              <DialogDescription>
                Transférer des fonds entre artistes et/ou projets
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Date */}
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* SOURCE */}
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
                <Label className="text-rose-700 font-semibold mb-3 block">
                  Source (Debit)
                </Label>
                <div className="grid gap-3">
                  <Select
                    value={sourceType}
                    onValueChange={(v) => {
                      setSourceType(v as CompteType);
                      setSourceId('');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de compte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="artiste">Artiste</SelectItem>
                      <SelectItem value="projet">Projet</SelectItem>
                    </SelectContent>
                  </Select>

                  {sourceType === 'artiste' ? (
                    <Select value={sourceId} onValueChange={setSourceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un artiste" />
                      </SelectTrigger>
                      <SelectContent>
                        {artistes.map((a) => (
                          <SelectItem
                            key={a.id}
                            value={a.id}
                            disabled={
                              a.id === destinationId &&
                              destinationType === 'artiste'
                            }
                          >
                            {a.nom} ({formatCurrency(a.solde || 0)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value={sourceId} onValueChange={setSourceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        {projetsActifs.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            disabled={
                              p.id === destinationId &&
                              destinationType === 'projet'
                            }
                          >
                            {p.nom} ({p.code}) - {formatCurrency(p.solde || 0)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Fleche visuelle */}
              <div className="flex justify-center">
                <div className="p-2 rounded-full bg-fuchsia-100">
                  <ArrowRight className="h-5 w-5 text-fuchsia-600" />
                </div>
              </div>

              {/* DESTINATION */}
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                <Label className="text-emerald-700 font-semibold mb-3 block">
                  Destination (Credit)
                </Label>
                <div className="grid gap-3">
                  <Select
                    value={destinationType}
                    onValueChange={(v) => {
                      setDestinationType(v as CompteType);
                      setDestinationId('');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de compte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="artiste">Artiste</SelectItem>
                      <SelectItem value="projet">Projet</SelectItem>
                    </SelectContent>
                  </Select>

                  {destinationType === 'artiste' ? (
                    <Select
                      value={destinationId}
                      onValueChange={setDestinationId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un artiste" />
                      </SelectTrigger>
                      <SelectContent>
                        {artistes.map((a) => (
                          <SelectItem
                            key={a.id}
                            value={a.id}
                            disabled={
                              a.id === sourceId && sourceType === 'artiste'
                            }
                          >
                            {a.nom} ({formatCurrency(a.solde || 0)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={destinationId}
                      onValueChange={setDestinationId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        {projetsActifs.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            disabled={
                              p.id === sourceId && sourceType === 'projet'
                            }
                          >
                            {p.nom} ({p.code}) - {formatCurrency(p.solde || 0)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Montant */}
              <div className="grid gap-2">
                <Label htmlFor="montant">Montant (EUR)</Label>
                <Input
                  id="montant"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Motif du transfert..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateTransfert}
                className="w-full sm:w-auto bg-gradient-to-r from-fuchsia-500 to-purple-600"
                disabled={
                  isSubmitting ||
                  !sourceId ||
                  !destinationId ||
                  !montant ||
                  parseFloat(montant) <= 0
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  'Effectuer le transfert'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        ) : (
          <Button className="w-full sm:w-auto bg-white text-fuchsia-600 hover:bg-white/90 shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau transfert
          </Button>
        ))}
      </PageHeader>

      {/* Section Resume */}
      <SectionHeader
        icon={<IllustrationTransfer size={60} />}
        title="Resume des transferts"
        description="Vue d'ensemble des mouvements internes"
      />

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-2">
        <Card className="card-hover bg-gradient-to-br from-fuchsia-50 to-purple-50 border-fuchsia-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="text-lg sm:text-2xl font-bold text-fuchsia-600">
              {filteredTransferts.length}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Transferts
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <CardContent className="p-3 sm:pt-6 sm:p-6">
            <div className="text-lg sm:text-2xl font-bold text-violet-600">
              {formatCurrency(totalTransferts)}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Volume total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un transfert..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Liste */}
      <SectionHeader
        icon={<IllustrationDocuments size={60} />}
        title="Historique des transferts"
        description="Tous les mouvements internes"
      />

      {/* Empty State */}
      {filteredTransferts.length === 0 && (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              title="Aucun transfert trouve"
              description={
                searchTerm
                  ? 'Essayez de modifier votre recherche.'
                  : 'Commencez par effectuer votre premier transfert interne.'
              }
              illustration="empty"
            />
          </CardContent>
        </Card>
      )}

      {/* Liste Mobile */}
      {filteredTransferts.length > 0 && (
        <div className="block lg:hidden space-y-3">
          <p className="text-sm text-muted-foreground px-1">
            {filteredTransferts.length} transfert(s)
          </p>
          {filteredTransferts.map((tf) => (
            <Card
              key={tf.id}
              className="bg-gradient-to-br from-fuchsia-50/50 to-purple-50/50 border-fuchsia-100/50"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(tf.date)}
                      </span>
                    </div>
                    <p className="font-medium text-sm mb-2">{tf.description}</p>
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-rose-600 border-rose-200 bg-rose-50"
                      >
                        {getCompteLabel(tf.source_nom)}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-fuchsia-500 shrink-0" />
                      <Badge
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 bg-emerald-50"
                      >
                        {getCompteLabel(tf.destination_nom)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-fuchsia-600 font-semibold">
                      {formatCurrency(tf.montant)}
                    </span>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => handleDeleteTransfert(tf.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table Desktop */}
      {filteredTransferts.length > 0 && (
        <Card className="hidden lg:block bg-gradient-to-br from-fuchsia-50/40 to-purple-50/40 border-fuchsia-100/50">
          <CardHeader>
            <CardTitle>Liste des transferts</CardTitle>
            <CardDescription>
              {filteredTransferts.length} transfert(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  {canEdit && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransferts.map((tf) => (
                  <TableRow key={tf.id} className="hover:bg-fuchsia-50/50">
                    <TableCell className="font-medium">
                      {formatDate(tf.date)}
                    </TableCell>
                    <TableCell>{tf.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-rose-600 border-rose-200"
                      >
                        {tf.source_type === 'artiste' ? 'Artiste' : 'Projet'}:{' '}
                        {getCompteLabel(tf.source_nom)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-fuchsia-500" />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-emerald-600 border-emerald-200"
                      >
                        {tf.destination_type === 'artiste'
                          ? 'Artiste'
                          : 'Projet'}
                        :{' '}
                        {getCompteLabel(tf.destination_nom)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-fuchsia-600 font-semibold">
                        {formatCurrency(tf.montant)}
                      </span>
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleDeleteTransfert(tf.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
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
