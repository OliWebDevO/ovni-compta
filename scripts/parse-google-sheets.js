/**
 * Script pour parser les exports HTML de Google Sheets
 * et générer un fichier SQL d'insertion pour Supabase
 *
 * Usage: node scripts/parse-google-sheets.js
 */

const fs = require('fs');
const path = require('path');

// Chemin vers le dossier avec les exports HTML
const SHEETS_FOLDER = path.join(__dirname, '../../bilan compta O.V.N.I ');
const OUTPUT_FILE = path.join(__dirname, '../supabase/migrations/20250128000005_seed_transactions.sql');

// Fonction pour normaliser les noms de fichiers (gestion Unicode)
// Normalise en NFC ET supprime les accents pour la comparaison
function normalizeFilename(filename) {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques
    .toLowerCase();
}

// Fonction pour trouver un artiste par nom de fichier (avec normalisation)
function findArtiste(filename) {
  const normalized = normalizeFilename(filename);

  // Mappings basés sur des patterns normalisés (sans accents)
  if (normalized.includes('maia')) return 'Maïa';
  if (normalized.includes('geoffrey')) return 'Geoffrey';
  if (normalized.includes('camille')) return 'Camille';
  if (normalized.includes('iris')) return 'Iris';
  if (normalized.includes('emma')) return 'Emma';
  if (normalized.includes('greta')) return 'Greta';
  if (normalized.includes('jul')) return 'Jul';
  if (normalized.includes('lea')) return 'Léa';
  if (normalized.includes('lou')) return 'Lou';

  return null;
}

// Fonction pour trouver un projet par nom de fichier (avec normalisation)
function findProjet(filename) {
  const normalized = normalizeFilename(filename);
  const baseName = normalized.replace('.html', '');

  // Vérifier d'abord si c'est un projet (et pas un artiste)
  // GEO ne doit matcher que "geo.html", pas "geoffrey.html"
  if (baseName === 'geo') return 'GEO';
  if (normalized.includes('talu')) return 'TALU';
  if (normalized.includes('lvlr')) return 'LVLR';
  if (normalized.includes('wp') || normalized.includes('wireless')) return 'WP';
  if (normalized.includes('poema') || normalized.includes('poem')) return 'POEM';

  return null;
}

// Legacy mapping (kept for reference, but findArtiste/findProjet are used instead)
const ARTISTE_FILES = {
  'Geoffrey.html': 'Geoffrey',
  'Camille.html': 'Camille',
  'Iris.html': 'Iris',
  'iris archive.html': 'Iris',
  'emma.html': 'Emma',
  'greta.html': 'Greta',
  'jul.html': 'Jul',
  'lou.html': 'Lou',
};

const PROJET_FILES = {
  'GEO.html': 'GEO',
  'LE TALU.html': 'TALU',
  'projet le talu.html': 'TALU',
  'talu.html': 'TALU',
  'LVLR.html': 'LVLR',
  'LVLR archive .html': 'LVLR',
  'WP.html': 'WP',
  'WP 2026.html': 'WP',
  'poema.html': 'POEM',
  'Wireless People.html': 'WP',
};

// Fichiers à ignorer (bilans généraux, pas des transactions individuelles)
const IGNORE_FILES = [
  '2021.html',
  '2022.html',
  '2023.html',
  '2024.html',
  '2025.html',
  '2026.html',
  'asbl.html',
  'divers.html',
  'Feuille 36.html',
];

// Fonction pour nettoyer le texte HTML
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

