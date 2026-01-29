/**
 * Script pour parser les bilans annuels (2021-2026) depuis les exports HTML de Google Sheets
 * et générer un fichier SQL de seed propre pour Supabase
 *
 * Usage: node scripts/parse-bilans-annuels.js
 */

const fs = require('fs');
const path = require('path');

// Chemin vers le dossier avec les exports HTML
const SHEETS_FOLDER = path.join(__dirname, '../../bilan compta O.V.N.I ');
const OUTPUT_FILE = path.join(__dirname, '../supabase/migrations/20250129000000_seed_transactions_v2.sql');

// =============================================
// Configuration des mappings
// =============================================

// Tous les artistes connus (incluant ceux qui manquaient)
const ARTISTES = [
  'Maïa', 'Geoffrey', 'Camille', 'Iris', 'Emma', 'Greta', 'Jul', 'Léa', 'Lou',
  'Juliette', // Ajouté - manquait dans le seed original
];

// Tous les projets connus
const PROJETS = ['GEO', 'TALU', 'LVLR', 'WP', 'POEM'];

// Mapping des variations de noms vers les noms canoniques
const NAME_MAPPINGS = {
  // Artistes
  'maia': 'Maïa',
  'maïa': 'Maïa',
  'MAIA': 'Maïa',
  'geoffrey': 'Geoffrey',
  'geo': null, // GEO est un projet, pas Geoffrey
  'camille': 'Camille',
  'iris': 'Iris',
  'emma': 'Emma',
  'greta': 'Greta',
  'jul': 'Jul',
  'juliette': 'Juliette',
  'léa': 'Léa',
  'lea': 'Léa',
  'lou': 'Lou',
  // Projets
  'GEO': { type: 'projet', code: 'GEO' },
  'TALU': { type: 'projet', code: 'TALU' },
  'LE TALU': { type: 'projet', code: 'TALU' },
  'LVLR': { type: 'projet', code: 'LVLR' },
  'WP': { type: 'projet', code: 'WP' },
  'WIRELESS': { type: 'projet', code: 'WP' },
  'WIRELESS PEOPLE': { type: 'projet', code: 'WP' },
  'POEM': { type: 'projet', code: 'POEM' },
  'POEMA': { type: 'projet', code: 'POEM' },
  // Cas spéciaux
  'FRAIS ASBL': { type: 'asbl', code: null },
  'OVNI': { type: 'asbl', code: null },
  'ASBL': { type: 'asbl', code: null },
};

