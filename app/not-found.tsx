"use client";

import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center max-w-2xl">
        <div className="mb-6">
          <FileQuestion className="h-16 w-16 text-primary mx-auto" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
} 