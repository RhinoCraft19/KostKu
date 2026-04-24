'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col items-center justify-center space-y-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Terjadi kesalahan!</h2>
        <p className="text-muted-foreground">
          Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
        </p>
      </div>
      <Button onClick={() => reset()} className="gap-2">
        <RefreshCcw className="h-4 w-4" />
        Coba Lagi
      </Button>
    </div>
  );
}