// =============================================
// Fonctions utilitaires
// =============================================

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Supprimer les tags HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseNumber(text) {
  if (!text) return 0;
  const cleaned = cleanText(text)
    .replace(/[€\s]/g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.abs(num);
}

function parseDate(text, defaultYear) {
  if (!text) return null;
  const cleaned = cleanText(text);

  // Ignorer les lignes de totaux, clôtures, reports, etc.
  if (/^(TOTAL|CLOTURE|CLÔTURE|COMPTE|Report|EN TROP|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i.test(cleaned)) {
    return null;
  }

  // Format: DD/MM/YYYY (ex: 15/03/2025)
  let match = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  // Format: DD/MM/YY (ex: 01/03/25, 4/5/25)
  match = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    let year = parseInt(match[3]);
    // Convertir année 2 chiffres en 4 chiffres (21-99 = 2021-2099, 00-20 = 2000-2020)
    year = year >= 21 ? 2000 + year : 2000 + year;
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  // Format: DD/MM (sans année, ex: 15/01)
  match = cleaned.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${defaultYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  return null;
}

// Identifier l'artiste ou projet depuis le texte QUI ou la description
function identifyEntity(quiText, descriptionText) {
  const qui = cleanText(quiText).toUpperCase().trim();
  const desc = cleanText(descriptionText).toUpperCase();

  // Trier les artistes par longueur décroissante pour éviter les faux positifs
  // (ex: 'Jul' ne doit pas matcher 'JULIETTE')
  const artistesSorted = [...ARTISTES].sort((a, b) => b.length - a.length);

  // 1. Chercher dans QUI d'abord
  if (qui) {
    // Vérifier les projets
    for (const projet of PROJETS) {
      if (qui.includes(projet) || qui === projet) {
        return { type: 'projet', code: projet, artiste: null };
      }
    }
    // Cas spécial: TALU
    if (qui.includes('TALU') || qui.includes('LE TALU')) {
      return { type: 'projet', code: 'TALU', artiste: null };
    }
    // Cas spécial: WP / WIRELESS
    if (qui.includes('WP') || qui.includes('WIRELESS')) {
      return { type: 'projet', code: 'WP', artiste: null };
    }

    // Vérifier les artistes (plus longs noms en premier)
    for (const artiste of artistesSorted) {
      if (qui.includes(artiste.toUpperCase())) {
        return { type: 'artiste', artiste: artiste, code: null };
      }
    }
    // Variations
    if (qui.includes('MAIA') || qui.includes('MAÏA')) {
      return { type: 'artiste', artiste: 'Maïa', code: null };
    }
    if (qui.includes('LEA') || qui.includes('LÉA')) {
      return { type: 'artiste', artiste: 'Léa', code: null };
    }

    // FRAIS ASBL / OVNI = transaction ASBL sans artiste/projet
    if (qui.includes('FRAIS') || qui.includes('ASBL') || qui.includes('OVNI')) {
      return { type: 'asbl', artiste: null, code: null };
    }
  }

  // 2. Chercher dans la description (format "ARTISTE / description")
  if (desc) {
    const parts = desc.split('/');
    if (parts.length >= 1) {
      const firstPart = parts[0].trim();

      // Projets
      for (const projet of PROJETS) {
        if (firstPart.includes(projet)) {
          return { type: 'projet', code: projet, artiste: null };
        }
      }
      if (firstPart.includes('TALU')) {
        return { type: 'projet', code: 'TALU', artiste: null };
      }
      if (firstPart.includes('WIRELESS') || firstPart === 'WP') {
        return { type: 'projet', code: 'WP', artiste: null };
      }

      // Artistes (plus longs noms en premier)
      for (const artiste of artistesSorted) {
        if (firstPart.includes(artiste.toUpperCase())) {
          return { type: 'artiste', artiste: artiste, code: null };
        }
      }
      if (firstPart.includes('MAIA') || firstPart.includes('MAÏA')) {
        return { type: 'artiste', artiste: 'Maïa', code: null };
      }
    }
  }

  // 3. Non identifié = ASBL par défaut
  return { type: 'asbl', artiste: null, code: null };
}

function detectCategorie(description) {
  const desc = (description || '').toLowerCase();

  if (desc.includes('smart')) return 'smart';
  if (desc.includes('thomann') || desc.includes('thoman')) return 'thoman';
  if (desc.includes('loyer') || desc.includes('communa')) return 'loyer';
  if (desc.includes('frais') && (desc.includes('banc') || desc.includes('triodos'))) return 'frais_bancaires';
  if (desc.includes('triodos') && !desc.includes('frais')) return 'frais_bancaires';
  if (desc.includes('matos') || desc.includes('micro') || desc.includes('matériel') || desc.includes('materiel')) return 'materiel';
  if (desc.includes('train') || desc.includes('bus') || desc.includes('uber') || desc.includes('taxi') || desc.includes('trajet') || desc.includes('km')) return 'deplacement';
  if (desc.includes('cachet') || desc.includes('concert') || desc.includes('prestation')) return 'cachet';
  if (desc.includes('subvention') || desc.includes('fwb') || desc.includes('aide')) return 'subvention';
  if (desc.includes('transfert') || desc.includes('interne')) return 'transfert_interne';
  if (desc.includes('assurance') || desc.includes('ethias')) return 'assurance';

  return 'autre';
}

function escapeSQL(text) {
  if (!text) return '';
  return text.replace(/'/g, "''");
}

// =============================================
// Parsers pour chaque format d'année
// =============================================

// Parser pour 2025 et 2026 (format avec colonnes QUI, QUOI)
// Structure: [vide], DATE, CREDIT, DEBIT, QUI, QUOI
function parse2025_2026(filePath, year) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];

  const rows = content.split(/<tr[^>]*>/).slice(1);

  for (const row of rows) {
    const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells = cellMatches.map(m => m[1]);

    if (cells.length < 6) continue;

    const dateCell = cells[1];
    const creditCell = cells[2];
    const debitCell = cells[3];
    const quiCell = cells[4];
    const quoiCell = cells[5];

    const date = parseDate(dateCell, year);
    if (!date) continue;

    const credit = parseNumber(creditCell);
    const debit = parseNumber(debitCell);

    if (credit === 0 && debit === 0) continue;

    const quiText = cleanText(quiCell);
    const description = cleanText(quoiCell) || (credit > 0 ? 'Entrée' : 'Sortie');

    // Ignorer les lignes COMPTE/CLOTURE (reports)
    if (description.includes('COMPTE') || description.includes('CLOTURE')) continue;

    const entity = identifyEntity(quiText, description);
    const categorie = detectCategorie(description);

    transactions.push({
      date,
      description: description.substring(0, 500),
      credit,
      debit,
      artiste: entity.artiste,
      projet: entity.code,
      categorie,
      source: `${year}.html`,
    });
  }

  return transactions;
}

// Parser pour 2021 (format multi-colonnes comme 2022)
function parse2021(filePath, year) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];

  const rows = content.split(/<tr[^>]*>/).slice(1);

  for (const row of rows) {
    const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells = cellMatches.map(m => cleanText(m[1]));

    if (cells.length < 4) continue;

    // Parcourir toutes les cellules par blocs pour trouver les transactions
    for (let i = 0; i < cells.length - 3; i++) {
      const dateCell = cells[i];
      const creditCell = cells[i + 1];
      const debitCell = cells[i + 2];
      const descCell = cells[i + 3];

      // Ignorer les lignes de totaux
      if (/^(sur le compte|total)/i.test(dateCell)) continue;
      if (/^(ok validé|validé)/i.test(descCell)) continue;

      const date = parseDate(dateCell, year);
      if (!date) continue;

      const credit = parseNumber(creditCell);
      const debit = parseNumber(debitCell);

      if (credit === 0 && debit === 0) continue;

      const description = descCell || (credit > 0 ? 'Entrée' : 'Sortie');
      if (/^(total|solde|cloture|report)/i.test(description)) continue;

      const entity = identifyEntity('', description);
      const categorie = detectCategorie(description);

      transactions.push({
        date,
        description: description.substring(0, 500),
        credit,
        debit,
        artiste: entity.artiste,
        projet: entity.code,
        categorie,
        source: `${year}.html`,
      });
    }
  }

  return transactions;
}

