import { Transaction } from '@/types';
import { formatDate } from './utils';

/**
 * Export transactions to CSV file
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
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

  // CSV rows
  const rows = transactions.map((tx) => {
    runningBalance += tx.credit - tx.debit;
    return [
      formatDate(tx.date),
      `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes
      tx.artiste?.nom || '',
      tx.projet?.code || '',
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
  transactions: Transaction[],
  year: number
): void {
  const yearTransactions = transactions.filter((tx) => {
    const txYear = new Date(tx.date).getFullYear();
    return txYear === year;
  });

  exportTransactionsToCSV(yearTransactions, `transactions_${year}`);
}
