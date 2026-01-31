/**
 * Script pour parser les bilans annuels EXACTEMENT comme dans les Google Sheets
 *
 * NOTE: Suite aux problèmes de cohérence des données historiques,
 * ce script ne traite désormais QUE l'année 2026.
 *
 * Totaux attendus (vérifiés depuis les fichiers):
 * - 2026: Crédit 2249.90€, Débit 5325.89€, Clôture 51377.64€
 */

const fs = require('fs');
const path = require('path');

const SHEETS_FOLDER = path.join(__dirname, '../../bilan compta O.V.N.I ');
const OUTPUT_FILE = path.join(__dirname, '../supabase/migrations/20260131000000_seed_transactions_2026.sql');

// Artistes triés par longueur (plus long en premier pour éviter Jul/Juliette)
const ARTISTES = ['Juliette', 'Geoffrey', 'Camille', 'Greta', 'Maïa', 'Emma', 'Iris', 'Léa', 'Lou', 'Jul'];
const PROJETS = ['TALU', 'LVLR', 'POEM', 'GEO', 'WP'];

function cleanText(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}

function parseNumber(text) {
  if (!text) return 0;
  const cleaned = cleanText(text).replace(/[€\s]/g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.abs(num);
}

function parseDate(text, year) {
  if (!text) return null;
  const cleaned = cleanText(text);

  // Ignorer les lignes spéciales
  if (/^(sur le compte|total|cloture|clôture|compte|report|en trop)/i.test(cleaned)) return null;
  if (/^(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i.test(cleaned)) return null;

  // DD/MM/YYYY
  let match = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const [, d, m, y] = match;
    if (+m >= 1 && +m <= 12 && +d >= 1 && +d <= 31) {
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  }

  // DD/MM/YY (avec gestion des erreurs comme 22/15/24 → 22/12/24)
  match = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (match) {
    let [, d, m, yy] = match;
    const y = 2000 + parseInt(yy);
    // Corriger les mois invalides (ex: 15 → 12)
    if (+m > 12) m = '12';
    if (+m >= 1 && +m <= 12 && +d >= 1 && +d <= 31) {
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  }

  // MM/YYYY (ex: 05/2025 → 01/05/2025)
  match = cleaned.match(/^(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [, m, y] = match;
    if (+m >= 1 && +m <= 12) {
      return `${y}-${m.padStart(2, '0')}-01`;
    }
  }

  // DD/MM
  match = cleaned.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (match) {
    const [, d, m] = match;
    if (+m >= 1 && +m <= 12 && +d >= 1 && +d <= 31) {
      return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  }

  return null;
}

function identifyEntity(qui, desc) {
  const q = (qui || '').toUpperCase();
  const d = (desc || '').toUpperCase();
  const combined = q + ' ' + d;

  // Projets d'abord
  if (combined.includes('TALU') || combined.includes('LE TALU')) return { type: 'projet', code: 'TALU' };
  if (combined.includes('LVLR')) return { type: 'projet', code: 'LVLR' };
  if (combined.includes('WIRELESS') || (q === 'WP' || d.startsWith('WP '))) return { type: 'projet', code: 'WP' };
  if (combined.includes('POEM') || combined.includes('POEMA')) return { type: 'projet', code: 'POEM' };
  if (q === 'GEO' || d.startsWith('GEO ') || d.startsWith('GEO/')) return { type: 'projet', code: 'GEO' };

  // Artistes (plus long en premier)
  for (const a of ARTISTES) {
    if (combined.includes(a.toUpperCase())) return { type: 'artiste', nom: a };
  }
  if (combined.includes('MAIA') || combined.includes('MAÏA')) return { type: 'artiste', nom: 'Maïa' };
  if (combined.includes('LEA') || combined.includes('LÉA')) return { type: 'artiste', nom: 'Léa' };

  return { type: 'asbl' };
}

function detectCategorie(desc) {
  const d = (desc || '').toLowerCase();
  if (d.includes('smart')) return 'smart';
  if (d.includes('thomann') || d.includes('thoman')) return 'thoman';
  if (d.includes('loyer') || d.includes('communa')) return 'loyer';
  if (d.includes('triodos') || d.includes('frais banc')) return 'frais_bancaires';
  if (d.includes('matos') || d.includes('matériel') || d.includes('materiel')) return 'materiel';
  if (d.includes('train') || d.includes('trajet') || d.includes('km') || d.includes('essence')) return 'deplacement';
  if (d.includes('cachet') || d.includes('concert')) return 'cachet';
  if (d.includes('subvention') || d.includes('fwb') || d.includes('bourse')) return 'subvention';
  // Note: 'assurance' n'existe pas dans l'enum, on utilise 'autre'
  return 'autre';
}

function escapeSQL(text) {
  if (!text) return '';
  return text.replace(/'/g, "''");
}

// ============================================
// PARSERS SPÉCIFIQUES PAR ANNÉE
// ============================================

function parse2025_2026(filePath, year) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];
  const rows = content.split(/<tr[^>]*>/).slice(1);

  for (const row of rows) {
    const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells = cellMatches.map(m => m[1]);
    if (cells.length < 6) continue;

    const cell0 = cleanText(cells[0]);
    const rawDate = cleanText(cells[1]);
    const creditVal = parseNumber(cells[2]);
    const debitVal = parseNumber(cells[3]);
    const qui = cleanText(cells[4]);
    const quoi = cleanText(cells[5]);

    // Cas spécial: EN TROP (ajustement) - dans cells[0], valeur dans cells[2]
    if (cell0 === 'EN TROP' && creditVal > 0) {
      transactions.push({
        date: `${year}-01-01`,
        description: 'Ajustement EN TROP (régularisation exercice précédent)',
        credit: creditVal,
        debit: 0,
        entity: { type: 'asbl' },
        categorie: 'autre',
        source: `${year}.html`
      });
      continue;
    }

    // Ignorer CLOTURE, COMPTE, etc.
    if (/^(CLOTURE|COMPTE)/i.test(cell0)) continue;
    if (/^(CLOTURE|COMPTE|DATE|TOTAL)/i.test(rawDate)) continue;

    const date = parseDate(rawDate, year);
    if (!date) continue;
    if (creditVal === 0 && debitVal === 0) continue;

    const desc = quoi || (creditVal > 0 ? 'Entrée' : 'Sortie');
    const entity = identifyEntity(qui, desc);

    transactions.push({
      date,
      description: desc.substring(0, 500),
      credit: creditVal,
      debit: debitVal,
      entity,
      categorie: detectCategorie(desc),
      source: `${year}.html`
    });
  }

  return transactions;
}

function parse2023_2024(filePath, year, dateColIndex) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];
  const rows = content.split(/<tr[^>]*>/).slice(1);

  for (const row of rows) {
    const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells = cellMatches.map(m => cleanText(m[1]));
    if (cells.length < dateColIndex + 4) continue;

    const rawDate = cells[dateColIndex];
    const creditVal = parseNumber(cells[dateColIndex + 1]);
    const debitVal = parseNumber(cells[dateColIndex + 2]);
    const desc = cells[dateColIndex + 3];

    // Ignorer les lignes de solde
    if (/^(sur le compte|total|cloture|mise à jour)/i.test(rawDate)) continue;
    if (!rawDate) continue;

    // Ignorer si c'est un nombre seul (ligne de solde intermédiaire)
    if (parseNumber(rawDate) > 1000 && !rawDate.includes('/')) continue;

    const date = parseDate(rawDate, year);
    if (!date) continue;
    if (creditVal === 0 && debitVal === 0) continue;

    const entity = identifyEntity('', desc);

    transactions.push({
      date,
      description: (desc || (creditVal > 0 ? 'Entrée' : 'Sortie')).substring(0, 500),
      credit: creditVal,
      debit: debitVal,
      entity,
      categorie: detectCategorie(desc),
      source: `${year}.html`
    });
  }

  return transactions;
}

function parse2021_2022(filePath, year) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];
  const rows = content.split(/<tr[^>]*>/).slice(1);

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells = cellMatches.map(m => cleanText(m[1]));
    if (cells.length < 4) continue;

    // Cas spécial pour 2021: Row 3 contient une transaction sans date
    // cells[9]: montant, cells[10]: description
    if (year === 2021 && rowIdx === 3 && cells.length > 10) {
      const amount = parseNumber(cells[9]);
      const desc = cells[10];
      if (amount > 0 && desc && desc.toLowerCase().includes('ethias')) {
        transactions.push({
          date: `${year}-12-31`, // Fin d'année pour l'assurance annuelle
          description: desc.substring(0, 500),
          credit: 0,
          debit: amount,
          entity: { type: 'asbl' },
          categorie: 'autre', // 'assurance' n'existe pas dans l'enum
          source: `${year}.html`
        });
      }
    }

    // Format multi-colonnes: plusieurs transactions par ligne
    // Chercher tous les blocs DATE, CREDIT, DEBIT, DESC
    for (let i = 0; i < cells.length - 3; i++) {
      const rawDate = cells[i];
      const creditVal = parseNumber(cells[i + 1]);
      const debitVal = parseNumber(cells[i + 2]);
      const desc = cells[i + 3];

      // Ignorer les lignes spéciales
      if (/^(sur le compte|total|ok validé)/i.test(rawDate)) continue;
      if (!rawDate) continue;

      const date = parseDate(rawDate, year);
      if (!date) continue;
      if (creditVal === 0 && debitVal === 0) continue;

      // Vérifier que la description n'est pas une date (éviter les faux positifs)
      if (parseDate(desc, year)) continue;

      const entity = identifyEntity('', desc);

      transactions.push({
        date,
        description: (desc || (creditVal > 0 ? 'Entrée' : 'Sortie')).substring(0, 500),
        credit: creditVal,
        debit: debitVal,
        entity,
        categorie: detectCategorie(desc),
        source: `${year}.html`
      });
    }
  }

  return transactions;
}

