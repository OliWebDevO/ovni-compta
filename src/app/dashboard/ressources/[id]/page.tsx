'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Scale,
  Calculator,
  Palette,
  ExternalLink,
  Star,
  ArrowLeft,
  FileText,
  Clock,
  Tag,
  Sparkles,
  Info,
  AlertCircle,
  Lightbulb,
  ChevronRight,
  Globe,
  Share2,
  Bookmark,
  AlertTriangle,
  ListChecks,
  FileCheck,
  Users,
  Coins,
  ScrollText,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockRessources } from '@/data/mock';
import type { RessourceCategorie } from '@/types';
import Link from 'next/link';

const categoryIcons: Record<RessourceCategorie, React.ReactNode> = {
  guide: <BookOpen className="h-8 w-8" />,
  juridique: <Scale className="h-8 w-8" />,
  comptabilite: <Calculator className="h-8 w-8" />,
  artistes: <Palette className="h-8 w-8" />,
  liens: <ExternalLink className="h-8 w-8" />,
};

const categoryLabels: Record<RessourceCategorie, string> = {
  guide: 'Guide pratique',
  juridique: 'Information juridique',
  comptabilite: 'Ressource comptable',
  artistes: 'Secteur artistique',
  liens: 'Lien utile',
};

const categoryColors: Record<RessourceCategorie, {
  gradient: string;
  lightGradient: string;
  text: string;
  bg: string;
  border: string;
  accentBg: string;
}> = {
  guide: {
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    lightGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    text: 'text-emerald-700',
    bg: 'bg-emerald-100',
    border: 'border-emerald-200',
    accentBg: 'bg-emerald-500',
  },
  juridique: {
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    lightGradient: 'from-blue-50 via-indigo-50 to-violet-50',
    text: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    accentBg: 'bg-blue-500',
  },
  comptabilite: {
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    lightGradient: 'from-amber-50 via-orange-50 to-red-50',
    text: 'text-amber-700',
    bg: 'bg-amber-100',
    border: 'border-amber-200',
    accentBg: 'bg-amber-500',
  },
  artistes: {
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    lightGradient: 'from-purple-50 via-fuchsia-50 to-pink-50',
    text: 'text-purple-700',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    accentBg: 'bg-purple-500',
  },
  liens: {
    gradient: 'from-slate-500 via-gray-500 to-zinc-500',
    lightGradient: 'from-slate-50 via-gray-50 to-zinc-50',
    text: 'text-slate-700',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    accentBg: 'bg-slate-500',
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Illustration component based on category
function CategoryIllustration({ category }: { category: RessourceCategorie }) {
  const colors = categoryColors[category];

  return (
    <div className="relative w-full h-48 sm:h-64 overflow-hidden rounded-2xl">
      {/* Animated gradient background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-90',
        colors.gradient
      )} />

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

        {/* Floating elements */}
        <div className="absolute top-8 right-8 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-16 right-24 w-3 h-3 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        <div className="absolute bottom-12 left-12 w-5 h-5 bg-white/25 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
      </div>

      {/* Central icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl scale-150" />
          <div className="relative flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30 text-white">
            {categoryIcons[category]}
          </div>
        </div>
      </div>

      {/* Sparkles */}
      <Sparkles className="absolute top-6 left-6 w-6 h-6 text-white/40" />
      <Sparkles className="absolute bottom-6 right-6 w-5 h-5 text-white/30" />
    </div>
  );
}

// Callout box component
function CalloutBox({
  children,
  type = 'info',
}: {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'tip' | 'important';
  colors?: typeof categoryColors.guide;
}) {
  const config = {
    info: {
      icon: <Info className="h-4 w-4" />,
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-400',
      iconColor: 'text-blue-600',
      title: 'À savoir',
    },
    warning: {
      icon: <AlertTriangle className="h-4 w-4" />,
      bg: 'bg-amber-50',
      border: 'border-l-4 border-amber-400',
      iconColor: 'text-amber-600',
      title: 'Attention',
    },
    tip: {
      icon: <Lightbulb className="h-4 w-4" />,
      bg: 'bg-emerald-50',
      border: 'border-l-4 border-emerald-400',
      iconColor: 'text-emerald-600',
      title: 'Conseil',
    },
    important: {
      icon: <AlertCircle className="h-4 w-4" />,
      bg: 'bg-rose-50',
      border: 'border-l-4 border-rose-400',
      iconColor: 'text-rose-600',
      title: 'Important',
    },
  };

  const c = config[type];

  return (
    <div className={cn(
      'rounded-lg p-4 my-4',
      c.bg,
      c.border
    )}>
      <div className="flex gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', c.iconColor)}>
          {c.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-sm mb-1', c.iconColor)}>{c.title}</p>
          <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Quote/highlight box
function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 pl-4 py-2 border-l-4 border-gray-300 bg-gray-50 rounded-r-lg">
      <div className="text-gray-600 italic leading-relaxed">
        {children}
      </div>
    </div>
  );
}

// Types for parsed content blocks
type ContentBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'numbered-list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'paragraph'; text: string };

// Parse content into structured blocks
function parseContent(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Main heading (##)
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.replace('## ', '') });
      i++;
      continue;
    }

    // Sub heading (###)
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.replace('### ', '') });
      i++;
      continue;
    }

    // Bullet list
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().replace(/^- /, ''));
        i++;
      }
      blocks.push({ type: 'bullet-list', items });
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ''));
        i++;
      }
      blocks.push({ type: 'numbered-list', items });
      continue;
    }

    // Table
    if (line.includes('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
        const rows = tableLines.slice(2).map(l => l.split('|').filter(Boolean).map(c => c.trim()));
        blocks.push({ type: 'table', headers, rows });
      }
      continue;
    }

    // Regular paragraph
    blocks.push({ type: 'paragraph', text: line });
    i++;
  }

  return blocks;
}

