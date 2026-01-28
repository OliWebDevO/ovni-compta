/**
 * Script d'importation des données comptables depuis les fichiers HTML exportés de Google Sheets
 * Usage: npx ts-node scripts/import-html-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

// Types pour les données extraites
interface Transaction {
  date: string;
  credit: number;
  debit: number;
  description: string;
  artiste?: string;
  projet?: string;
  categorie?: string;
}

interface Artiste {
  nom: string;
  transactions: Transaction[];
  totalCredit: number;
  totalDebit: number;
  solde: number;
}

interface Projet {
  nom: string;
  code: string;
  transactions: Transaction[];
  totalCredit: number;
  totalDebit: number;
  solde: number;
}

interface BilanAnnuel {
  annee: number;
  transactions: Transaction[];
  totalCredit: number;
  totalDebit: number;
  solde: number;
}

// Configuration des fichiers
const HTML_FOLDER = path.join(__dirname, '../../bilan compta O.V.N.I ');

// Fichiers artistes (noms en minuscules pour la correspondance)
const ARTISTE_FILES = [
  'Camille.html',
  'Geoffrey.html',
  'Iris.html',
  'Maïa.html',
  'emma.html',
  'greta.html',
  'jul.html',
  'léa.html',
  'lou.html',
];

// Fichiers projets
const PROJET_FILES = [
  'GEO.html',
  'LE TALU.html',
  'LVLR.html',
  'WP.html',
  'poema.html',
  'talu.html',
];

// Fichiers bilans annuels
const BILAN_FILES = ['2021.html', '2022.html', '2023.html', '2024.html', '2025.html', '2026.html'];

// Utilitaires de parsing
function parseNumber(str: string | undefined): number {
  if (!str) return 0;
  // Nettoyer le string: enlever espaces, remplacer virgule par point
  const cleaned = str.trim().replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseDate(str: string | undefined, year?: number): string | null {
  if (!str) return null;

  const cleaned = str.trim();
  if (!cleaned) return null;

  // Formats possibles: 01/01, 01/01/2024, 01/01/24, 1/23/2026, etc.
  const parts = cleaned.split('/');

  if (parts.length >= 2) {
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let parsedYear = year || new Date().getFullYear();

    // Si format américain (mois/jour/année)
    if (month > 12 && day <= 12) {
      [day, month] = [month, day];
    }

    if (parts.length === 3) {
      const yearPart = parseInt(parts[2], 10);
      parsedYear = yearPart < 100 ? 2000 + yearPart : yearPart;
    }

    if (day > 0 && day <= 31 && month > 0 && month <= 12) {
      const dateStr = `${parsedYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return dateStr;
    }
  }

  return null;
}

function detectCategorie(description: string): string {
  const desc = description.toLowerCase();

  if (desc.includes('smart')) return 'smart';
  if (desc.includes('thom') || desc.includes('thomann')) return 'thoman';
  if (desc.includes('triodos') || desc.includes('frais')) return 'frais_bancaires';
  if (desc.includes('loyer') || desc.includes('communa')) return 'loyer';
  if (desc.includes('matos') || desc.includes('matériel') || desc.includes('materiel')) return 'materiel';
  if (
    desc.includes('trajet') ||
    desc.includes('deplacement') ||
    desc.includes('avion') ||
    desc.includes('train') ||
    desc.includes('uber')
  )
    return 'deplacement';
  if (desc.includes('cachet')) return 'cachet';
  if (desc.includes('sub') || desc.includes('subvention')) return 'subvention';
  if (desc.includes('from ') || desc.includes('to ') || desc.includes('transfert')) return 'transfert_interne';

  return 'autre';
}

function extractArtisteOrProjet(description: string): { artiste?: string; projet?: string } {
  const desc = description.toLowerCase();
  const result: { artiste?: string; projet?: string } = {};

  // Détection des artistes
  const artistes = ['maïa', 'maia', 'geo', 'geoffrey', 'camille', 'iris', 'emma', 'greta', 'jul', 'léa', 'lea', 'lou'];
  for (const artiste of artistes) {
    if (desc.includes(artiste)) {
      result.artiste = artiste.charAt(0).toUpperCase() + artiste.slice(1);
      if (result.artiste === 'Geo') result.artiste = 'Geoffrey';
      if (result.artiste === 'Maia') result.artiste = 'Maïa';
      if (result.artiste === 'Lea') result.artiste = 'Léa';
      break;
    }
  }

  // Détection des projets
  const projets = ['talu', 'le talu', 'lvlr', 'wp', 'wireless', 'geo', 'poema', 'poem'];
  for (const projet of projets) {
    if (desc.includes(projet)) {
      result.projet = projet.toUpperCase();
      if (result.projet === 'LE TALU' || result.projet === 'TALU') result.projet = 'LE TALU';
      if (result.projet === 'WIRELESS') result.projet = 'WP';
      if (result.projet === 'POEM') result.projet = 'POEMA';
      break;
    }
  }

  return result;
}

// Parsers pour les différents types de fichiers
function parseArtisteFile(filePath: string): Artiste | null {
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    const transactions: Transaction[] = [];

    // Trouver le nom de l'artiste (première cellule de la première row)
    const nomArtiste = $('table tbody tr:first-child td:first-child').text().trim();

    if (!nomArtiste) {
      console.warn(`Impossible de trouver le nom dans ${filePath}`);
      return null;
    }

    // Chercher l'année dans le header (généralement row 4)
    let currentYear = new Date().getFullYear();
    $('table tbody tr').each((_, row) => {
      const firstCell = $(row).find('td:first-child').text().trim();
      if (/^\d{4}$/.test(firstCell)) {
        currentYear = parseInt(firstCell, 10);
        return false; // break
      }
    });

    // Parser les transactions (commencer après les headers)
    let isDataRow = false;
    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td');
      const firstCellText = $(cells[0]).text().trim();

      // Détecter le début des données (après "CLOTURE" ou après les headers)
      if (firstCellText.toLowerCase().includes('cloture')) {
        isDataRow = true;
        return; // skip cette row
      }

      if (!isDataRow) return;

      // Parser la date
      const dateStr = parseDate(firstCellText, currentYear);
      if (!dateStr) return;

      // Colonnes: Date | Credit | Debit | Description
      const creditStr = $(cells[1]).text().trim();
      const debitStr = $(cells[2]).text().trim();
      const description = $(cells[3]).text().trim();

      const credit = parseNumber(creditStr);
      const debit = parseNumber(debitStr);

      // Ignorer les lignes sans montant et sans description
      if (credit === 0 && debit === 0 && !description) return;

      const { artiste, projet } = extractArtisteOrProjet(description);

      transactions.push({
        date: dateStr,
        credit,
        debit,
        description,
        artiste: artiste || nomArtiste,
        projet,
        categorie: detectCategorie(description),
      });
    });

    // Calculer les totaux
    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);

    return {
      nom: nomArtiste,
      transactions,
      totalCredit,
      totalDebit,
      solde: totalCredit - totalDebit,
    };
  } catch (error) {
    console.error(`Erreur lors du parsing de ${filePath}:`, error);
    return null;
  }
}

function parseBilanFile(filePath: string): BilanAnnuel | null {
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    const transactions: Transaction[] = [];

    // Extraire l'année du nom du fichier
    const fileName = path.basename(filePath, '.html');
    const annee = parseInt(fileName, 10);

    if (isNaN(annee)) {
      console.warn(`Impossible d'extraire l'année de ${filePath}`);
      return null;
    }

    // Parser les transactions
    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td');

      // Chercher la colonne avec la date (souvent colonne C ou A)
      let dateStr: string | null = null;
      let creditCell: number | null = null;
      let debitCell: number | null = null;
      let descriptionText = '';

      cells.each((i, cell) => {
        const text = $(cell).text().trim();

        // Détecter une date
        if (!dateStr && /^\d{1,2}\/\d{1,2}/.test(text)) {
          dateStr = parseDate(text, annee);
        }

        // Les montants sont souvent dans des cellules jaunes (credit) ou cyan (debit)
        const num = parseNumber(text);
        if (num > 0) {
          // Heuristique: credit si la cellule précède le debit
          if (creditCell === null) {
            creditCell = num;
          } else if (debitCell === null) {
            debitCell = num;
          }
        }

        // La description est généralement la dernière cellule avec du texte significatif
        if (text.length > 3 && !/^\d/.test(text) && !text.includes('CREDIT') && !text.includes('DEBIT')) {
          descriptionText = text;
        }
      });

      if (!dateStr) return;

      // Réorganiser credit/debit basé sur le contexte
      let credit = 0;
      let debit = 0;

      // Si on a détecté un crédit dans la colonne D (jaune) ou debit dans E (cyan)
      if (creditCell !== null && debitCell !== null) {
        credit = creditCell;
        debit = debitCell;
      } else if (creditCell !== null) {
        // Un seul montant - détecter si c'est credit ou debit
        if (descriptionText.toLowerCase().includes('frais') || descriptionText.toLowerCase().includes('achat')) {
          debit = creditCell;
        } else {
          credit = creditCell;
        }
      }

      const { artiste, projet } = extractArtisteOrProjet(descriptionText);

      transactions.push({
        date: dateStr,
        credit,
        debit,
        description: descriptionText,
        artiste,
        projet,
        categorie: detectCategorie(descriptionText),
      });
    });

    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);

    return {
      annee,
      transactions,
      totalCredit,
      totalDebit,
      solde: totalCredit - totalDebit,
    };
  } catch (error) {
    console.error(`Erreur lors du parsing de ${filePath}:`, error);
    return null;
  }
}

// Génération SQL
function generateArtistesSQL(artistes: Artiste[]): string {
  const uniqueArtistes = [...new Set(artistes.map((a) => a.nom))];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];

  return uniqueArtistes
    .map((nom, i) => {
      const color = colors[i % colors.length];
      return `INSERT INTO artistes (nom, actif, couleur) VALUES ('${nom.replace(/'/g, "''")}', true, '${color}');`;
    })
    .join('\n');
}

function generateProjetsSQL(projets: string[]): string {
  const projetCodes: Record<string, string> = {
    GEO: 'GEO',
    'LE TALU': 'TALU',
    LVLR: 'LVLR',
    WP: 'WP',
    POEMA: 'POEM',
  };

  return projets
    .map((nom) => {
      const code = projetCodes[nom] || nom.substring(0, 4).toUpperCase();
      return `INSERT INTO projets (nom, code, statut) VALUES ('${nom.replace(/'/g, "''")}', '${code}', 'actif');`;
    })
    .join('\n');
}

function generateTransactionsSQL(transactions: Transaction[]): string {
  return transactions
    .map((t) => {
      const artisteRef = t.artiste
        ? `(SELECT id FROM artistes WHERE nom ILIKE '${t.artiste.replace(/'/g, "''")}%' LIMIT 1)`
        : 'NULL';
      const projetRef = t.projet
        ? `(SELECT id FROM projets WHERE nom ILIKE '${t.projet.replace(/'/g, "''")}%' LIMIT 1)`
        : 'NULL';

      return `INSERT INTO transactions (date, description, credit, debit, artiste_id, projet_id, categorie)
VALUES ('${t.date}', '${t.description.replace(/'/g, "''")}', ${t.credit}, ${t.debit}, ${artisteRef}, ${projetRef}, '${t.categorie}');`;
    })
    .join('\n');
}

// Main
async function main() {
  console.log('=== Import des données comptables O.V.N.I ===\n');
  console.log(`Dossier source: ${HTML_FOLDER}\n`);

  // Vérifier que le dossier existe
  if (!fs.existsSync(HTML_FOLDER)) {
    console.error(`ERREUR: Le dossier ${HTML_FOLDER} n'existe pas.`);
    process.exit(1);
  }

  const artistes: Artiste[] = [];
  const bilans: BilanAnnuel[] = [];
  const projets: Set<string> = new Set();

  // Parser les fichiers artistes
  console.log('Parsing des fichiers artistes...');
  for (const file of ARTISTE_FILES) {
    const filePath = path.join(HTML_FOLDER, file);
    if (fs.existsSync(filePath)) {
      const artiste = parseArtisteFile(filePath);
      if (artiste) {
        artistes.push(artiste);
        console.log(`  ✓ ${artiste.nom}: ${artiste.transactions.length} transactions`);

        // Collecter les projets mentionnés
        artiste.transactions.forEach((t) => {
          if (t.projet) projets.add(t.projet);
        });
      }
    } else {
      console.log(`  ⚠ Fichier non trouvé: ${file}`);
    }
  }

  // Parser les fichiers bilans
  console.log('\nParsing des fichiers bilans annuels...');
  for (const file of BILAN_FILES) {
    const filePath = path.join(HTML_FOLDER, file);
    if (fs.existsSync(filePath)) {
      const bilan = parseBilanFile(filePath);
      if (bilan) {
        bilans.push(bilan);
        console.log(`  ✓ ${bilan.annee}: ${bilan.transactions.length} transactions`);

        // Collecter les projets mentionnés
        bilan.transactions.forEach((t) => {
          if (t.projet) projets.add(t.projet);
        });
      }
    } else {
      console.log(`  ⚠ Fichier non trouvé: ${file}`);
    }
  }

  // Générer le SQL
  console.log('\n=== Génération du SQL ===\n');

  const outputDir = path.join(__dirname, '../supabase/seed');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Artistes
  const artistesSQL = generateArtistesSQL(artistes);
  fs.writeFileSync(path.join(outputDir, '01_artistes.sql'), `-- Insertion des artistes\n${artistesSQL}`);
  console.log(`✓ 01_artistes.sql généré (${artistes.length} artistes)`);

  // 2. Projets
  const projetsSQL = generateProjetsSQL([...projets]);
  fs.writeFileSync(path.join(outputDir, '02_projets.sql'), `-- Insertion des projets\n${projetsSQL}`);
  console.log(`✓ 02_projets.sql généré (${projets.size} projets)`);

  // 3. Transactions
  const allTransactions = artistes.flatMap((a) => a.transactions);
  const transactionsSQL = generateTransactionsSQL(allTransactions);
  fs.writeFileSync(path.join(outputDir, '03_transactions.sql'), `-- Insertion des transactions\n${transactionsSQL}`);
  console.log(`✓ 03_transactions.sql généré (${allTransactions.length} transactions)`);

  // Résumé
  console.log('\n=== Résumé ===');
  console.log(`Artistes: ${artistes.length}`);
  console.log(`Projets: ${projets.size}`);
  console.log(`Transactions: ${allTransactions.length}`);

  const totalCredit = artistes.reduce((sum, a) => sum + a.totalCredit, 0);
  const totalDebit = artistes.reduce((sum, a) => sum + a.totalDebit, 0);
  console.log(`\nTotal crédit: ${totalCredit.toFixed(2)}€`);
  console.log(`Total débit: ${totalDebit.toFixed(2)}€`);
  console.log(`Solde: ${(totalCredit - totalDebit).toFixed(2)}€`);

  console.log('\n✓ Import terminé!');
  console.log(`Les fichiers SQL ont été générés dans: ${outputDir}`);
}

main().catch(console.error);
