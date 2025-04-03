"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getRepoData, RepoStats, Contributor, Issue, PullRequest } from "@/lib/github-api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, Users, GitPullRequest, AlertCircle, Star, GitFork, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Meteors } from "@/components/ui/meteors";

export default function TimelinePage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [story, setStory] = useState<string[]>([]);

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
        
        const data = await getRepoData(owner, cleanRepo);
        setRepoStats(data.repoStats);
        setContributors(data.contributors || []);
        setIssues(data.issues || []);
        setPullRequests(data.pullRequests || []);
        generateStory(data.repoStats, data.contributors || [], data.issues || [], data.pullRequests || []);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch repository data. Please check if the repository exists and is public.");
        setLoading(false);
      }
    }

    fetchData();
  }, [owner, repo]);

  const generateStory = (
    repoStats: RepoStats,
    contributors: Contributor[],
    issues: Issue[],
    pullRequests: PullRequest[]
  ) => {
    // Generate a story based on repository data
    const storyParts = [];

    // Introduction
    const creationDate = new Date(repoStats.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    storyParts.push(`Once upon a time, on ${creationDate}, a new repository called "${repoStats.name}" was born into the GitHub universe.`);

    // Add repository description if available
    if (repoStats.description) {
      storyParts.push(`Its purpose was clear: ${repoStats.description}`);
    }

    // Talk about the creator and main contributors
    if (contributors.length > 0) {
      const creator = contributors[0];
      const topContributors = contributors.slice(0, 5);
      
      storyParts.push(`The repository was created by ${creator.login}, who would become its most devoted contributor with ${creator.contributions} contributions.`);
      
      if (topContributors.length > 1) {
        const otherContributors = topContributors.slice(1).map(c => `${c.login} (${c.contributions} contributions)`).join(', ');
        storyParts.push(`${creator.login} wasn't alone in this journey. They were joined by talented developers like ${otherContributors}.`);
      }
      
      storyParts.push(`In total, ${contributors.length} developers contributed their skills and time to help this project grow.`);
    }

    // Talk about the repository popularity
    storyParts.push(`Over time, the repository gained recognition: ${repoStats.stargazers_count} developers starred it, ${repoStats.watchers_count} kept watching its progress, and it was forked ${repoStats.forks_count} times.`);

    // Talk about issues and pull requests
    if (issues.length > 0) {
      storyParts.push(`The journey wasn't without challenges. ${issues.length} issues were opened, documenting bugs to fix and features to add.`);
      
      // Get a few notable issues
      const openIssues = issues.filter(issue => issue.state === 'open').length;
      const closedIssues = issues.filter(issue => issue.state === 'closed').length;
      
      storyParts.push(`The team successfully resolved ${closedIssues} issues, while ${openIssues} remain open, waiting for solutions.`);
    }

    if (pullRequests.length > 0) {
      storyParts.push(`The repository evolved through ${pullRequests.length} pull requests, each adding new features or fixing existing problems.`);
      
      // Calculate code changes
      const totalAdditions = pullRequests.reduce((sum, pr) => sum + (pr.additions || 0), 0);
      const totalDeletions = pullRequests.reduce((sum, pr) => sum + (pr.deletions || 0), 0);
      
      if (totalAdditions > 0 || totalDeletions > 0) {
        storyParts.push(`These changes added ${totalAdditions} lines of code and removed ${totalDeletions} lines, continuously refining the project.`);
      }
    }

    // Language information
    if (repoStats.language) {
      storyParts.push(`The primary language of this story is ${repoStats.language}, the foundation upon which this project was built.`);
    }

    // Conclusion
    const lastUpdateDate = new Date(repoStats.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    storyParts.push(`The latest chapter of this ongoing story was written on ${lastUpdateDate}, but the journey continues as developers keep contributing to ${repoStats.name}.`);

    setStory(storyParts);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Generating your repository story...</p>
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
              This could be due to GitHub API rate limits or the repository being private.
              Try again later or try a different repository.
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
                <Link href={`/contributors?owner=${owner}&repo=${repo}`}>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" /> View Contributors
                  </Button>
                </Link>
                <Link href={`/insights?owner=${owner}&repo=${repo}`}>
                  <Button variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" /> View Insights
                  </Button>
                </Link>
              </div>
            </div>
            
            {repoStats && (
              <div className="flex items-center gap-4 mb-4">
                <Image 
                  src={repoStats.owner.avatar_url} 
                  alt={repoStats.owner.login}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {repoStats.full_name}
                  </h1>
                  {repoStats.description && (
                    <p className="text-muted-foreground mt-1">{repoStats.description}</p>
                  )}
                </div>
                <div className="ml-auto flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-1 text-yellow-400" />
                    <span>{repoStats.stargazers_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <GitFork className="h-5 w-5 mr-1" />
                    <span>{repoStats.forks_count.toLocaleString()}</span>
                  </div>
                  <Link href={`https://github.com/${repoStats.full_name}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Github className="h-4 w-4 mr-2" /> View on GitHub
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Story Section */}
          <Card className="p-8 mb-8 relative overflow-hidden bg-background/70 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">The Story of {owner}/{repo}</h2>
            <div className="prose prose-lg max-w-none">
              {story.map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            <Meteors number={5} className="opacity-30" />
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 flex flex-col items-center text-center">
              <Users className="h-8 w-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Contributors</h3>
              <p className="text-3xl font-bold mb-1">{contributors.length}</p>
              <p className="text-sm text-muted-foreground">
                Developers who shaped this project
              </p>
              <Link href={`/contributors?owner=${owner}&repo=${repo}`} className="mt-4">
                <Button variant="outline" size="sm">
                  View Contributors
                </Button>
              </Link>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <AlertCircle className="h-8 w-8 mb-4 text-amber-500" />
              <h3 className="text-xl font-semibold mb-2">Issues</h3>
              <p className="text-3xl font-bold mb-1">{issues.length}</p>
              <p className="text-sm text-muted-foreground">
                Challenges and improvements tracked
              </p>
              <Link href={`https://github.com/${owner}/${repo}/issues`} target="_blank" rel="noopener noreferrer" className="mt-4">
                <Button variant="outline" size="sm">
                  View on GitHub
                </Button>
              </Link>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <GitPullRequest className="h-8 w-8 mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Pull Requests</h3>
              <p className="text-3xl font-bold mb-1">{pullRequests.length}</p>
              <p className="text-sm text-muted-foreground">
                Code contributions merged into the codebase
              </p>
              <Link href={`https://github.com/${owner}/${repo}/pulls`} target="_blank" rel="noopener noreferrer" className="mt-4">
                <Button variant="outline" size="sm">
                  View on GitHub
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </main>
  );
}