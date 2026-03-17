'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  FileText,
  Download,
  Trash2,
  Loader2,
  Upload,
  Calendar,
  File,
} from 'lucide-react';
import {
  getFactures,
  createFacture,
  deleteFacture,
  getFactureDownloadUrl,
  uploadFactureFile,
} from '@/lib/actions/factures';
import { toast } from 'sonner';
import type { FactureWithRelations } from '@/types';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';

export default function FacturesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [factures, setFactures] = useState<FactureWithRelations[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const { canCreate, canEdit } = usePermissions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await getFactures();
      if (res.data) setFactures(res.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const uploadFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await uploadFactureFile(formData);
      if (uploadRes.error || !uploadRes.data) {
        toast.error(`Erreur upload: ${uploadRes.error}`);
        return;
      }

      const description = file.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');

      const createRes = await createFacture({
        date: new Date().toISOString().split('T')[0],
        description,
        type_liaison: 'asbl',
        artiste_id: null,
        projet_id: null,
        fichier_nom: file.name,
        fichier_path: uploadRes.data.path,
        fichier_size: uploadRes.data.size,
      });

      if (createRes.error) {
        toast.error(`Erreur: ${createRes.error}`);
        return;
      }

      toast.success('Facture ajoutée');

      const res = await getFactures();
      if (res.data) setFactures(res.data);
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteFacture(id);
    if (error) {
      toast.error(`Erreur: ${error}`);
      return;
    }
    toast.success('Facture supprimée');
    setFactures(factures.filter((f) => f.id !== id));
  };

  const handleDownload = async (id: string) => {
    const { data, error } = await getFactureDownloadUrl(id);
    if (error || !data) {
      toast.error(`Erreur: ${error || 'Impossible de générer le lien'}`);
      return;
    }
    window.open(data.url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Factures"
        description="Stockez vos factures PDF"
        gradient="from-teal-500 via-cyan-500 to-emerald-500"
        icon={<FileText className="h-7 w-7 text-white" />}
      />

      <Card className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-slate-100">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Drop zone / upload */}
          {canCreate && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 sm:p-8 transition-colors',
                  isUploading
                    ? 'border-teal-300 bg-teal-50/50'
                    : isDragOver
                      ? 'border-teal-400 bg-teal-50 text-teal-600'
                      : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500 cursor-pointer'
                )}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                    <span className="text-sm font-medium text-teal-600">Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8" />
                    <div className="text-center">
                      <span className="hidden sm:block text-sm font-medium">
                        {isDragOver ? 'Déposer le PDF ici' : 'Glissez un PDF ici ou cliquez pour ajouter'}
                      </span>
                      <span className="sm:hidden text-sm font-medium">
                        Appuyez pour ajouter un PDF
                      </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Liste des factures */}
          {factures.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune facture enregistrée
            </p>
          ) : (
            <div className="space-y-2">
              {[...factures].sort((a, b) => {
                const matchA = a.description.match(/^F(\d+)/i);
                const matchB = b.description.match(/^F(\d+)/i);
                if (matchA && matchB) return Number(matchB[1]) - Number(matchA[1]);
                if (matchA) return -1;
                if (matchB) return 1;
                return a.description.localeCompare(b.description);
              }).map((facture) => (
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
      </Card>
    </div>
  );
}

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
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 shrink-0">
          <File className="h-5 w-5" />
        </div>
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
