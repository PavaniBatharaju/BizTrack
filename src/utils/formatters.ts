// Utility for Indian Rupee currency formatting with correct grouping (e.g. ₹2,45,000)
export function formatINR(amount: number, showSymbol = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return showSymbol ? '₹0' : '0';
  }

  const isNegative = amount < 0;
  const absVal = Math.abs(Math.round(amount));

  // Indian number format: first 3 digits from right, then groups of 2
  const str = absVal.toString();
  let result = '';
  
  if (str.length <= 3) {
    result = str;
  } else {
    const lastThree = str.substring(str.length - 3);
    const remaining = str.substring(0, str.length - 3);
    const withCommas = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = `${withCommas},${lastThree}`;
  }

  const prefix = isNegative ? '- ' : '';
  const sym = showSymbol ? '₹' : '';
  return `${prefix}${sym}${result}`;
}

export function formatCompactINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  
  if (abs >= 10000000) { // 1 Crore = 10,000,000
    return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
  }
  if (abs >= 100000) { // 1 Lakh = 100,000
    return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) { // 1 Thousand
    return `${sign}₹${(abs / 1000).toFixed(1)}k`;
  }
  return formatINR(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const processRow = (row: (string | number)[]) => {
    return row.map(val => {
      const str = String(val ?? '');
      if (str.search(/("|,|\n)/g) >= 0) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',');
  };

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(processRow).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
