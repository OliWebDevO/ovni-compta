// Couleurs centralisées pour l'application O.V.N.I Compta
// Ces couleurs correspondent aux variables CSS définies dans globals.css

// Couleurs pour les crédits (vert pastel)
export const COLORS = {
  credit: {
    DEFAULT: '#10b981',  // text-emerald-600 equivalent
    light: '#86efac',    // fill for charts
    stroke: '#4ade80',   // stroke for charts
  },

  // Couleurs pour les débits (rose pastel)
  debit: {
    DEFAULT: '#f43f5e',  // text-rose-500 equivalent
    light: '#fda4af',    // fill for charts
    stroke: '#fb7185',   // stroke for charts
  },

  // Couleurs pour le solde (violet pastel)
  solde: {
    DEFAULT: '#8b5cf6',
    light: '#c4b5fd',    // fill for charts
    stroke: '#a78bfa',   // stroke for charts
  },

  // Couleurs pour les catégories de graphiques
  categories: {
    green: '#10b981',
    indigo: '#6366f1',
    amber: '#f59e0b',
    purple: '#8b5cf6',
    slate: '#94a3b8',
    blue: '#3b82f6',
    pink: '#ec4899',
  },
} as const;

// Configuration prête à l'emploi pour les graphiques Recharts
export const CHART_CONFIG = {
  credit: {
    stroke: COLORS.credit.stroke,
    fill: COLORS.credit.light,
    fillOpacity: 0.6,
  },
  debit: {
    stroke: COLORS.debit.stroke,
    fill: COLORS.debit.light,
    fillOpacity: 0.6,
  },
  solde: {
    stroke: COLORS.solde.stroke,
    fill: COLORS.solde.light,
    fillOpacity: 0.6,
  },
} as const;

// Classes Tailwind pour le texte (à utiliser avec cn())
export const TEXT_COLORS = {
  credit: 'text-emerald-600',
  debit: 'text-rose-500',
  solde: 'text-violet-600',
  neutral: 'text-gray-600',
} as const;

// Classes pour les icônes
export const ICON_COLORS = {
  credit: 'text-emerald-600',
  debit: 'text-rose-500',
} as const;