// Format text with bold markers
function formatText(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
}

// Get icon for section based on keywords
function getSectionIcon(title: string): typeof BookOpen {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('étape') || lowerTitle.includes('procédure') || lowerTitle.includes('démarche')) {
    return ListChecks;
  }
  if (lowerTitle.includes('obligation') || lowerTitle.includes('règle') || lowerTitle.includes('condition')) {
    return FileCheck;
  }
  if (lowerTitle.includes('membre') || lowerTitle.includes('administrateur') || lowerTitle.includes('équipe')) {
    return Users;
  }
  if (lowerTitle.includes('finance') || lowerTitle.includes('budget') || lowerTitle.includes('comptab') || lowerTitle.includes('trésor')) {
    return Coins;
  }
  if (lowerTitle.includes('statut') || lowerTitle.includes('document') || lowerTitle.includes('contrat')) {
    return ScrollText;
  }
  if (lowerTitle.includes('protection') || lowerTitle.includes('sécurité') || lowerTitle.includes('rgpd') || lowerTitle.includes('responsab')) {
    return ShieldCheck;
  }
  if (lowerTitle.includes('class') || lowerTitle.includes('type') || lowerTitle.includes('catégorie')) {
    return Briefcase;
  }
  if (lowerTitle.includes('délai') || lowerTitle.includes('date') || lowerTitle.includes('calendrier')) {
    return Clock;
  }
  if (lowerTitle.includes('conseil') || lowerTitle.includes('astuce') || lowerTitle.includes('pratique')) {
    return Lightbulb;
  }

  return BookOpen;
}

