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
  Pencil,
  Landmark,
} from 'lucide-react';
import { getTransferts, createTransfert, updateTransfert, deleteTransfert } from '@/lib/actions/transferts';
import { MultiSelect } from '@/components/ui/multi-select';
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
  const [filterType, setFilterType] = useState<string>('all');
  const [filterArtiste, setFilterArtiste] = useState<string>('all');
  const [filterProjet, setFilterProjet] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransfert, setEditingTransfert] = useState<TransfertWithRelations | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transferts, setTransferts] = useState<TransfertWithRelations[]>([]);
  const [artistes, setArtistes] = useState<ArtisteWithStats[]>([]);
  const [projets, setProjets] = useState<ProjetWithStats[]>([]);

  // Formulaire création - DOIT être avant tout return conditionnel
  const [sourceType, setSourceType] = useState<CompteType>('artiste');
  const [sourceId, setSourceId] = useState<string>('');
  const [destinationType, setDestinationType] = useState<CompteType>('artiste');
  const [destinationIds, setDestinationIds] = useState<string[]>([]);
  const [montant, setMontant] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire édition
  const [editSourceType, setEditSourceType] = useState<CompteType>('artiste');
  const [editSourceId, setEditSourceId] = useState<string>('');
  const [editDestinationType, setEditDestinationType] = useState<CompteType>('artiste');
  const [editDestinationId, setEditDestinationId] = useState<string>('');
  const [editMontant, setEditMontant] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

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
    const matchesSearch =
      tf.description.toLowerCase().includes(searchLower) ||
      tf.source_nom?.toLowerCase().includes(searchLower) ||
      tf.destination_nom?.toLowerCase().includes(searchLower);

    const matchesType =
      filterType === 'all' ||
      (filterType === 'asbl' && (tf.source_type === 'asbl' || tf.destination_type === 'asbl')) ||
      (filterType === 'artiste' && (tf.source_type === 'artiste' || tf.destination_type === 'artiste')) ||
      (filterType === 'projet' && (tf.source_type === 'projet' || tf.destination_type === 'projet'));

    const matchesArtiste =
      filterArtiste === 'all' ||
      tf.source_artiste_id === filterArtiste ||
      tf.destination_artiste_id === filterArtiste;

    const matchesProjet =
      filterProjet === 'all' ||
      tf.source_projet_id === filterProjet ||
      tf.destination_projet_id === filterProjet;

    return matchesSearch && matchesType && matchesArtiste && matchesProjet;
  });

  // Calculs
  const totalTransferts = filteredTransferts.reduce((sum, tf) => sum + tf.montant, 0);

  // Handler creation transfert
  const handleCreateTransfert = async () => {
    // Validation - pour ASBL, sourceId sera 'asbl'
    if (!sourceId) {
      toast.error('Veuillez sélectionner une source');
      return;
    }
    // Pour ASBL en destination, on met 'asbl' dans le tableau
    if (destinationIds.length === 0) {
      toast.error('Veuillez sélectionner au moins une destination');
      return;
    }
    // Empêcher le transfert ASBL vers ASBL
    if (sourceType === 'asbl' && destinationType === 'asbl') {
      toast.error('Impossible de transférer de la Caisse OVNI vers elle-même');
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

    try {
      // Nombre de destinations
      const count = destinationIds.length;
      const dividedMontant = Math.round((montantNum / count) * 100) / 100;

      // Créer un transfert par destination
      for (const destId of destinationIds) {
        const { error } = await createTransfert({
          date,
          montant: dividedMontant,
          description: description.trim(),
          source_type: sourceType,
          source_artiste_id: sourceType === 'artiste' ? sourceId : null,
          source_projet_id: sourceType === 'projet' ? sourceId : null,
          destination_type: destinationType,
          destination_artiste_id: destinationType === 'artiste' ? destId : null,
          destination_projet_id: destinationType === 'projet' ? destId : null,
        });

        if (error) {
          toast.error(`Erreur: ${error}`);
          setIsSubmitting(false);
          return;
        }
      }

      setIsSubmitting(false);
      toast.success(count > 1 ? `${count} transferts effectués avec succès` : 'Transfert effectué avec succès');
      setIsDialogOpen(false);

      // Reset form
      setSourceType('artiste');
      setSourceId('');
      setDestinationType('artiste');
      setDestinationIds([]);
      setMontant('');
      setDescription('');

      // Refresh la liste
      const { data: newTransferts } = await getTransferts();
      if (newTransferts) setTransferts(newTransferts);
    } catch {
      setIsSubmitting(false);
      toast.error('Une erreur est survenue');
    }
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

  // Handler ouverture édition
  const handleOpenEdit = (tf: TransfertWithRelations) => {
    setEditingTransfert(tf);
    setEditDate(tf.date);
    setEditDescription(tf.description);
    setEditMontant(tf.montant.toString());
    setEditSourceType(tf.source_type);
    setEditSourceId(
      tf.source_type === 'asbl' ? 'asbl' : (tf.source_artiste_id || tf.source_projet_id || '')
    );
    setEditDestinationType(tf.destination_type);
    setEditDestinationId(
      tf.destination_type === 'asbl' ? 'asbl' : (tf.destination_artiste_id || tf.destination_projet_id || '')
    );
    setIsEditDialogOpen(true);
  };

  // Handler mise à jour transfert
  const handleUpdateTransfert = async () => {
    if (!editingTransfert) return;

    // Validation
    if (!editSourceId) {
      toast.error('Veuillez sélectionner une source');
      return;
    }
    if (!editDestinationId) {
      toast.error('Veuillez sélectionner une destination');
      return;
    }
    // Empêcher le transfert ASBL vers ASBL
    if (editSourceType === 'asbl' && editDestinationType === 'asbl') {
      toast.error('Impossible de transférer de la Caisse OVNI vers elle-même');
      return;
    }
    const montantNum = parseFloat(editMontant);
    if (!editMontant || montantNum <= 0) {
      toast.error('Veuillez entrer un montant valide');
      return;
    }
    if (!editDescription.trim()) {
      toast.error('Veuillez entrer une description');
      return;
    }

    setIsEditSubmitting(true);

    const { success, error } = await updateTransfert(editingTransfert.id, {
      date: editDate,
      montant: montantNum,
      description: editDescription.trim(),
      source_type: editSourceType,
      source_artiste_id: editSourceType === 'artiste' ? editSourceId : null,
      source_projet_id: editSourceType === 'projet' ? editSourceId : null,
      destination_type: editDestinationType,
      destination_artiste_id: editDestinationType === 'artiste' ? editDestinationId : null,
      destination_projet_id: editDestinationType === 'projet' ? editDestinationId : null,
    });

    setIsEditSubmitting(false);

    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }

    toast.success('Transfert modifié avec succès');
    setIsEditDialogOpen(false);
    setEditingTransfert(null);

    // Refresh la liste
    const { data: newTransferts } = await getTransferts();
    if (newTransferts) setTransferts(newTransferts);
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
                      setSourceId(v === 'asbl' ? 'asbl' : '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de compte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asbl">
                        <span className="flex items-center gap-2">
                          <Landmark className="h-4 w-4" />
                          Caisse OVNI (ASBL)
                        </span>
                      </SelectItem>
                      <SelectItem value="artiste">Artiste</SelectItem>
                      <SelectItem value="projet">Projet</SelectItem>
                    </SelectContent>
                  </Select>

                  {sourceType === 'asbl' && (
                    <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg text-slate-700">
                      <Landmark className="h-5 w-5" />
                      <span className="font-medium">Caisse OVNI</span>
                    </div>
                  )}

                  {sourceType === 'artiste' && (
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
                              destinationIds.includes(a.id) &&
                              destinationType === 'artiste'
                            }
                          >
                            {a.nom} ({formatCurrency(a.solde || 0)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {sourceType === 'projet' && (
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
                              destinationIds.includes(p.id) &&
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
                      setDestinationIds(v === 'asbl' ? ['asbl'] : []);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de compte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asbl">
                        <span className="flex items-center gap-2">
                          <Landmark className="h-4 w-4" />
                          Caisse OVNI (ASBL)
                        </span>
                      </SelectItem>
                      <SelectItem value="artiste">Artiste(s)</SelectItem>
                      <SelectItem value="projet">Projet(s)</SelectItem>
                    </SelectContent>
                  </Select>

                  {destinationType === 'asbl' && (
                    <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg text-slate-700">
                      <Landmark className="h-5 w-5" />
                      <span className="font-medium">Caisse OVNI</span>
                    </div>
                  )}

                  {destinationType === 'artiste' && (
                    <>
                      <MultiSelect
                        options={artistes
                          .filter((a) => !(a.id === sourceId && sourceType === 'artiste'))
                          .map((a) => ({
                            value: a.id,
                            label: `${a.nom} (${formatCurrency(a.solde || 0)})`,
                            color: a.couleur,
                          }))}
                        selected={destinationIds}
                        onChange={setDestinationIds}
                        placeholder="Sélectionner un ou plusieurs artistes"
                      />
                      {destinationIds.length > 1 && (
                        <p className="text-sm text-emerald-600">
                          Le montant sera divisé en {destinationIds.length} transferts égaux
                        </p>
                      )}
                    </>
                  )}

                  {destinationType === 'projet' && (
                    <>
                      <MultiSelect
                        options={projetsActifs
                          .filter((p) => !(p.id === sourceId && sourceType === 'projet'))
                          .map((p) => ({
                            value: p.id,
                            label: `${p.nom} (${p.code}) - ${formatCurrency(p.solde || 0)}`,
                          }))}
                        selected={destinationIds}
                        onChange={setDestinationIds}
                        placeholder="Sélectionner un ou plusieurs projets"
                      />
                      {destinationIds.length > 1 && (
                        <p className="text-sm text-emerald-600">
                          Le montant sera divisé en {destinationIds.length} transferts égaux
                        </p>
                      )}
                    </>
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
                  destinationIds.length === 0 ||
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

      {/* Edit Dialog */}
      {isMounted && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le transfert</DialogTitle>
              <DialogDescription>
                Modifier les détails du transfert interne
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Date */}
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>

              {/* SOURCE */}
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-100">
                <Label className="text-rose-700 font-semibold mb-3 block">
                  Source (Debit)
                </Label>
                <div className="grid gap-3">
                  <Select
                    value={editSourceType}
                    onValueChange={(v) => {
                      setEditSourceType(v as CompteType);
                      setEditSourceId(v === 'asbl' ? 'asbl' : '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de compte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asbl">
                        <span className="flex items-center gap-2">
                          <Landmark className="h-4 w-4" />
                          Caisse OVNI (ASBL)
                        </span>
                      </SelectItem>
                      <SelectItem value="artiste">Artiste</SelectItem>
                      <SelectItem value="projet">Projet</SelectItem>
                    </SelectContent>
                  </Select>

                  {editSourceType === 'asbl' && (
                    <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg text-slate-700">
                      <Landmark className="h-5 w-5" />
                      <span className="font-medium">Caisse OVNI</span>
                    </div>
                  )}

                  {editSourceType === 'artiste' && (
                    <Select value={editSourceId} onValueChange={setEditSourceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un artiste" />
                      </SelectTrigger>
                      <SelectContent>
                        {artistes.map((a) => (
                          <SelectItem
                            key={a.id}
                            value={a.id}
                            disabled={
                              a.id === editDestinationId &&
                              editDestinationType === 'artiste'
                            }
                          >
                            {a.nom} ({formatCurrency(a.solde || 0)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {editSourceType === 'projet' && (
                    <Select value={editSourceId} onValueChange={setEditSourceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un projet" />
                      </SelectTrigger>
                      <SelectContent>
                        {projetsActifs.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            disabled={
                              p.id === editDestinationId &&
                              editDestinationType === 'projet'
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
                    value={editDestinationType}
                    onValueChange={(v) => {
                      setEditDestinationType(v as CompteType);
                      setEditDestinationId(v === 'asbl' ? 'asbl' : '');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de compte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asbl">
                        <span className="flex items-center gap-2">
                          <Landmark className="h-4 w-4" />
                          Caisse OVNI (ASBL)
                        </span>
                      </SelectItem>
                      <SelectItem value="artiste">Artiste</SelectItem>
                      <SelectItem value="projet">Projet</SelectItem>
                    </SelectContent>
                  </Select>

                  {editDestinationType === 'asbl' && (
                    <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg text-slate-700">
                      <Landmark className="h-5 w-5" />
                      <span className="font-medium">Caisse OVNI</span>
                    </div>
                  )}

                  {editDestinationType === 'artiste' && (
                    <Select
                      value={editDestinationId}
                      onValueChange={setEditDestinationId}
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
                              a.id === editSourceId && editSourceType === 'artiste'
                            }
                          >
                            {a.nom} ({formatCurrency(a.solde || 0)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {editDestinationType === 'projet' && (
                    <Select
                      value={editDestinationId}
                      onValueChange={setEditDestinationId}
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
                              p.id === editSourceId && editSourceType === 'projet'
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
                <Label htmlFor="edit-montant">Montant (EUR)</Label>
                <Input
                  id="edit-montant"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={editMontant}
                  onChange={(e) => setEditMontant(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  placeholder="Motif du transfert..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto"
                disabled={isEditSubmitting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdateTransfert}
                className="w-full sm:w-auto bg-gradient-to-r from-fuchsia-500 to-purple-600"
                disabled={
                  isEditSubmitting ||
                  !editSourceId ||
                  !editDestinationId ||
                  !editMontant ||
                  parseFloat(editMontant) <= 0
                }
              >
                {isEditSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un transfert..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-3 [&>*]:flex-1 [&>*]:min-w-[140px]">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="asbl">ASBL</SelectItem>
                  <SelectItem value="artiste">Artistes</SelectItem>
                  <SelectItem value="projet">Projets</SelectItem>
                </SelectContent>
              </Select>
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
                searchTerm || filterType !== 'all' || filterArtiste !== 'all' || filterProjet !== 'all'
                  ? 'Essayez de modifier vos filtres pour trouver ce que vous cherchez.'
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
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-fuchsia-500 hover:text-fuchsia-700 hover:bg-fuchsia-50"
                          onClick={() => handleOpenEdit(tf)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleDeleteTransfert(tf.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                  {canEdit && <TableHead className="w-[100px]"></TableHead>}
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
                        className={tf.source_type === 'asbl'
                          ? "text-slate-600 border-slate-200"
                          : "text-rose-600 border-rose-200"}
                      >
                        {tf.source_type === 'artiste' ? 'Artiste' : tf.source_type === 'projet' ? 'Projet' : 'ASBL'}:{' '}
                        {getCompteLabel(tf.source_nom)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-fuchsia-500" />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={tf.destination_type === 'asbl'
                          ? "text-slate-600 border-slate-200"
                          : "text-emerald-600 border-emerald-200"}
                      >
                        {tf.destination_type === 'artiste'
                          ? 'Artiste'
                          : tf.destination_type === 'projet' ? 'Projet' : 'ASBL'}
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
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-fuchsia-500 hover:text-fuchsia-700 hover:bg-fuchsia-50"
                            onClick={() => handleOpenEdit(tf)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            onClick={() => handleDeleteTransfert(tf.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
