import { Badge } from '@/components/ui/badge';
import type { LeadStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  cold: {
    label: 'Cold',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  warm: {
    label: 'Warm',
    className: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  hot: {
    label: 'Hot',
    className: 'bg-orange-50 text-orange-600 border-orange-200',
  },
  closed: {
    label: 'Closed',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium text-xs px-2.5 py-0.5 rounded-full border',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}