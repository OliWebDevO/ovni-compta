/**
 * Script pour extraire les données EXACTES du fichier 2026.html
 * Sans aucune modification ni invention
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../../bilan compta O.V.N.I /2026.html');

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
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

const content = fs.readFileSync(INPUT_FILE, 'utf-8');
const rows = content.split(/<tr[^>]*>/).slice(1);

console.log('=== EXTRACTION EXACTE DU FICHIER 2026.html ===\n');

let transactions = [];
let isFirstDataRow = true;

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const cellMatches = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
  const cells = cellMatches.map(m => cleanText(m[1]));

  if (cells.length < 6) continue;

  const col0 = cells[0]; // Colonne vide ou texte
  const date = cells[1]; // DATE
  const credit = cells[2]; // CREDIT
  const debit = cells[3]; // DEBIT
  const qui = cells[4]; // QUI
  const quoi = cells[5]; // QUOI

  // Ignorer la ligne d'en-tête
  if (date === 'DATE' || credit === 'CREDIT ') continue;

  // Ignorer les lignes vides
  const creditVal = parseNumber(credit);
  const debitVal = parseNumber(debit);
  if (creditVal === 0 && debitVal === 0 && !date) continue;

  // Ignorer les lignes CLOTURE, TOTAL, etc.
  if (/^(CLOTURE|TOTAL|COMPTE)/i.test(col0) || /^(CLOTURE|TOTAL|COMPTE)/i.test(date)) continue;

  // Première ligne avec montants = report de solde
  if (isFirstDataRow && (creditVal > 0 || debitVal > 0)) {
    console.log(`REPORT SOLDE: Credit=${credit}, Debit=${debit}`);
    isFirstDataRow = false;
    continue; // On skip le report
  }

  // Transactions normales
  if (date && (creditVal > 0 || debitVal > 0)) {
    transactions.push({
      date: date,
      credit: credit,
      creditVal: creditVal,
      debit: debit,
      debitVal: debitVal,
      qui: qui,
      quoi: quoi // Exactement comme dans le fichier, même si vide
    });
  }
}

console.log(`\n=== ${transactions.length} TRANSACTIONS TROUVEES ===\n`);

transactions.forEach((t, idx) => {
  console.log(`${idx + 1}. DATE: "${t.date}" | CREDIT: ${t.creditVal} | DEBIT: ${t.debitVal} | QUI: "${t.qui}" | QUOI: "${t.quoi}"`);
});

// Générer le SQL
console.log('\n=== SQL A COPIER DANS SUPABASE ===\n');

function parseDate(dateStr) {
  // Format DD/MM ou DD/MM/YY ou DD/MM/YYYY
  const match1 = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (match1) {
    let year = parseInt(match1[3]);
    if (year < 100) year += 2000;
    return `${year}-${match1[2].padStart(2, '0')}-${match1[1].padStart(2, '0')}`;
  }

  const match2 = dateStr.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (match2) {
    return `2026-${match2[2].padStart(2, '0')}-${match2[1].padStart(2, '0')}`;
  }

  return null;
}

function escapeSQL(text) {
  if (!text) return '';
  return text.replace(/'/g, "''");
}

let sql = `-- Transactions 2026 - Extraction exacte du Google Sheet
-- ${new Date().toISOString()}

INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES
`;

const values = [];
for (const t of transactions) {
  const sqlDate = parseDate(t.date);
  if (!sqlDate) {
    console.error(`Date invalide: ${t.date}`);
    continue;
  }

  // Description = QUOI exactement (vide si vide)
  const description = t.quoi || '';

  // Identifier artiste ou projet
  let artisteSQL = 'NULL';
  let projetSQL = 'NULL';

  const quiUpper = (t.qui || '').toUpperCase();

  // Projets
  if (quiUpper.includes('TALU') || quiUpper === 'LE TALU') {
    projetSQL = "(SELECT id FROM projets WHERE code = 'TALU')";
  } else if (quiUpper.includes('LVLR')) {
    projetSQL = "(SELECT id FROM projets WHERE code = 'LVLR')";
  } else if (quiUpper === 'WP' || quiUpper.includes('WIRELESS')) {
    projetSQL = "(SELECT id FROM projets WHERE code = 'WP')";
  } else if (quiUpper.includes('POEM') || quiUpper.includes('POEMA')) {
    projetSQL = "(SELECT id FROM projets WHERE code = 'POEM')";
  } else if (quiUpper === 'GEO') {
    projetSQL = "(SELECT id FROM projets WHERE code = 'GEO')";
  }
  // Artistes
  else if (quiUpper.includes('GEOFFREY')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Geoffrey')";
  } else if (quiUpper.includes('CAMILLE')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Camille')";
  } else if (quiUpper.includes('MAIA') || quiUpper.includes('MAÏA')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Maïa')";
  } else if (quiUpper.includes('IRIS')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Iris')";
  } else if (quiUpper.includes('EMMA')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Emma')";
  } else if (quiUpper.includes('GRETA')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Greta')";
  } else if (quiUpper.includes('JULIETTE')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Juliette')";
  } else if (quiUpper.includes('LÉA') || quiUpper.includes('LEA')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Léa')";
  } else if (quiUpper.includes('LOU')) {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Lou')";
  } else if (quiUpper === 'JUL' || quiUpper === 'JULIE') {
    artisteSQL = "(SELECT id FROM artistes WHERE nom = 'Jul')";
  }

  values.push(`  ('${sqlDate}', '${escapeSQL(description)}', ${t.creditVal}, ${t.debitVal}, ${artisteSQL}, ${projetSQL}, 'autre')`);
}

sql += values.join(',\n');
sql += '\nON CONFLICT DO NOTHING;';

console.log(sql);
