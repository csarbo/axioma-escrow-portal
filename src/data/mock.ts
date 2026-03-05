// Legacy mock file — kept for backward compatibility
// All mock data is now in src/context/AppContext.tsx

export function formatDateMX(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatCurrency(amount: number, currency: 'USD' | 'MXN'): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount);
}
