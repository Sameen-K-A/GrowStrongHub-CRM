import { Card, CardContent } from '@/components/ui/card';

export default function AdminLoading() {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded mt-2" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-32 bg-muted rounded" />
          <div className="h-9 w-36 bg-muted rounded" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-none border">
            <CardContent className="p-5">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-10 w-16 bg-muted rounded mt-3" />
              <div className="h-3 w-32 bg-muted rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <Card className="shadow-none border">
        <CardContent className="p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-6 w-8 bg-muted rounded" />
                <div className="h-6 flex-1 bg-muted rounded" />
                <div className="h-6 w-24 bg-muted rounded" />
                <div className="h-6 w-20 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}