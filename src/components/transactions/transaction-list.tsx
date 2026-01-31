'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORIES } from '@/types';

// Helper pour obtenir le label de catégorie
const getCategoryLabel = (value: string): string => {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat?.label || value;
};

export interface TransactionItem {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  categorie?: string | null;
  artiste_id?: string | null;
  artiste_nom?: string | null;
  artiste_couleur?: string | null;
  projet_id?: string | null;
  projet_code?: string | null;
  projet_nom?: string | null;
}

export interface TransactionListProps {
  transactions: TransactionItem[];
  showArtiste?: boolean;
  showProjet?: boolean;
  showCategorie?: boolean;
  showActions?: boolean;
  canEdit?: boolean;
  returnUrl?: string;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
  className?: string;
  mobileCardClassName?: string;
  desktopTableClassName?: string;
}

export function TransactionList({
  transactions,
  showArtiste = false,
  showProjet = false,
  showCategorie = false,
  showActions = false,
  canEdit = false,
  returnUrl = '/dashboard/transactions',
  onDelete,
  emptyMessage = 'Aucune transaction',
  className = '',
  mobileCardClassName = 'bg-gradient-to-br from-slate-50/50 to-gray-50/50 border-slate-100/50',
  desktopTableClassName = 'bg-gradient-to-br from-slate-50/30 to-gray-50/30 border-slate-100/50',
}: TransactionListProps) {
  const shouldShowActions = showActions && canEdit;

  if (transactions.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {transactions.map((tx) => (
          <Card key={tx.id} className={mobileCardClassName}>
            <CardContent className="p-4">
              {/* Ligne 1: Date+Badges | Montant */}
              <div className="flex items-start justify-between gap-3">
                {/* Date et Badges */}
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground block">
                    {formatDate(tx.date)}
                  </span>
                  <div className="flex flex-wrap gap-1 my-3">
                    {showArtiste && tx.artiste_nom && tx.artiste_id && (
                      <Link href={`/dashboard/artistes/${tx.artiste_id}`}>
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                          style={tx.artiste_couleur ? {
                            borderColor: tx.artiste_couleur,
                            color: tx.artiste_couleur
                          } : undefined}
                        >
                          {tx.artiste_nom}
                        </Badge>
                      </Link>
                    )}
                    {showProjet && tx.projet_code && tx.projet_id && (
                      <Link href={`/dashboard/projets/${tx.projet_id}`}>
                        <Badge variant="secondary" className="text-xs cursor-pointer hover:opacity-80 transition-opacity">
                          {tx.projet_code}
                        </Badge>
                      </Link>
                    )}
                    {showCategorie && tx.categorie && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {getCategoryLabel(tx.categorie)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Montant */}
                <div className="text-right shrink-0">
                  {tx.credit > 0 ? (
                    <span className="text-emerald-600 font-semibold text-base">
                      +{formatCurrency(tx.credit)}
                    </span>
                  ) : (
                    <span className="text-rose-500 font-semibold text-base">
                      -{formatCurrency(tx.debit)}
                    </span>
                  )}
                </div>
              </div>

              {/* Ligne 2: Description + Actions en bas à droite */}
              {(tx.description || shouldShowActions) && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-end justify-between gap-3">
                    {/* Description */}
                    <p className="text-sm text-foreground flex-1">
                      {tx.description || <span className="text-muted-foreground">-</span>}
                    </p>

                    {/* Actions */}
                    {shouldShowActions && (
                      <div className="flex items-center gap-2 shrink-0">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                                asChild
                              >
                                <Link href={`/dashboard/transactions/${tx.id}/edit?returnUrl=${encodeURIComponent(returnUrl)}`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Modifier</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-slate-600 hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                                onClick={() => onDelete?.(tx.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Supprimer</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <Card className={`hidden lg:block ${desktopTableClassName}`}>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                {showArtiste && <TableHead>Artiste</TableHead>}
                {showProjet && <TableHead>Projet</TableHead>}
                {showCategorie && <TableHead>Catégorie</TableHead>}
                <TableHead className="text-right">Crédit</TableHead>
                <TableHead className="text-right">Débit</TableHead>
                {shouldShowActions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium whitespace-nowrap">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {tx.description || <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  {showArtiste && (
                    <TableCell>
                      {tx.artiste_nom && tx.artiste_id ? (
                        <Link href={`/dashboard/artistes/${tx.artiste_id}`}>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            style={tx.artiste_couleur ? {
                              borderColor: tx.artiste_couleur,
                              color: tx.artiste_couleur
                            } : undefined}
                          >
                            {tx.artiste_nom}
                          </Badge>
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {showProjet && (
                    <TableCell>
                      {tx.projet_code && tx.projet_id ? (
                        <Link href={`/dashboard/projets/${tx.projet_id}`}>
                          <Badge variant="secondary" className="cursor-pointer hover:opacity-80 transition-opacity">
                            {tx.projet_code}
                          </Badge>
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {showCategorie && (
                    <TableCell>
                      {tx.categorie ? (
                        <Badge variant="outline" className="text-muted-foreground">{getCategoryLabel(tx.categorie)}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    {tx.credit > 0 ? (
                      <span className="text-emerald-600 font-medium">
                        +{formatCurrency(tx.credit)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {tx.debit > 0 ? (
                      <span className="text-rose-500 font-medium">
                        -{formatCurrency(tx.debit)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  {shouldShowActions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                                asChild
                              >
                                <Link href={`/dashboard/transactions/${tx.id}/edit?returnUrl=${encodeURIComponent(returnUrl)}`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Modifier</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-slate-600 hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                                onClick={() => onDelete?.(tx.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Supprimer</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
