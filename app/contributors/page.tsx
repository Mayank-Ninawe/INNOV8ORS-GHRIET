"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getContributors, Contributor } from "@/lib/github-api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, AlertCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function ContributorsPage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!owner || !repo) {
        setError("Missing repository information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Clean the repo name to handle URLs with .git or trailing slashes
        const cleanRepo = repo.replace(/\.git$/, '').replace(/\/$/, '');
        const contributorsData = await getContributors(owner, cleanRepo);
        setContributors(contributorsData);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching contributors:", error);
        setError(error.message || "Failed to fetch contributors data. Please check if the repository exists and is public.");
        setLoading(false);
      }
    }

    fetchData();
  }, [owner, repo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading contributors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-6">{error}</p>
            <p className="text-sm text-muted-foreground mb-6">
              {error.includes("rate limit") ? 
                "GitHub limits API requests to 60 per hour for unauthenticated users. Try again later or use a GitHub token." : 
                "This could be due to API limits or the repository being private."}
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <BackgroundBeamsWithCollision className="min-h-screen h-full pb-24">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
              </Link>
              
              <div className="flex gap-2">
                <Link href={`/timeline?owner=${owner}&repo=${repo}`}>
                  <Button variant="outline">
                    View Repository Story
                  </Button>
                </Link>
                <Link href={`/insights?owner=${owner}&repo=${repo}`}>
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" /> View Insights
                  </Button>
                </Link>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Contributors to {owner}/{repo}
            </h1>
            <p className="text-muted-foreground">
              {contributors.length} developers who have contributed to this project
            </p>
          </div>

          {/* Contributors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {contributors.map((contributor) => (
              <Card key={contributor.id} className="p-6 flex flex-col items-center">
                <Image 
                  src={contributor.avatar_url} 
                  alt={contributor.login}
                  width={64}
                  height={64}
                  className="rounded-full mb-4"
                />
                <h3 className="text-lg font-semibold mb-1">{contributor.login}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {contributor.contributions.toLocaleString()} contributions
                </p>
                <Link 
                  href={contributor.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto"
                >
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" /> View Profile
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </main>
  );
}