// Parser pour 2023 (format simple)
// Structure: DATE, CREDIT, DEBIT, DESCRIPTION (cellules 0, 1, 2, 3)
function parse2023(filePath, year) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];

  const rows = content.split(/<tr[^>]*>/).slice(1);

  for (const row of rows) {
    const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells = cellMatches.map(m => cleanText(m[1]));

    if (cells.length < 4) continue;

    const dateCell = cells[0];
    const creditCell = cells[1];
    const debitCell = cells[2];
    const descCell = cells[3];

    const date = parseDate(dateCell, year);
    if (!date) continue;

    const credit = parseNumber(creditCell);
    const debit = parseNumber(debitCell);

    if (credit === 0 && debit === 0) continue;

    const description = descCell || (credit > 0 ? 'Entrée' : 'Sortie');
    if (/^(total|solde|cloture|report)/i.test(description)) continue;

    const entity = identifyEntity('', description);
    const categorie = detectCategorie(description);

    transactions.push({
      date,
      description: description.substring(0, 500),
      credit,
      debit,
      artiste: entity.artiste,
      projet: entity.code,
      categorie,
      source: `${year}.html`,
    });
  }

  return transactions;
}

// Parser pour 2022 (format multi-colonnes)
// Chaque ligne contient PLUSIEURS transactions côte à côte
// Structure: DATE, CREDIT, DEBIT, DESC, [vide], DATE2, CREDIT2, DEBIT2, DESC2, ...
function parse2022(filePath, year) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];

  const rows = content.split(/<tr[^>]*>/).slice(1);

  for (const row of rows) {
    const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells = cellMatches.map(m => cleanText(m[1]));

    if (cells.length < 4) continue;

    // Parcourir toutes les cellules par blocs de 5 (DATE, CREDIT, DEBIT, DESC, [vide])
    for (let i = 0; i < cells.length - 3; i++) {
      const dateCell = cells[i];
      const creditCell = cells[i + 1];
      const debitCell = cells[i + 2];
      const descCell = cells[i + 3];

      // Ignorer si c'est une cellule de solde (nombre seul)
      if (!dateCell && parseNumber(creditCell) > 100 && !debitCell) continue;
      if (/^(sur le compte|total)/i.test(dateCell)) continue;

      const date = parseDate(dateCell, year);
      if (!date) continue;

      const credit = parseNumber(creditCell);
      const debit = parseNumber(debitCell);

      if (credit === 0 && debit === 0) continue;

      const description = descCell || (credit > 0 ? 'Entrée' : 'Sortie');
      if (/^(total|solde|cloture|report)/i.test(description)) continue;

      const entity = identifyEntity('', description);
      const categorie = detectCategorie(description);

      transactions.push({
        date,
        description: description.substring(0, 500),
        credit,
        debit,
        artiste: entity.artiste,
        projet: entity.code,
        categorie,
        source: `${year}.html`,
      });
    }
  }

  return transactions;
}