// ============================================
// FONCTION PRINCIPALE
// ============================================

function main() {
  console.log('🔍 Parsing EXACT du bilan 2026 uniquement...\n');

  // Totaux attendus pour vérification (2026 uniquement)
  const expected = {
    2026: { credit: 2249.90, debit: 5325.89 }
  };

  const allTransactions = [];

  // Parser uniquement 2026 (les données historiques ne sont plus importées)
  const parsers = [
    { year: 2026, parser: () => parse2025_2026(path.join(SHEETS_FOLDER, '2026.html'), 2026) },
  ];

  for (const { year, parser } of parsers) {
    try {
      const txs = parser();
      const credit = txs.reduce((s, t) => s + t.credit, 0);
      const debit = txs.reduce((s, t) => s + t.debit, 0);

      console.log(`📄 ${year}: ${txs.length} transactions`);
      console.log(`   Crédit: ${credit.toFixed(2)}€`);
      console.log(`   Débit: ${debit.toFixed(2)}€`);

      if (expected[year]) {
        const creditDiff = credit - expected[year].credit;
        const debitDiff = debit - expected[year].debit;
        if (Math.abs(creditDiff) > 0.01 || Math.abs(debitDiff) > 0.01) {
          console.log(`   ⚠️  Écart: Crédit ${creditDiff.toFixed(2)}€, Débit ${debitDiff.toFixed(2)}€`);
        } else {
          console.log(`   ✅ EXACT`);
        }
      }
      console.log('');

      allTransactions.push(...txs);
    } catch (err) {
      console.error(`❌ Erreur ${year}: ${err.message}`);
    }
  }

  // Ne PAS dédupliquer - les transactions identiques peuvent être légitimes
  // (même date, même montant, même description = 2 paiements distincts)
  allTransactions.sort((a, b) => a.date.localeCompare(b.date));

  const totalCredit = allTransactions.reduce((s, t) => s + t.credit, 0);
  const totalDebit = allTransactions.reduce((s, t) => s + t.debit, 0);

  console.log('📊 Résumé final:');
  console.log(`   Transactions: ${allTransactions.length}`);
  console.log(`   Crédit total: ${totalCredit.toFixed(2)}€`);
  console.log(`   Débit total: ${totalDebit.toFixed(2)}€`);
  console.log(`   Solde: ${(totalCredit - totalDebit).toFixed(2)}€`);

  // Générer SQL
  let sql = `-- =============================================
-- O.V.N.I Compta - Import des transactions 2026 UNIQUEMENT
-- Généré le ${new Date().toISOString()}
-- =============================================

-- NOTE: Les données historiques (2021-2025) ne sont plus importées
-- car elles n'étaient pas cohérentes avec les Google Sheets originaux.
-- Seules les données de 2026 sont désormais gérées par l'application.

-- IMPORTANT: Exécuter d'abord pour nettoyer les anciennes transactions:
-- DELETE FROM transferts;
-- DELETE FROM transactions;

-- Ajout de l'artiste Juliette si manquant
INSERT INTO artistes (nom, actif, couleur, notes) VALUES
  ('Juliette', true, '#FFD700', 'Ajouté via import')
ON CONFLICT (nom) DO NOTHING;

`;

  // Grouper par année
  const byYear = {};
  for (const t of allTransactions) {
    const y = t.date.substring(0, 4);
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(t);
  }

  for (const [year, txs] of Object.entries(byYear).sort()) {
    sql += `\n-- Année ${year} (${txs.length} transactions)\n`;
    sql += `INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie) VALUES\n`;

    const values = txs.map(t => {
      let artisteSQL = 'NULL';
      let projetSQL = 'NULL';

      if (t.entity.type === 'artiste') {
        artisteSQL = `(SELECT id FROM artistes WHERE nom = '${escapeSQL(t.entity.nom)}')`;
      } else if (t.entity.type === 'projet') {
        projetSQL = `(SELECT id FROM projets WHERE code = '${escapeSQL(t.entity.code)}')`;
      }

      return `  ('${t.date}', '${escapeSQL(t.description)}', ${t.credit}, ${t.debit}, ${artisteSQL}, ${projetSQL}, '${t.categorie}')`;
    });

    sql += values.join(',\n') + '\nON CONFLICT DO NOTHING;\n';
  }

  sql += `
-- Vérification
SELECT
  'Transactions' as metric, COUNT(*) as value FROM transactions
UNION ALL SELECT 'Crédit total', SUM(credit) FROM transactions
UNION ALL SELECT 'Débit total', SUM(debit) FROM transactions
UNION ALL SELECT 'Solde', SUM(credit) - SUM(debit) FROM transactions;
`;

  fs.writeFileSync(OUTPUT_FILE, sql);
  console.log(`\n✅ SQL généré: ${OUTPUT_FILE}`);
}

main();
