import { Badge } from '@/components/ui/badge';
import type { LeadStatus, StudentStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: LeadStatus | StudentStatus;
  className?: string;
}

const statusConfig: Record<LeadStatus | StudentStatus, { label: string; className: string }> = {
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
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-slate-100 text-slate-500 border-slate-200',
  },
  expired: {
    label: 'Expired',
    className: 'bg-red-50 text-red-600 border-red-200',
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