// Parser pour 2024 (format avec colonnes décalées)
// Structure: [vide], [vide], DATE, CREDIT, DEBIT, DESCRIPTION (cellules 2, 3, 4, 5)
function parse2024(filePath, year) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];

  const rows = content.split(/<tr[^>]*>/).slice(1);

  for (const row of rows) {
    const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    const cells = cellMatches.map(m => cleanText(m[1]));

    if (cells.length < 6) continue;

    const dateCell = cells[2];
    const creditCell = cells[3];
    const debitCell = cells[4];
    const descCell = cells[5];

    // Si c'est juste un nombre seul (ligne de solde), ignorer
    if (parseNumber(dateCell) > 1000 && !creditCell && !debitCell) continue;

    const date = parseDate(dateCell, year);
    if (!date) continue;

    const credit = parseNumber(creditCell);
    const debit = parseNumber(debitCell);

    if (credit === 0 && debit === 0) continue;

    const description = descCell || (credit > 0 ? 'Entrée' : 'Sortie');
    if (/^(total|solde|cloture|report|mise à jour)/i.test(description)) continue;

    const entity = identifyEntity('', description);
    const categorie = detectCategorie(description);

    transactions.push({
      date,
      description: description.substring(0, 500),
      credit,
      debit,
      artiste: entity.artiste,
      projet: entity.code,
      categorie,
      source: `${year}.html`,
    });
  }

  return transactions;
}

// =============================================
// Fonction principale
// =============================================