// Fonction pour parser un nombre (credit/debit)
function parseNumber(text) {
  if (!text) return 0;
  const cleaned = cleanText(text)
    .replace(/[€\s]/g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.abs(num);
}

// Fonction pour parser une date
function parseDate(text, currentYear = 2024) {
  if (!text) return null;
  const cleaned = cleanText(text);

  // Ignorer les lignes de totaux, clôtures, etc.
  if (/^(TOTAL|CLOTURE|Total|Clôture|report|Report)/i.test(cleaned)) {
    return null;
  }

  // Format: DD/MM/YYYY ou DD/MM/YY
  let match = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    let year = parseInt(match[3]);
    if (year < 100) year += 2000;
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  // Format: DD/MM (sans année)
  match = cleaned.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  // Format: M/D/YYYY (format US parfois utilisé)
  match = cleaned.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (match) {
    const part1 = parseInt(match[1]);
    const part2 = parseInt(match[2]);
    let year = parseInt(match[3]);
    if (year < 100) year += 2000;

    // Si le premier nombre > 12, c'est forcément un jour
    if (part1 > 12 && part2 <= 12) {
      return `${year}-${String(part2).padStart(2, '0')}-${String(part1).padStart(2, '0')}`;
    }
  }

  return null;
}

// Fonction pour extraire l'année d'un fichier
function extractYearFromFile(content) {
  // Chercher des patterns comme "2024", "2025", "2026" dans les en-têtes
  const yearMatch = content.match(/<td[^>]*>(?:<[^>]*>)*(202[0-6]|201[0-9])(?:<[^>]*>)*<\/td>/i);
  if (yearMatch) {
    return parseInt(yearMatch[1]);
  }
  return new Date().getFullYear();
}

// Fonction pour parser un fichier HTML
function parseHTMLFile(filePath, artisteName, projetCode) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const transactions = [];

  // Extraire l'année par défaut du fichier
  const defaultYear = extractYearFromFile(content);

  // Trouver toutes les lignes du tableau
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(content)) !== null) {
    const rowContent = rowMatch[1];

    // Extraire les cellules
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let cellMatch;

    while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
      cells.push(cellMatch[1]);
    }

    // On a besoin d'au moins 4 colonnes: Date, Credit, Debit, Description
    if (cells.length >= 4) {
      const dateText = cleanText(cells[0]);
      const creditText = cleanText(cells[1]);
      const debitText = cleanText(cells[2]);
      const descriptionText = cleanText(cells[3]);

      // Parser la date
      const date = parseDate(dateText, defaultYear);

      // Si pas de date valide, ignorer cette ligne
      if (!date) continue;

      // Parser les montants
      const credit = parseNumber(creditText);
      const debit = parseNumber(debitText);

      // Ignorer les lignes sans montants
      if (credit === 0 && debit === 0) continue;

      // Ignorer les lignes de totaux basées sur la description
      if (/^(total|solde|balance|report)/i.test(descriptionText)) continue;

      // Créer la description
      let description = descriptionText || 'Transaction';

      // Nettoyer la description
      description = description
        .replace(/'/g, "''") // Escape les apostrophes pour SQL
        .substring(0, 500); // Limiter la longueur

      if (description.length === 0) {
        description = credit > 0 ? 'Entrée' : 'Sortie';
      }

      transactions.push({
        date,
        description,
        credit,
        debit,
        artiste: artisteName,
        projet: projetCode,
      });
    }
  }

  return transactions;
}

// Fonction pour détecter la catégorie basée sur la description
function detectCategorie(description) {
  const desc = description.toLowerCase();

  if (desc.includes('smart')) return 'smart';
  if (desc.includes('thoman') || desc.includes('thomann')) return 'thoman';
  if (desc.includes('loyer') || desc.includes('communa')) return 'loyer';
  if (desc.includes('frais') && (desc.includes('banc') || desc.includes('triodos'))) return 'frais_bancaires';
  if (desc.includes('matos') || desc.includes('micro') || desc.includes('synth') || desc.includes('câble')) return 'materiel';
  if (desc.includes('train') || desc.includes('bus') || desc.includes('uber') || desc.includes('taxi') || desc.includes('trajet') || desc.includes('km')) return 'deplacement';
  if (desc.includes('cachet') || desc.includes('concert') || desc.includes('prestation')) return 'cachet';
  if (desc.includes('subvention') || desc.includes('fwb') || desc.includes('aide')) return 'subvention';
  if (desc.includes('transfert') || desc.includes('interne') || desc.includes('from ') || desc.includes('vers ')) return 'transfert_interne';

  return 'autre';
}

