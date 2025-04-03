"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center max-w-2xl">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 