import { Transaction, Transfert } from '@/types';
import { formatDate } from './utils';

// Type flexible pour les transactions qui peut être soit le type Transaction classique
// soit TransactionWithRelations (propriétés plates)
interface ExportableTransaction {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  categorie?: string | null;
  // Propriétés imbriquées (Transaction)
  artiste?: { nom: string } | null;
  projet?: { code: string } | null;
  // Propriétés plates (TransactionWithRelations)
  artiste_nom?: string;
  projet_code?: string;
}

/**
 * Export transactions to CSV file
 */
export function exportTransactionsToCSV(
  transactions: ExportableTransaction[],
  filename: string = 'transactions'
): void {
  // CSV headers
  const headers = [
    'Date',
    'Description',
    'Artiste',
    'Projet',
    'Catégorie',
    'Crédit (€)',
    'Débit (€)',
    'Solde (€)',
  ];

  // Calculate running balance
  let runningBalance = 0;

  // CSV rows - Support both nested and flat properties
  const rows = transactions.map((tx) => {
    runningBalance += tx.credit - tx.debit;
    const artisteNom = tx.artiste_nom || tx.artiste?.nom || '';
    const projetCode = tx.projet_code || tx.projet?.code || '';
    return [
      formatDate(tx.date),
      `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes
      artisteNom,
      projetCode,
      tx.categorie || '',
      tx.credit > 0 ? tx.credit.toFixed(2) : '',
      tx.debit > 0 ? tx.debit.toFixed(2) : '',
      runningBalance.toFixed(2),
    ];
  });

  // Add totals row
  const totalCredit = transactions.reduce((sum, tx) => sum + tx.credit, 0);
  const totalDebit = transactions.reduce((sum, tx) => sum + tx.debit, 0);
  rows.push([]);
  rows.push([
    'TOTAL',
    '',
    '',
    '',
    '',
    totalCredit.toFixed(2),
    totalDebit.toFixed(2),
    (totalCredit - totalDebit).toFixed(2),
  ]);

  // Build CSV content with BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvContent =
    BOM +
    [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Type flexible pour les transferts
interface ExportableTransfert {
  id: string;
  date: string;
  montant: number;
  description: string;
  source_type: 'artiste' | 'projet';
  destination_type: 'artiste' | 'projet';
  // Propriétés imbriquées (Transfert)
  source_artiste?: { nom: string } | null;
  source_projet?: { nom: string; code: string } | null;
  destination_artiste?: { nom: string } | null;
  destination_projet?: { nom: string; code: string } | null;
  // Propriétés plates (TransfertWithRelations)
  source_nom?: string;
  destination_nom?: string;
}

/**
 * Export transferts to CSV file
 */
export function exportTransfertsToCSV(
  transferts: ExportableTransfert[],
  filename: string = 'transferts'
): void {
  // CSV headers
  const headers = [
    'Date',
    'Description',
    'Type Source',
    'Source',
    'Type Destination',
    'Destination',
    'Montant (€)',
  ];

  // Helper pour obtenir le label d'un compte (supporte les deux formats)
  const getCompteLabel = (
    type: 'artiste' | 'projet',
    flatNom?: string,
    artiste?: { nom: string } | null,
    projet?: { nom: string; code?: string } | null
  ): string => {
    // Flat property first
    if (flatNom) return flatNom;
    // Then nested
    if (type === 'artiste' && artiste) return artiste.nom;
    if (type === 'projet' && projet) return projet.code ? `${projet.nom} (${projet.code})` : projet.nom;
    return '-';
  };

  // CSV rows
  const rows = transferts.map((tf) => {
    return [
      formatDate(tf.date),
      `"${tf.description.replace(/"/g, '""')}"`, // Escape quotes
      tf.source_type === 'artiste' ? 'Artiste' : 'Projet',
      getCompteLabel(tf.source_type, tf.source_nom, tf.source_artiste, tf.source_projet),
      tf.destination_type === 'artiste' ? 'Artiste' : 'Projet',
      getCompteLabel(tf.destination_type, tf.destination_nom, tf.destination_artiste, tf.destination_projet),
      tf.montant.toFixed(2),
    ];
  });

  // Add totals row
  const totalMontant = transferts.reduce((sum, tf) => sum + tf.montant, 0);
  rows.push([]);
  rows.push([
    'TOTAL',
    '',
    '',
    '',
    '',
    `${transferts.length} transfert(s)`,
    totalMontant.toFixed(2),
  ]);

  // Build CSV content with BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvContent =
    BOM +
    [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export bilan data to CSV file
 */
export function exportBilanToCSV(
  data: {
    mois?: string;
    annee?: number;
    total_credit: number;
    total_debit: number;
    solde: number;
    nb_transactions?: number;
  }[],
  filename: string = 'bilan',
  type: 'mensuel' | 'annuel' = 'mensuel'
): void {
  // CSV headers based on type
  const headers =
    type === 'mensuel'
      ? ['Mois', 'Crédits (€)', 'Débits (€)', 'Solde (€)']
      : ['Année', 'Transactions', 'Crédits (€)', 'Débits (€)', 'Solde (€)'];

  // CSV rows
  const rows = data.map((item) => {
    if (type === 'mensuel') {
      return [
        item.mois || '',
        item.total_credit.toFixed(2),
        item.total_debit.toFixed(2),
        item.solde.toFixed(2),
      ];
    } else {
      return [
        item.annee?.toString() || '',
        item.nb_transactions?.toString() || '',
        item.total_credit.toFixed(2),
        item.total_debit.toFixed(2),
        item.solde.toFixed(2),
      ];
    }
  });

  // Add totals row
  const totalCredit = data.reduce((sum, item) => sum + item.total_credit, 0);
  const totalDebit = data.reduce((sum, item) => sum + item.total_debit, 0);
  rows.push([]);
  if (type === 'mensuel') {
    rows.push([
      'TOTAL',
      totalCredit.toFixed(2),
      totalDebit.toFixed(2),
      (totalCredit - totalDebit).toFixed(2),
    ]);
  } else {
    const totalTx = data.reduce((sum, item) => sum + (item.nb_transactions || 0), 0);
    rows.push([
      'TOTAL',
      totalTx.toString(),
      totalCredit.toFixed(2),
      totalDebit.toFixed(2),
      (totalCredit - totalDebit).toFixed(2),
    ]);
  }

  // Build CSV content with BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvContent =
    BOM +
    [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Print page as PDF (opens print dialog where user can save as PDF)
 */
export function printAsPDF(elementId?: string): void {
  if (elementId) {
    // Print specific element
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with id "${elementId}" not found`);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Veuillez autoriser les popups pour exporter en PDF');
      return;
    }

    // Get all stylesheets
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch {
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Export PDF - O.V.N.I Compta</title>
          <style>
            ${styles}
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .no-print { display: none !important; }
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              padding: 20px;
              background: white;
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  } else {
    // Print entire page
    window.print();
  }
}

/**
 * Export all transactions for a specific year to CSV
 */
export function exportYearTransactionsToCSV(
  transactions: ExportableTransaction[],
  year: number
): void {
  const yearTransactions = transactions.filter((tx) => {
    const txYear = new Date(tx.date).getFullYear();
    return txYear === year;
  });

  exportTransactionsToCSV(yearTransactions, `transactions_${year}`);
}