function RenderContent({ content, colors }: { content: string; colors: typeof categoryColors.guide }) {
  const blocks = parseContent(content);
  let sectionCount = 0;

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        // Main heading (##)
        if (block.type === 'h2') {
          sectionCount++;
          const Icon = getSectionIcon(block.text);

          return (
            <div key={idx} className={sectionCount > 1 ? 'pt-10 mt-10 border-t border-gray-100' : ''}>
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  'flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center',
                  'shadow-lg',
                  `bg-gradient-to-br ${colors.gradient}`
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {block.text}
                </h2>
              </div>
            </div>
          );
        }

        // Sub heading (###)
        if (block.type === 'h3') {
          return (
            <div key={idx} className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'w-2 h-8 rounded-full',
                  `bg-gradient-to-b ${colors.gradient}`
                )} />
                <h3 className="text-lg font-semibold text-gray-800">
                  {block.text}
                </h3>
              </div>
            </div>
          );
        }

        // Bullet list
        if (block.type === 'bullet-list') {
          return (
            <ul key={idx} className="space-y-2 my-4">
              {block.items.map((item, i) => {
                const boldMatch = item.match(/^\*\*(.*?)\*\*\s*(.*)/);
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={cn(
                        'flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2',
                        colors.accentBg
                      )}
                    />
                    {boldMatch ? (
                      <span className="text-gray-700 leading-relaxed">
                        <strong className="font-semibold text-gray-900">{boldMatch[1]}</strong>
                        {boldMatch[2] && <span> {boldMatch[2]}</span>}
                      </span>
                    ) : (
                      <span
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatText(item) }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Numbered list
        if (block.type === 'numbered-list') {
          return (
            <div key={idx} className="my-6 space-y-4">
              {block.items.map((item, i) => {
                const boldMatch = item.match(/^\*\*(.*?)\*\*\s*(.*)/);
                const displayText = boldMatch ? boldMatch[1] : item.replace(/\*\*/g, '');
                const remainingText = boldMatch ? boldMatch[2] : '';

                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                      'font-semibold text-white text-sm',
                      `bg-gradient-to-br ${colors.gradient}`
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="text-gray-900 font-medium">{displayText}</span>
                      {remainingText && (
                        <span
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{ __html: ' ' + formatText(remainingText) }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Table
        if (block.type === 'table') {
          return (
            <div key={idx} className="my-6 overflow-x-auto">
              <table className="min-w-full border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className={cn('text-white', `bg-gradient-to-r ${colors.gradient}`)}>
                    {block.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left font-semibold text-sm">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {block.rows.map((row, i) => (
                    <tr key={i} className="bg-white hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 text-gray-700 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Paragraph
        if (block.type === 'paragraph') {
          const text = block.text;
          const lowerText = text.toLowerCase();

          // Callout types based on content
          if (lowerText.includes('attention') || lowerText.includes('vigilant')) {
            return (
              <CalloutBox key={idx} type="warning">
                <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
              </CalloutBox>
            );
          }

          if (lowerText.includes('conseil') || lowerText.includes('astuce') || lowerText.includes('recommand')) {
            return (
              <CalloutBox key={idx} type="tip">
                <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
              </CalloutBox>
            );
          }

          if (lowerText.includes('important') || lowerText.includes('essentiel') || lowerText.includes('crucial')) {
            return (
              <CalloutBox key={idx} type="important">
                <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
              </CalloutBox>
            );
          }

          if (lowerText.includes('note') || lowerText.includes('à savoir') || lowerText.includes('bon à savoir')) {
            return (
              <CalloutBox key={idx} type="info">
                <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
              </CalloutBox>
            );
          }

          // Quote
          if (text.startsWith('"') || text.startsWith('«')) {
            return (
              <HighlightBox key={idx}>
                <span dangerouslySetInnerHTML={{ __html: formatText(text) }} />
              </HighlightBox>
            );
          }

          // Regular paragraph
          return (
            <p
              key={idx}
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatText(text) }}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

export default function RessourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ressourceId = params.id as string;

  const ressource = mockRessources.find(r => r.id === ressourceId);

  // Get related resources
  const relatedRessources = ressource
    ? mockRessources
        .filter(r => r.id !== ressource.id && r.categorie === ressource.categorie)
        .slice(0, 3)
    : [];

  if (!ressource) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <Card className="p-16 text-center bg-gradient-to-br from-gray-50 to-slate-50">
          <FileText className="h-20 w-20 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ressource introuvable</h2>
          <p className="text-gray-500 mb-8">Cette ressource n'existe pas ou a été supprimée.</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600">
            <Link href="/dashboard/ressources">
              <BookOpen className="h-4 w-4 mr-2" />
              Voir toutes les ressources
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const colors = categoryColors[ressource.categorie];

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux ressources
        </Button>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero section with illustration */}
      <CategoryIllustration category={ressource.categorie} />

      {/* Title and meta */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className={cn(
            'px-4 py-1.5 text-sm font-medium',
            `bg-gradient-to-r ${colors.gradient}`,
            'text-white border-0 shadow-sm'
          )}>
            {categoryLabels[ressource.categorie]}
          </Badge>
          {ressource.important && (
            <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 px-4 py-1.5">
              <Star className="h-3.5 w-3.5 mr-1.5 fill-current" />
              Ressource essentielle
            </Badge>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          {ressource.titre}
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed">
          {ressource.description}
        </p>

        {/* Meta info bar */}
        <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Mis à jour le {formatDate(ressource.updated_at)}
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            {ressource.tags.length} tags
          </div>
          {ressource.url && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Source externe
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {ressource.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-white shadow-sm border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* External link CTA */}
      {ressource.url && (
        <Card className={cn(
          'p-6 border-2 shadow-lg overflow-hidden relative',
          `bg-gradient-to-r ${colors.lightGradient}`,
          colors.border
        )}>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                'flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-lg',
                `bg-gradient-to-br ${colors.gradient}`
              )}>
                <Globe className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">Accéder à la source officielle</p>
                <p className="text-sm text-gray-500 truncate max-w-md">{ressource.url}</p>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className={cn(
                'shadow-lg hover:shadow-xl transition-all',
                `bg-gradient-to-r ${colors.gradient}`,
                'hover:opacity-90'
              )}
            >
              <a href={ressource.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5 mr-2" />
                Ouvrir le site
              </a>
            </Button>
          </div>
        </Card>
      )}

      {/* Main content */}
      {ressource.contenu ? (
        <Card className="relative overflow-hidden p-6 sm:p-10 shadow-xl border-gray-100">
          {/* Decorative circles */}
          <div
            className={cn(
              'absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10',
              `bg-gradient-to-br ${colors.gradient}`
            )}
          />
          <div
            className={cn(
              'absolute -bottom-20 -left-20 w-56 h-56 rounded-full opacity-5',
              `bg-gradient-to-br ${colors.gradient}`
            )}
          />
          <div
            className={cn(
              'absolute top-1/3 -right-10 w-24 h-24 rounded-full opacity-10',
              `bg-gradient-to-br ${colors.gradient}`
            )}
          />

          {/* Content */}
          <div className="relative z-10">
            <RenderContent content={ressource.contenu} colors={colors} />
          </div>
        </Card>
      ) : (
        <Card className="p-16 text-center bg-gradient-to-br from-gray-50 to-slate-50 border-gray-100">
          <div className={cn(
            'w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6',
            `bg-gradient-to-br ${colors.gradient}`
          )}>
            <ExternalLink className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ressource externe</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Cette ressource est disponible sur un site externe. Cliquez sur le bouton ci-dessus pour y accéder directement.
          </p>
        </Card>
      )}

      {/* Related resources */}
      {relatedRessources.length > 0 && (
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              `bg-gradient-to-br ${colors.gradient}`
            )}>
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ressources similaires</h2>
              <p className="text-sm text-gray-500">Continuez votre lecture</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedRessources.map((related) => (
              <Link key={related.id} href={`/dashboard/ressources/${related.id}`}>
                <Card className={cn(
                  'p-5 h-full transition-all duration-300',
                  'hover:shadow-lg hover:-translate-y-1',
                  'border-gray-100 hover:border-gray-200',
                  `bg-gradient-to-br ${colors.lightGradient}`
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0',
                      `bg-gradient-to-br ${colors.gradient}`
                    )}>
                      {categoryIcons[related.categorie]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-rose-700">
                        {related.titre}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {related.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux ressources
        </Button>
        {ressource.url && (
          <Button
            asChild
            className={cn(
              'gap-2 w-full sm:w-auto',
              `bg-gradient-to-r ${colors.gradient}`,
              'hover:opacity-90'
            )}
          >
            <a href={ressource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Visiter le site officiel
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
