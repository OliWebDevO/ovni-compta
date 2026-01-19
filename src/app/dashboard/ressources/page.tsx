'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Scale,
  Calculator,
  Palette,
  ExternalLink,
  Star,
  ChevronRight,
  FileText,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockRessources, RESSOURCE_CATEGORIES } from '@/data/mock';
import type { Ressource, RessourceCategorie } from '@/types';

const categoryIcons: Record<RessourceCategorie, React.ReactNode> = {
  guide: <BookOpen className="h-5 w-5" />,
  juridique: <Scale className="h-5 w-5" />,
  comptabilite: <Calculator className="h-5 w-5" />,
  artistes: <Palette className="h-5 w-5" />,
  liens: <ExternalLink className="h-5 w-5" />,
};

const categoryColors: Record<RessourceCategorie, {
  bg: string;
  text: string;
  border: string;
  cardBg: string;
  iconBg: string;
  shadow: string;
  tabActive: string;
}> = {
  guide: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/50',
    cardBg: 'bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-100/50',
    tabActive: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md',
  },
  juridique: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/50',
    cardBg: 'bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-100/50',
    tabActive: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md',
  },
  comptabilite: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200/50',
    cardBg: 'bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    shadow: 'shadow-amber-100/50',
    tabActive: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md',
  },
  artistes: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200/50',
    cardBg: 'bg-gradient-to-br from-white via-purple-50/30 to-fuchsia-50/50',
    iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600',
    shadow: 'shadow-purple-100/50',
    tabActive: 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-md',
  },
  liens: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200/50',
    cardBg: 'bg-gradient-to-br from-white via-cyan-50/30 to-sky-50/50',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-sky-600',
    shadow: 'shadow-cyan-100/50',
    tabActive: 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md',
  },
};

