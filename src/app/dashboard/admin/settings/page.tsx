'use client';

import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Building,
  Palette,
  Bell,
  Shield,
  Database,
  Save,
  RotateCcw,
} from 'lucide-react';

export default function SettingsPage() {
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = () => {
    setHasChanges(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header avec gradient */}
      <div className="animate-slide-up relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-sm sm:text-base text-white/80">
              Configuration de l&apos;application
            </p>
          </div>
          {hasChanges && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setHasChanges(false)} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <RotateCcw className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button onClick={() => setHasChanges(false)} className="bg-white text-slate-700 hover:bg-white/90">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building className="mr-2 h-4 w-4" />
            Organisation
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-100">
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configuration de base de l&apos;application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="app-name">Nom de l&apos;application</Label>
                <Input
                  id="app-name"
                  defaultValue="O.V.N.I Compta"
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency">Devise</Label>
                <Select defaultValue="EUR" onValueChange={handleChange}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar US ($)</SelectItem>
                    <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                    <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date-format">Format de date</Label>
                <Select defaultValue="dd/mm/yyyy" onValueChange={handleChange}>
                  <SelectTrigger id="date-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY (31/12/2024)</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY (12/31/2024)</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (2024-12-31)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fiscal-year">Début d&apos;année fiscale</Label>
                <Select defaultValue="january" onValueChange={handleChange}>
                  <SelectTrigger id="fiscal-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">Janvier</SelectItem>
                    <SelectItem value="april">Avril</SelectItem>
                    <SelectItem value="july">Juillet</SelectItem>
                    <SelectItem value="october">Octobre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader>
              <CardTitle>Informations de l&apos;organisation</CardTitle>
              <CardDescription>
                Détails de l&apos;ASBL ou de l&apos;organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="org-name">Nom de l&apos;organisation</Label>
                <Input
                  id="org-name"
                  defaultValue="O.V.N.I ASBL"
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="org-address">Adresse</Label>
                <Input
                  id="org-address"
                  defaultValue="Rue de l'Exemple 123, 1000 Bruxelles"
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="org-vat">Numéro BCE/TVA</Label>
                  <Input
                    id="org-vat"
                    defaultValue="BE0123.456.789"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="org-phone">Téléphone</Label>
                  <Input
                    id="org-phone"
                    defaultValue="+32 2 123 45 67"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="org-email">Email de contact</Label>
                <Input
                  id="org-email"
                  type="email"
                  defaultValue="contact@ovni.be"
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="org-bank">IBAN</Label>
                <Input
                  id="org-bank"
                  defaultValue="BE12 3456 7890 1234"
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
              <CardDescription>
                Personnaliser l&apos;interface de l&apos;application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mode sombre</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le thème sombre pour l&apos;interface
                  </p>
                </div>
                <Switch onCheckedChange={handleChange} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sidebar compacte</Label>
                  <p className="text-sm text-muted-foreground">
                    Réduire la largeur de la barre latérale
                  </p>
                </div>
                <Switch onCheckedChange={handleChange} />
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label>Couleur principale</Label>
                <div className="flex gap-2">
                  {['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'].map(
                    (color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-400 transition-colors"
                        style={{ backgroundColor: color }}
                        onClick={handleChange}
                      />
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Gérer vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un résumé hebdomadaire par email
                  </p>
                </div>
                <Switch defaultChecked onCheckedChange={handleChange} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes de budget</Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié quand un projet atteint 80% du budget
                  </p>
                </div>
                <Switch defaultChecked onCheckedChange={handleChange} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouvelles transactions</Label>
                  <p className="text-sm text-muted-foreground">
                    Notification à chaque nouvelle transaction
                  </p>
                </div>
                <Switch onCheckedChange={handleChange} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapport mensuel</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un rapport mensuel automatique
                  </p>
                </div>
                <Switch defaultChecked onCheckedChange={handleChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Paramètres de sécurité de l&apos;application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajouter une couche de sécurité supplémentaire
                  </p>
                </div>
                <Switch onCheckedChange={handleChange} />
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label>Durée de session</Label>
                <Select defaultValue="24h" onValueChange={handleChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 heure</SelectItem>
                    <SelectItem value="8h">8 heures</SelectItem>
                    <SelectItem value="24h">24 heures</SelectItem>
                    <SelectItem value="7d">7 jours</SelectItem>
                    <SelectItem value="30d">30 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Journal de connexion</Label>
                  <p className="text-sm text-muted-foreground">
                    Enregistrer toutes les connexions
                  </p>
                </div>
                <Switch defaultChecked onCheckedChange={handleChange} />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Changer le mot de passe</Label>
                <div className="grid gap-4">
                  <Input type="password" placeholder="Mot de passe actuel" />
                  <Input type="password" placeholder="Nouveau mot de passe" />
                  <Input type="password" placeholder="Confirmer le mot de passe" />
                </div>
                <Button variant="outline" onClick={handleChange}>
                  Mettre à jour le mot de passe
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-600">Zone de danger</CardTitle>
              <CardDescription>
                Actions irréversibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-200 rounded-lg bg-white/60">
                <div>
                  <p className="font-medium text-red-900">Supprimer toutes les données</p>
                  <p className="text-sm text-red-700">
                    Cette action supprimera définitivement toutes les données
                  </p>
                </div>
                <Button variant="destructive" className="w-full sm:w-auto">Supprimer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