// Fonction principale
function main() {
  console.log('🔍 Parsing des fichiers Google Sheets...\n');

  // Vérifier que le dossier existe
  if (!fs.existsSync(SHEETS_FOLDER)) {
    console.error(`❌ Dossier non trouvé: ${SHEETS_FOLDER}`);
    process.exit(1);
  }

  // Lire tous les fichiers HTML
  const files = fs.readdirSync(SHEETS_FOLDER).filter(f => f.endsWith('.html'));
  console.log(`📁 ${files.length} fichiers HTML trouvés\n`);

  let allTransactions = [];

  for (const file of files) {
    // Ignorer certains fichiers (bilans annuels, etc.)
    const normalizedFile = normalizeFilename(file);
    const shouldIgnore = IGNORE_FILES.some(ignoreFile =>
      normalizeFilename(ignoreFile) === normalizedFile
    );
    if (shouldIgnore) {
      console.log(`⏭️  Ignoré: ${file}`);
      continue;
    }

    const filePath = path.join(SHEETS_FOLDER, file);
    const artisteName = findArtiste(file);
    const projetCode = findProjet(file);

    // Si ni artiste ni projet, on ignore
    if (!artisteName && !projetCode) {
      console.log(`⚠️  Fichier non mappé: ${file}`);
      continue;
    }

    console.log(`📄 Parsing: ${file} → ${artisteName ? `Artiste: ${artisteName}` : `Projet: ${projetCode}`}`);

    try {
      const transactions = parseHTMLFile(filePath, artisteName, projetCode);
      console.log(`   ✅ ${transactions.length} transactions trouvées`);
      allTransactions = allTransactions.concat(transactions);
    } catch (error) {
      console.error(`   ❌ Erreur: ${error.message}`);
    }
  }

  console.log(`\n📊 Total: ${allTransactions.length} transactions\n`);

  // Dédupliquer les transactions (même date, même montant, même description)
  const seen = new Set();
  const uniqueTransactions = allTransactions.filter(t => {
    const key = `${t.date}-${t.credit}-${t.debit}-${t.description.substring(0, 50)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`📊 Après déduplication: ${uniqueTransactions.length} transactions uniques\n`);

  // Trier par date
  uniqueTransactions.sort((a, b) => a.date.localeCompare(b.date));

  // Générer le SQL
  let sql = `-- =============================================
-- O.V.N.I Compta - Import des transactions
-- Généré automatiquement depuis Google Sheets
-- ${new Date().toISOString()}
-- =============================================

-- Total: ${uniqueTransactions.length} transactions

`;

  // Grouper par artiste/projet pour une meilleure lisibilité
  const byArtiste = {};
  const byProjet = {};

  for (const t of uniqueTransactions) {
    if (t.artiste) {
      if (!byArtiste[t.artiste]) byArtiste[t.artiste] = [];
      byArtiste[t.artiste].push(t);
    } else if (t.projet) {
      if (!byProjet[t.projet]) byProjet[t.projet] = [];
      byProjet[t.projet].push(t);
    }
  }

  // Générer les INSERT pour les artistes
  for (const [artiste, transactions] of Object.entries(byArtiste)) {
    sql += `\n-- =============================================\n`;
    sql += `-- Artiste: ${artiste} (${transactions.length} transactions)\n`;
    sql += `-- =============================================\n\n`;

    sql += `INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)\nVALUES\n`;

    const values = transactions.map(t => {
      const categorie = detectCategorie(t.description);
      return `  ('${t.date}', '${t.description}', ${t.credit}, ${t.debit}, (SELECT id FROM artistes WHERE nom = '${artiste}'), NULL, '${categorie}')`;
    });

    sql += values.join(',\n');
    sql += `\nON CONFLICT DO NOTHING;\n`;
  }

  // Générer les INSERT pour les projets
  for (const [projet, transactions] of Object.entries(byProjet)) {
    sql += `\n-- =============================================\n`;
    sql += `-- Projet: ${projet} (${transactions.length} transactions)\n`;
    sql += `-- =============================================\n\n`;

    sql += `INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)\nVALUES\n`;

    const values = transactions.map(t => {
      const categorie = detectCategorie(t.description);
      return `  ('${t.date}', '${t.description}', ${t.credit}, ${t.debit}, NULL, (SELECT id FROM projets WHERE code = '${projet}'), '${categorie}')`;
    });

    sql += values.join(',\n');
    sql += `\nON CONFLICT DO NOTHING;\n`;
  }

  // Ajouter une vérification finale
  sql += `
-- =============================================
-- Vérification
-- =============================================
SELECT
  'Transactions importées' as type,
  COUNT(*) as nombre
FROM transactions
UNION ALL
SELECT
  'Par artiste: ' || a.nom,
  COUNT(t.id)
FROM artistes a
LEFT JOIN transactions t ON t.artiste_id = a.id
GROUP BY a.nom
UNION ALL
SELECT
  'Par projet: ' || p.code,
  COUNT(t.id)
FROM projets p
LEFT JOIN transactions t ON t.projet_id = p.id
GROUP BY p.code;
`;

  // Écrire le fichier SQL
  fs.writeFileSync(OUTPUT_FILE, sql);

  console.log(`✅ Fichier SQL généré: ${OUTPUT_FILE}`);
  console.log(`\n📋 Résumé par artiste:`);
  for (const [artiste, transactions] of Object.entries(byArtiste)) {
    console.log(`   ${artiste}: ${transactions.length} transactions`);
  }
  console.log(`\n📋 Résumé par projet:`);
  for (const [projet, transactions] of Object.entries(byProjet)) {
    console.log(`   ${projet}: ${transactions.length} transactions`);
  }
}

main();