function RessourceCard({ ressource }: { ressource: Ressource }) {
  const colors = categoryColors[ressource.categorie];

  return (
    <Link href={`/dashboard/ressources/${ressource.id}`} className="block h-full cursor-pointer">
      <div
        className={cn(
          'group h-full relative overflow-hidden transition-all duration-300 rounded-xl',
          'hover:shadow-xl hover:-translate-y-1',
          'shadow-md shadow-rose-100/50',
          'bg-gradient-to-br from-white via-rose-50/20 to-pink-50/30',
          ressource.important && 'shadow-lg shadow-rose-200/60'
        )}
      >
        {/* Subtle gradient overlay on hover */}
        <div className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          'bg-gradient-to-br from-rose-500/5 via-transparent to-fuchsia-500/5'
        )} />

        {/* Decorative corner accent */}
        <div className={cn(
          'absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all duration-300',
          'bg-gradient-to-br from-rose-400 to-pink-500',
          'group-hover:opacity-25 group-hover:scale-150'
        )} />

        {/* Header */}
        <div className="relative p-6 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Modern icon with gradient background */}
              <div
                className={cn(
                  'flex items-center justify-center w-12 h-12 rounded-xl text-white shadow-lg transition-all duration-300',
                  colors.iconBg,
                  'group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3'
                )}
              >
                {categoryIcons[ressource.categorie]}
              </div>
              {ressource.important && (
                <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-sm">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Essentiel
                </Badge>
              )}
            </div>
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300',
              'bg-gray-100/80 group-hover:bg-rose-100',
              'group-hover:translate-x-1'
            )}>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-rose-500 transition-colors" />
            </div>
          </div>

          <h3 className="text-lg mt-4 font-semibold text-gray-900 group-hover:text-rose-700 transition-colors line-clamp-2">
            {ressource.titre}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {ressource.description}
          </p>
        </div>

        {/* Content */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-wrap gap-1.5">
            {ressource.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs font-normal bg-white/60 backdrop-blur-sm border-gray-200/80 text-gray-600"
              >
                {tag}
              </Badge>
            ))}
            {ressource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal bg-white/60 text-gray-400 border-gray-200/50">
                +{ressource.tags.length - 3}
              </Badge>
            )}
          </div>

          {ressource.url && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 group-hover:text-rose-700">
                <ExternalLink className="h-3.5 w-3.5" />
                Accéder au site
                <Sparkles className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function RessourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<RessourceCategorie>('guide');

  const importantRessources = mockRessources.filter((r) => r.important);

  const filterRessources = (categorie: RessourceCategorie) => {
    let filtered = mockRessources.filter((r) => r.categorie === categorie);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.titre.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return filtered;
  };

  const allFilteredRessources = searchQuery
    ? mockRessources.filter(
        (r) =>
          r.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  return (
    <div className="space-y-8">
      {/* Header with enhanced gradient */}
      <div className="animate-slide-up relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 p-6 sm:p-8 text-white shadow-2xl shadow-rose-500/25">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Small floating dots - animated */}
        <div className="absolute top-4 right-[12%] w-3 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }} />
        <div className="absolute top-6 right-[4%] w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.5s' }} />
        <div className="absolute bottom-4 right-[15%] w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '2.3s' }} />
        <div className="absolute bottom-6 right-[6%] w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.8s' }} />

        <div className="relative z-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Sparkles className="h-5 w-5 text-white/60" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ressources ASBL</h1>
              <p className="text-sm sm:text-base text-white/80 mt-1 max-w-md">
                Guides, informations juridiques et ressources pour gérer votre ASBL belge
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <FileText className="h-5 w-5 text-white/80" />
              <div>
                <span className="font-bold text-2xl">{mockRessources.length}</span>
                <p className="text-xs text-white/70">ressources</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search with modern styling */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher une ressource, un guide, un thème..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'w-full pl-12 pr-12 py-4 rounded-2xl',
            'bg-white shadow-lg shadow-gray-100/50',
            'border-2 border-gray-100 focus:border-rose-300',
            'focus:ring-4 focus:ring-rose-100',
            'transition-all duration-300 outline-none',
            'text-gray-900 placeholder:text-gray-400'
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {allFilteredRessources && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 text-rose-600">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {allFilteredRessources.length} résultat{allFilteredRessources.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-sm text-gray-500">pour "{searchQuery}"</p>
            </div>
          </div>
          {allFilteredRessources.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allFilteredRessources.map((ressource) => (
                <RessourceCard key={ressource.id} ressource={ressource} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100">
              <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Aucune ressource trouvée</p>
              <p className="text-gray-400 text-sm mt-1">Essayez d'autres mots-clés</p>
            </Card>
          )}
        </div>
      )}

      {/* Content when not searching */}
      {!allFilteredRessources && (
        <>
          {/* Important Resources Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-200">
                <Star className="h-6 w-6 fill-current" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ressources essentielles</h2>
                <p className="text-sm text-gray-500">Les incontournables pour votre ASBL</p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {importantRessources.map((ressource) => (
                <RessourceCard key={ressource.id} ressource={ressource} />
              ))}
            </div>
          </section>

          {/* Tabs by Category */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RessourceCategorie)} className="space-y-8">
            <TabsList className="w-full h-auto flex-wrap justify-start gap-2 bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-100">
              {RESSOURCE_CATEGORIES.map((cat) => {
                const colors = categoryColors[cat.value];
                const isActive = activeTab === cat.value;
                return (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer',
                      isActive ? colors.tabActive : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    {categoryIcons[cat.value]}
                    <span className="font-medium">{cat.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {RESSOURCE_CATEGORIES.map((cat) => {
              const ressources = filterRessources(cat.value);
              const colors = categoryColors[cat.value];

              return (
                <TabsContent key={cat.value} value={cat.value} className="space-y-6 mt-6">
                  {/* Category header card */}
                  <div
                    className={cn(
                      'rounded-2xl p-6 sm:p-8 border shadow-lg',
                      colors.cardBg,
                      colors.border,
                      colors.shadow
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div
                        className={cn(
                          'flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl text-white shadow-lg [&>svg]:h-6 [&>svg]:w-6 sm:[&>svg]:h-7 sm:[&>svg]:w-7',
                          colors.iconBg
                        )}
                      >
                        {categoryIcons[cat.value]}
                      </div>
                      <div className="flex-1">
                        <h3 className={cn('font-bold text-xl sm:text-2xl', colors.text)}>{cat.label}</h3>
                        <p className="text-gray-600 mt-1">{cat.description}</p>
                      </div>
                      <Badge className={cn('bg-white/80 backdrop-blur-sm text-sm px-4 py-1.5', colors.text, 'border-0 shadow-sm')}>
                        {ressources.length} ressource{ressources.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>

                  {ressources.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {ressources.map((ressource) => (
                        <RessourceCard key={ressource.id} ressource={ressource} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100">
                      <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">Aucune ressource dans cette catégorie</p>
                    </Card>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </>
      )}
    </div>
  );
}
