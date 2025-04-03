"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center max-w-2xl">
        <div className="mb-6">
          <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">
          Loading...
        </h1>
        <p className="text-muted-foreground mb-8">
          Please wait while we fetch your data
        </p>
        <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre className="animate-pulse">
            {`// Fetching repository data...
const data = await fetchRepository({
  owner: "...",
  repo: "..."
});

// Analyzing contributions...
const analysis = analyzeContributions(data);

// Preparing insights...
const insights = generateInsights(analysis);`}
          </pre>
        </div>
      </div>
    </div>
  );
} 