import { Loader } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-black tracking-tight bg-linear-to-b from-primary via-primary to-foreground bg-clip-text text-transparent">
          GrowStrongHub
        </span>
        <Loader className="h-5 w-5 text-primary animate-spin" />
      </div>
    </div>
  );
}