function main() {
  console.log('🔍 Parsing des bilans annuels (2021-2026)...\n');

  if (!fs.existsSync(SHEETS_FOLDER)) {
    console.error(`❌ Dossier non trouvé: ${SHEETS_FOLDER}`);
    process.exit(1);
  }

  let allTransactions = [];

  // Parser chaque année
  const years = [
    { file: '2021.html', year: 2021, parser: parse2021 },
    { file: '2022.html', year: 2022, parser: parse2022 },
    { file: '2023.html', year: 2023, parser: parse2023 },
    { file: '2024.html', year: 2024, parser: parse2024 },
    { file: '2025.html', year: 2025, parser: parse2025_2026 },
    { file: '2026.html', year: 2026, parser: parse2025_2026 },
  ];

  for (const { file, year, parser } of years) {
    const filePath = path.join(SHEETS_FOLDER, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Fichier non trouvé: ${file}`);
      continue;
    }

    console.log(`📄 Parsing: ${file}`);
    try {
      const transactions = parser(filePath, year);
      console.log(`   ✅ ${transactions.length} transactions trouvées`);
      allTransactions = allTransactions.concat(transactions);
    } catch (error) {
      console.error(`   ❌ Erreur: ${error.message}`);
    }
  }

  console.log(`\n📊 Total brut: ${allTransactions.length} transactions\n`);

  // Dédupliquer
  const seen = new Set();
  const uniqueTransactions = allTransactions.filter(t => {
    const key = `${t.date}-${t.credit.toFixed(2)}-${t.debit.toFixed(2)}-${t.description.substring(0, 30)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`📊 Après déduplication: ${uniqueTransactions.length} transactions\n`);

  // Trier par date
  uniqueTransactions.sort((a, b) => a.date.localeCompare(b.date));

  // Calculer les totaux
  const totalCredit = uniqueTransactions.reduce((sum, t) => sum + t.credit, 0);
  const totalDebit = uniqueTransactions.reduce((sum, t) => sum + t.debit, 0);
  const solde = totalCredit - totalDebit;

  console.log(`💰 Total Crédit: ${totalCredit.toFixed(2)}€`);
  console.log(`💸 Total Débit: ${totalDebit.toFixed(2)}€`);
  console.log(`📈 Solde calculé: ${solde.toFixed(2)}€\n`);

  // Identifier les artistes trouvés mais non dans la liste
  const artistesFound = new Set();
  const projetsFound = new Set();
  const unidentified = [];

  for (const t of uniqueTransactions) {
    if (t.artiste) artistesFound.add(t.artiste);
    if (t.projet) projetsFound.add(t.projet);
    if (!t.artiste && !t.projet) {
      unidentified.push(t.description.substring(0, 50));
    }
  }

  console.log(`👥 Artistes trouvés: ${[...artistesFound].join(', ')}`);
  console.log(`📁 Projets trouvés: ${[...projetsFound].join(', ')}`);
  console.log(`❓ Transactions sans artiste/projet: ${unidentified.length}\n`);

  // Générer le SQL
  let sql = `-- =============================================
-- O.V.N.I Compta - Import des transactions V2
-- Généré depuis les bilans annuels (2021-2026)
-- ${new Date().toISOString()}
-- =============================================

-- ATTENTION: Ce script REMPLACE toutes les transactions existantes
-- Exécuter d'abord: DELETE FROM transactions;

-- Total: ${uniqueTransactions.length} transactions
-- Crédit total: ${totalCredit.toFixed(2)}€
-- Débit total: ${totalDebit.toFixed(2)}€
-- Solde: ${solde.toFixed(2)}€

-- =============================================
-- Ajout des artistes manquants
-- =============================================
INSERT INTO artistes (nom, actif, couleur, notes) VALUES
  ('Juliette', true, '#FFD700', 'Ajouté via import bilans')
ON CONFLICT (nom) DO NOTHING;

`;

  // Grouper par année pour lisibilité
  const byYear = {};
  for (const t of uniqueTransactions) {
    const year = t.date.substring(0, 4);
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(t);
  }

  for (const [year, transactions] of Object.entries(byYear).sort()) {
    sql += `\n-- =============================================\n`;
    sql += `-- Année ${year} (${transactions.length} transactions)\n`;
    sql += `-- =============================================\n\n`;

    sql += `INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)\nVALUES\n`;

    const values = transactions.map(t => {
      const artisteSelect = t.artiste
        ? `(SELECT id FROM artistes WHERE nom = '${escapeSQL(t.artiste)}')`
        : 'NULL';
      const projetSelect = t.projet
        ? `(SELECT id FROM projets WHERE code = '${escapeSQL(t.projet)}')`
        : 'NULL';

      return `  ('${t.date}', '${escapeSQL(t.description)}', ${t.credit}, ${t.debit}, ${artisteSelect}, ${projetSelect}, '${t.categorie}')`;
    });

    sql += values.join(',\n');
    sql += `\nON CONFLICT DO NOTHING;\n`;
  }

  // Ajouter vérification finale
  sql += `
-- =============================================
-- Vérification des totaux
-- =============================================
SELECT
  'Total transactions' as metric,
  COUNT(*) as value
FROM transactions
UNION ALL
SELECT
  'Total crédit',
  SUM(credit)
FROM transactions
UNION ALL
SELECT
  'Total débit',
  SUM(debit)
FROM transactions
UNION ALL
SELECT
  'Solde (crédit - débit)',
  SUM(credit) - SUM(debit)
FROM transactions;
`;

  // Écrire le fichier
  fs.writeFileSync(OUTPUT_FILE, sql);

  console.log(`✅ Fichier SQL généré: ${OUTPUT_FILE}`);
  console.log(`\n📋 Résumé par année:`);
  for (const [year, transactions] of Object.entries(byYear).sort()) {
    const yearCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
    const yearDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
    console.log(`   ${year}: ${transactions.length} transactions (Crédit: ${yearCredit.toFixed(2)}€, Débit: ${yearDebit.toFixed(2)}€)`);
  }

  // Afficher quelques transactions non identifiées pour debug
  if (unidentified.length > 0) {
    console.log(`\n⚠️  Exemples de transactions non identifiées (ASBL):`);
    unidentified.slice(0, 10).forEach(desc => console.log(`   - ${desc}`));
  }
}

main();
