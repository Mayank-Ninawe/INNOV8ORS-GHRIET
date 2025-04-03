"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getRepoData } from "@/lib/github-api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, BarChart3, Users } from "lucide-react";
import Link from "next/link";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Image from "next/image";
import { RepositoryLoader } from "@/components/ui/repository-loader";

export default function InsightsFallback() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repoData, setRepoData] = useState<any>(null);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      if (!owner || !repo) {
        setError("Missing repository information");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cleanRepo = repo.replace(/\.git$/, '').replace(/\/$/, '');
        const data = await getRepoData(owner, cleanRepo);
        setRepoData(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch repository data");
        setLoading(false);
      }
    }

    fetchData();
  }, [owner, repo]);

  if (loading) {
    return <RepositoryLoader message="Loading repository data..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-6">{error}</p>
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

  if (!repoData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No data available</h2>
            <p className="mb-6">We couldn&apos;t load the repository data at this time.</p>
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
            <div className="flex justify-between items-center flex-wrap gap-4">
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
                <Link href={`/contributors?owner=${owner}&repo=${repo}`}>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" /> View Contributors
                  </Button>
                </Link>
              </div>
            </div>
            
            {repoData.repoStats && (
              <div className="flex items-center gap-4 mt-6 mb-4">
                <Image 
                  src={repoData.repoStats.owner.avatar_url} 
                  alt={repoData.repoStats.owner.login}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {repoData.repoStats.full_name} - Insights
                  </h1>
                  {repoData.repoStats.description && (
                    <p className="text-muted-foreground mt-1">{repoData.repoStats.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <Card className="p-8 mb-8">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Repository Insights</h2>
              <p className="mb-4">Here are the key statistics for this repository:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <p className="text-lg font-semibold">Contributors</p>
                  <p className="text-3xl font-bold mt-2">{repoData.contributors?.length || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">Issues</p>
                  <p className="text-3xl font-bold mt-2">{repoData.issues?.length || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">Pull Requests</p>
                  <p className="text-3xl font-bold mt-2">{repoData.pullRequests?.length || 0}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <p className="text-muted-foreground">
                  For more detailed charts and analytics, please ensure echarts-for-react is properly installed.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </BackgroundBeamsWithCollision>
    </main>
  );
}
