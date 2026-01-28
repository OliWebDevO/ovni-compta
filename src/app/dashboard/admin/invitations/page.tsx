'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  Shield,
  Pencil,
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  ArrowLeft,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  getInvitations,
  getArtistes,
  createInvitation,
  deleteInvitation,
  resendInvitationEmail,
  type Invitation,
} from '@/lib/invitations/actions';

// Hook React 19 compatible pour éviter l'erreur de setState
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface ArtisteOption {
  id: string;
  nom: string;
  couleur: string | null;
  actif: boolean;
}

export default function InvitationsPage() {
  const isMounted = useIsMounted();
  const [searchTerm, setSearchTerm] = useState('');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [artistesList, setArtistesList] = useState<ArtisteOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [formArtisteId, setFormArtisteId] = useState<string>('none');
  const [formInviteType, setFormInviteType] = useState<'existing' | 'new' | 'viewer'>('existing');
  const [formNotes, setFormNotes] = useState('');

  // Charger les données
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [invResult, artResult] = await Promise.all([
        getInvitations(),
        getArtistes(),
      ]);
      if (invResult.data) setInvitations(invResult.data);
      if (invResult.error) toast.error(invResult.error);
      if (artResult.data) setArtistesList(artResult.data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredInvitations = invitations.filter(
    (inv) =>
      inv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.artiste_nom && inv.artiste_nom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingCount = invitations.filter((i) => !i.used).length;
  const usedCount = invitations.filter((i) => i.used).length;

  const handleCreateInvitation = async () => {
    setIsSubmitting(true);

    const result = await createInvitation({
      email: formEmail,
      role: formRole,
      artiste_id: formArtisteId === 'none' ? null : formArtisteId,
      can_create_artiste: formInviteType === 'new',
      notes: formNotes || null,
      inviteType: formInviteType,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      // Recharger la liste
      const updated = await getInvitations();
      if (updated.data) setInvitations(updated.data);

      setIsDialogOpen(false);
      resetForm();

      if (result.emailSent) {
        toast.success('Invitation créée et email envoyé !');
      } else {
        toast.warning(
          "Invitation créée, mais l'email n'a pas pu être envoyé. Partagez le lien manuellement."
        );
      }
    }
    setIsSubmitting(false);
  };

  const handleDeleteInvitation = async (id: string) => {
    const result = await deleteInvitation(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      setInvitations(invitations.filter((i) => i.id !== id));
      toast.success('Invitation révoquée');
    }
    setDeleteId(null);
  };

  const handleResendEmail = async (id: string) => {
    const result = await resendInvitationEmail(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Email renvoyé !');
    }
  };

  const resetForm = () => {
    setFormEmail('');
    setFormRole('editor');
    setFormArtisteId('none');
    setFormInviteType('existing');
    setFormNotes('');
  };

  const copyEmailLink = (email: string) => {
    const url = `${window.location.origin}/register?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(url);
    toast.success('Lien copié dans le presse-papier');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'editor':
        return <Badge variant="default">Éditeur</Badge>;
      default:
        return <Badge variant="secondary">Lecteur</Badge>;
    }
  };

  const getStatusBadge = (inv: Invitation) => {
    if (inv.used) {
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Utilisée
        </Badge>
      );
    }
    if (inv.expires_at && new Date(inv.expires_at) < new Date()) {
      return (
        <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50">
          <XCircle className="mr-1 h-3 w-3" />
          Expirée
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
        <Clock className="mr-1 h-3 w-3" />
        En attente
      </Badge>
    );
  };

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Gestion des invitations"
        description="Invitez des utilisateurs et liez-les à leurs comptes artistes existants"
        gradient="from-indigo-700 via-purple-700 to-fuchsia-700"
        icon={<Mail className="h-7 w-7 text-white" />}
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-linear-to-br from-amber-50 to-orange-50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Invitations non utilisées</p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisées</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{usedCount}</div>
            <p className="text-xs text-muted-foreground">Comptes créés</p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{invitations.length}</div>
            <p className="text-xs text-muted-foreground">Invitations créées</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invitations</CardTitle>
              <CardDescription>
                Les utilisateurs invités pourront s&apos;inscrire et accéder aux données de leur artiste
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle invitation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Créer une invitation</DialogTitle>
                  <DialogDescription>
                    Un email sera automatiquement envoyé à la personne invitée avec un lien d&apos;inscription.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                  </div>

                  {/* Type d'invitation */}
                  <div className="grid gap-2">
                    <Label>Type d&apos;invitation</Label>
                    <div className="grid gap-2">
                      <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${formInviteType === 'existing' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                        <input
                          type="radio"
                          name="inviteType"
                          value="existing"
                          checked={formInviteType === 'existing'}
                          onChange={() => { setFormInviteType('existing'); setFormRole('editor'); }}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-sm">Artiste existant</div>
                          <div className="text-xs text-muted-foreground">
                            Lier à un artiste déjà dans la compta (transition Google Sheets)
                          </div>
                        </div>
                      </label>
                      <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${formInviteType === 'new' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                        <input
                          type="radio"
                          name="inviteType"
                          value="new"
                          checked={formInviteType === 'new'}
                          onChange={() => { setFormInviteType('new'); setFormRole('editor'); setFormArtisteId('none'); }}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-sm">Nouveau membre</div>
                          <div className="text-xs text-muted-foreground">
                            Un nouveau profil artiste sera créé automatiquement à l&apos;inscription
                          </div>
                        </div>
                      </label>
                      <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${formInviteType === 'viewer' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                        <input
                          type="radio"
                          name="inviteType"
                          value="viewer"
                          checked={formInviteType === 'viewer'}
                          onChange={() => { setFormInviteType('viewer'); setFormRole('viewer'); setFormArtisteId('none'); }}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-sm">Observateur</div>
                          <div className="text-xs text-muted-foreground">
                            Accès en lecture seule, sans profil artiste (ex: comptable)
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Sélection d'artiste (seulement pour "existant") */}
                  {formInviteType === 'existing' && (
                    <div className="grid gap-2">
                      <Label htmlFor="artiste">Artiste à associer</Label>
                      <Select value={formArtisteId} onValueChange={setFormArtisteId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un artiste" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            <span className="text-muted-foreground">Choisir...</span>
                          </SelectItem>
                          {artistesList.map((artiste) => (
                            <SelectItem key={artiste.id} value={artiste.id}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: artiste.couleur || '#888' }}
                                />
                                {artiste.nom}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        L&apos;utilisateur retrouvera ses transactions et données existantes
                      </p>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select value={formRole} onValueChange={(v: 'admin' | 'editor' | 'viewer') => setFormRole(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-rose-500" />
                            Admin - Accès complet
                          </div>
                        </SelectItem>
                        <SelectItem value="editor">
                          <div className="flex items-center gap-2">
                            <Pencil className="h-4 w-4 text-blue-500" />
                            Éditeur - Peut modifier ses données
                          </div>
                        </SelectItem>
                        <SelectItem value="viewer">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            Lecteur - Lecture seule
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Notes internes sur cette invitation..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateInvitation}
                    disabled={!formEmail || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting ? 'Envoi...' : "Créer l'invitation"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par email ou artiste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Artiste lié</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucune invitation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvitations.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.email}</TableCell>
                      <TableCell>
                        {inv.artiste_nom ? (
                          <span className="text-sm">{inv.artiste_nom}</span>
                        ) : inv.can_create_artiste ? (
                          <span className="text-muted-foreground text-sm italic">Nouveau membre</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getRoleBadge(inv.role)}</TableCell>
                      <TableCell>{getStatusBadge(inv)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(inv.created_at)}
                        {inv.invited_by_nom && (
                          <span className="block text-xs">par {inv.invited_by_nom}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyEmailLink(inv.email)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copier le lien
                            </DropdownMenuItem>
                            {!inv.used && (
                              <DropdownMenuItem onClick={() => handleResendEmail(inv.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Renvoyer l&apos;email
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-rose-500"
                              onClick={() => setDeleteId(inv.id)}
                              disabled={inv.used}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Révoquer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comment ça fonctionne ?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Créez une invitation</strong> avec l&apos;email de la personne et sélectionnez son artiste associé
            </li>
            <li>
              <strong className="text-foreground">Un email est automatiquement envoyé</strong> à la personne avec un lien d&apos;inscription
            </li>
            <li>
              <strong className="text-foreground">L&apos;utilisateur s&apos;inscrit</strong> en cliquant sur le lien dans l&apos;email
            </li>
            <li>
              <strong className="text-foreground">Son compte est automatiquement lié</strong> à son profil artiste et il peut accéder à ses données
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Révoquer cette invitation ?</AlertDialogTitle>
            <AlertDialogDescription>
              L&apos;utilisateur ne pourra plus s&apos;inscrire avec cet email. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() => deleteId && handleDeleteInvitation(deleteId)}
            >
              Révoquer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
