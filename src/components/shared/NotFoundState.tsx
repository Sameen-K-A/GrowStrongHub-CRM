'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface NotFoundStateProps {
  type: 'lead' | 'student';
  id?: string;
}

export function NotFoundState({ type, id }: NotFoundStateProps) {
  const router = useRouter();

  const config = {
    lead: {
      title: 'Lead Not Found',
      description: 'The lead you\'re looking for doesn\'t exist or may have been removed.',
      backLabel: 'Back to Leads',
      backPath: '/leads',
    },
    student: {
      title: 'Student Not Found',
      description: 'The student you\'re looking for doesn\'t exist or may have been removed.',
      backLabel: 'Back to Students',
      backPath: '/students',
    },
  };

  const { title, description, backLabel, backPath } = config[type];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            {description}
          </p>
          {id && (
            <p className="text-xs text-muted-foreground/60 font-mono">
              ID: {id}
            </p>
          )}
        </div>

        <Button
          className="flex-1"
          onClick={() => router.push(backPath)}
        >
          <ChevronLeft />
          {backLabel}
        </Button>
      </div>
    </div>
  );
}