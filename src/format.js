export function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${year}/${month}/${day}`;
}

export function formatProfit(profit) {
  const value = Number(profit) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}
