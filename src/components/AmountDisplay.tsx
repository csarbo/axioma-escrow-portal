import { formatCurrency } from '@/data/mock';

interface AmountDisplayProps {
  amountUSD: number;
  amountMXN: number;
  size?: 'sm' | 'lg';
}

export function AmountDisplay({ amountUSD, amountMXN, size = 'sm' }: AmountDisplayProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={size === 'lg' ? 'text-2xl font-bold text-foreground' : 'text-base font-semibold text-foreground'}>
        {formatCurrency(amountUSD, 'USD')}
      </span>
      <span className={size === 'lg' ? 'text-base text-muted-foreground' : 'text-sm text-muted-foreground'}>
        ≈ {formatCurrency(amountMXN, 'MXN')}
      </span>
    </div>
  );
}
