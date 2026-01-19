import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TEXT_COLORS } from './colors'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatage monétaire EUR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Formatage date courte (DD/MM/YYYY)
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

// Formatage date longue (15 janvier 2024)
export function formatDateLong(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

// Formatage relatif (il y a 2 jours)
export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} ans`;
}

// Noms des mois
export const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

// Générer initiales
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Couleur selon le solde
export function getSoldeColor(solde: number): string {
  if (solde > 0) return TEXT_COLORS.credit;
  if (solde < 0) return TEXT_COLORS.debit;
  return TEXT_COLORS.neutral;
}

// Badge couleur selon statut projet
export function getStatutColor(statut: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (statut) {
    case 'actif': return 'default';
    case 'termine': return 'secondary';
    case 'annule': return 'destructive';
    default: return 'outline';
  }
}

// Badge couleur selon rôle
export function getRoleColor(role: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (role) {
    case 'admin': return 'destructive';
    case 'editor': return 'default';
    case 'viewer': return 'secondary';
    default: return 'outline';
  }
}
