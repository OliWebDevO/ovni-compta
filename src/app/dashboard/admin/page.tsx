'use client';

import { useState, useEffect, useMemo } from 'react';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Shield,
  Users,
  Activity,
  Database,
  Download,
  Upload,
  RefreshCw,
  Mail,
  ArrowRight,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { getUsers, deleteUser, updateUserRole } from '@/lib/actions/admin';
import { getTransactions } from '@/lib/actions/transactions';
import { getArtistes } from '@/lib/actions/artistes';
import { getProjets } from '@/lib/actions/projets';
import type { ArtisteWithStats, ProjetWithStats } from '@/types/database';
import type { UserProfile } from '@/lib/actions/admin';
import Link from 'next/link';
import { formatDate, formatDateLong, getInitials, getRoleColor } from '@/lib/utils';
import { PageHeader } from '@/components/ui/page-header';
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
import { toast } from 'sonner';

const activityLog = [
  { id: 1, user: 'Admin O.V.N.I', action: 'Création transaction', target: 'Loyer Communa janvier', date: '2025-01-12T10:30:00Z' },
  { id: 2, user: 'Comptable', action: 'Modification artiste', target: 'Maïa', date: '2025-01-10T14:15:00Z' },
  { id: 3, user: 'Admin O.V.N.I', action: 'Création projet', target: 'Nouveau Spectacle', date: '2025-01-08T09:00:00Z' },
  { id: 4, user: 'Comptable', action: 'Suppression transaction', target: 'Erreur #123', date: '2025-01-05T16:45:00Z' },
  { id: 5, user: 'Admin O.V.N.I', action: 'Modification utilisateur', target: 'Membre', date: '2025-01-03T11:20:00Z' },
];

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [artistes, setArtistes] = useState<ArtisteWithStats[]>([]);
  const [projets, setProjets] = useState<ProjetWithStats[]>([]);

  // États pour les dialogs de gestion utilisateur
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data and prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    async function fetchData() {
      const [usersRes, txRes, artistesRes, projetsRes] = await Promise.all([
        getUsers(),
        getTransactions(),
        getArtistes(),
        getProjets(),
      ]);

      if (usersRes.data) setUsers(usersRes.data);
      if (txRes.data) setTransactionsCount(txRes.data.length);
      if (artistesRes.data) setArtistes(artistesRes.data);
      if (projetsRes.data) setProjets(projetsRes.data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Handler pour supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);

    const { error } = await deleteUser(selectedUser.id);

    if (error) {
      toast.error(error);
    } else {
      toast.success(`${selectedUser.nom} a été supprimé`);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    }

    setIsSubmitting(false);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Handler pour changer le rôle
  const handleChangeRole = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);

    const { error } = await updateUserRole(selectedUser.id, newRole);

    if (error) {
      toast.error(error);
    } else {
      toast.success(`Rôle de ${selectedUser.nom} modifié en ${newRole === 'admin' ? 'Admin' : newRole === 'editor' ? 'Éditeur' : 'Lecteur'}`);
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole } : u)));
    }

    setIsSubmitting(false);
    setIsRoleDialogOpen(false);
    setSelectedUser(null);
  };

  // Ouvrir le dialog de suppression
  const openDeleteDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Ouvrir le dialog de changement de rôle
  const openRoleDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const filteredUsers = useMemo(
    () => users.filter((user) =>
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec gradient */}
      <PageHeader
        title="Administration"
        description="Gestion des utilisateurs et paramètres système"
        gradient="from-slate-700 via-slate-800 to-slate-900"
        icon={<Shield className="h-7 w-7 text-white" />}
      />

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Invitation Banner */}
        <Card className="border-indigo-200 bg-linear-to-br from-indigo-50 via-purple-50 to-fuchsia-50">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg shrink-0">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Gestion des invitations</h3>
                  <p className="text-sm text-muted-foreground">
                    Inviter des membres à rejoindre l&apos;application
                  </p>
                </div>
              </div>
              <Link href="/dashboard/admin/invitations" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md">
                  Gérer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Ressources Banner */}
        <Card className="border-teal-200 bg-linear-to-br from-teal-50 via-emerald-50 to-green-50">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg shrink-0">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Gestion des ressources</h3>
                  <p className="text-sm text-muted-foreground">
                    Créer et modifier les guides et ressources ASBL
                  </p>
                </div>
              </div>
              <Link href="/dashboard/admin/ressources" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md">
                  Gérer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.role === 'admin').length} admin(s)
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{transactionsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total en base
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artistes</CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{artistes.length}</div>
            <p className="text-xs text-muted-foreground">
              {artistes.filter(a => a.actif).length} actifs
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets</CardTitle>
            <Database className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{projets.length}</div>
            <p className="text-xs text-muted-foreground">
              {projets.filter(p => p.statut === 'actif').length} actifs
            </p>
          </CardContent>
        </Card>
      </div>

      {isMounted ? (
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="activity">Journal d&apos;activité</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
              <CardDescription>
                Gérer les accès et les rôles des utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="block lg:hidden space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-4 border rounded-lg bg-slate-50/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user.nom)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{user.nom}</div>
                          <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                        </div>
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
                          <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier le rôle
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-500" onClick={() => openDeleteDialog(user)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant={getRoleColor(user.role)}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'editor' ? 'Éditeur' : 'Lecteur'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Créé le {formatDate(user.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <Table className="hidden lg:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(user.nom)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.nom}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleColor(user.role)}>
                          {user.role === 'admin' ? 'Admin' : user.role === 'editor' ? 'Éditeur' : 'Lecteur'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
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
                            <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier le rôle
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-rose-500" onClick={() => openDeleteDialog(user)}>
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
            </CardContent>
          </Card>

          {/* Dialog de confirmation de suppression */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer <strong>{selectedUser?.nom}</strong> ?
                  Cette action est irréversible et supprimera définitivement le compte.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  disabled={isSubmitting}
                  className="bg-rose-500 hover:bg-rose-600"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    'Supprimer'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Dialog de modification du rôle */}
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le rôle</DialogTitle>
                <DialogDescription>
                  Changer le rôle de {selectedUser?.nom}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nouveau rôle</Label>
                  <Select value={newRole} onValueChange={(value: 'admin' | 'editor' | 'viewer') => setNewRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-red-500" />
                          Admin - Accès complet
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex items-center gap-2">
                          <Pencil className="h-4 w-4 text-blue-500" />
                          Éditeur - Lecture/Écriture
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)} disabled={isSubmitting}>
                  Annuler
                </Button>
                <Button onClick={handleChangeRole} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Modification...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Roles Explanation */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions par rôle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold">Admin</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Accès complet à toutes les fonctionnalités</li>
                    <li>• Gestion des utilisateurs</li>
                    <li>• Import/Export des données</li>
                    <li>• Paramètres système</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Pencil className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">Éditeur</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Créer/modifier des transactions</li>
                    <li>• Gérer les artistes et projets</li>
                    <li>• Consulter les bilans</li>
                    <li>• Exporter les données</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <h3 className="font-semibold">Lecteur</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Consulter les transactions</li>
                    <li>• Voir les fiches artistes/projets</li>
                    <li>• Consulter les bilans</li>
                    <li>• Aucune modification possible</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal d&apos;activité</CardTitle>
              <CardDescription>
                Historique des actions récentes sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile Cards */}
              <div className="block lg:hidden space-y-3">
                {activityLog.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg bg-slate-50/50">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-sm">{log.user}</span>
                      <Badge variant="outline" className="text-xs shrink-0">{log.action}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{log.target}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDateLong(log.date)}</p>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <Table className="hidden lg:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Cible</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLog.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>{formatDateLong(log.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Export des données</CardTitle>
                <CardDescription>
                  Télécharger les données au format CSV ou Excel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter toutes les transactions (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter les artistes (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter les projets (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter les bilans (Excel)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import des données</CardTitle>
                <CardDescription>
                  Importer des données depuis un fichier CSV
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Importer des transactions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Importer des artistes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Importer des projets
                </Button>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Synchronisation Google Sheets
                  </p>
                  <Button variant="secondary" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Synchroniser avec Google Sheets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>
                Actions de maintenance de la base de données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button variant="outline" className="w-full sm:w-auto">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recalculer les soldes
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Database className="mr-2 h-4 w-4" />
                  Vérifier l&apos;intégrité
                </Button>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Purger les données de test
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      ) : (
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded-md animate-pulse w-64" />
        </div>
      )}
    </div>
  );
}
