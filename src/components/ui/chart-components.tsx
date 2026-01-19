'use client';

import { formatCurrency } from '@/lib/utils';

// Custom Tooltip moderne
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

export function ModernTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-lg p-3 min-w-[140px]">
      <p className="text-xs font-medium text-gray-500 mb-2 pb-2 border-b border-gray-100">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-600">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Couleurs modernes pour les graphiques
export const MODERN_COLORS = {
  credit: {
    main: '#10b981',
    gradient: ['#34d399', '#10b981'],
    light: '#d1fae5',
  },
  debit: {
    main: '#f43f5e',
    gradient: ['#fb7185', '#f43f5e'],
    light: '#ffe4e6',
  },
  solde: {
    main: '#8b5cf6',
    gradient: ['#a78bfa', '#8b5cf6'],
    light: '#ede9fe',
  },
  primary: {
    main: '#6366f1',
    gradient: ['#818cf8', '#6366f1'],
    light: '#e0e7ff',
  },
  secondary: {
    main: '#06b6d4',
    gradient: ['#22d3ee', '#06b6d4'],
    light: '#cffafe',
  },
  tertiary: {
    main: '#f59e0b',
    gradient: ['#fbbf24', '#f59e0b'],
    light: '#fef3c7',
  },
};

// Configuration des axes moderne
export const modernAxisConfig = {
  axisLine: false,
  tickLine: false,
  tick: { fill: '#94a3b8', fontSize: 11 },
  tickMargin: 10,
};

// Configuration de la grille moderne
export const modernGridConfig = {
  strokeDasharray: '4 4',
  stroke: '#e2e8f0',
  vertical: false,
};

// Dégradés SVG pour les graphiques
export function ChartGradients() {
  return (
    <defs>
      {/* Crédit gradient */}
      <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34d399" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="creditStroke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>

      {/* Débit gradient */}
      <linearGradient id="debitGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb7185" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="debitStroke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>

      {/* Solde gradient */}
      <linearGradient id="soldeGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="soldeStroke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>

      {/* Primary gradient */}
      <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.1} />
      </linearGradient>

      {/* Secondary gradient */}
      <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
      </linearGradient>

      {/* Bar gradients (horizontal) */}
      <linearGradient id="creditBarGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="debitBarGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb7185" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
      <linearGradient id="soldeBarGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
      <linearGradient id="primaryBarGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>

      {/* Glow filters */}
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// Légende moderne personnalisée
interface LegendItem {
  value: string;
  color: string;
}

interface ModernLegendProps {
  items: LegendItem[];
}

export function ModernLegend({ items }: ModernLegendProps) {
  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs font-medium text-gray-600">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// Style pour les dots sur les lignes
export const modernDotConfig = {
  r: 4,
  strokeWidth: 2,
  fill: '#fff',
};

export const modernActiveDotConfig = {
  r: 6,
  strokeWidth: 2,
  fill: '#fff',
  filter: 'url(#glow)',
};
