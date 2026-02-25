import { CaseStatus, STATUS_CONFIG } from '@/types/case';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium text-white whitespace-nowrap',
        config.colorClass,
        sizeClasses[size]
      )}
    >
      {config.label}
    </span>
  );
}
