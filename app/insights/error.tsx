'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Insights page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="p-8 max-w-md">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">
            We couldn&apos;t load the insights page. This might be due to a dependency issue 
            or a problem with the data visualization.
          </p>
          <div className="flex flex-col space-y-2">
            <Button onClick={reset} variant="outline" className="mb-2">
              Try again
            </Button>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
