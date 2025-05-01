"use client";

import { useState, useEffect } from "react";
import { Github, Sparkles, Code, ExternalLink, Users, BarChart3, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Meteors } from "@/components/ui/meteors";
import { RepositoryLoader } from "@/components/ui/repository-loader";
import { getRepoStats } from "@/lib/github-api";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);
  const router = useRouter();

  // Repository owner and name for the "Star Us" button
  const repoOwner = "Mayank-Ninawe";
  const repoName = "INNOV8ORS-GHRIET";

  const validateGithubUrl = (url: string) => {
    // Enhanced GitHub URL validation regex that handles www and .git suffix
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+(\.git)?\/?$/;
    return githubRegex.test(url);
  };

  const extractRepoInfo = (url: string) => {
    // Extract owner and repo name from URL, handling .git suffix
    const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)(\.git)?\/?/);
    if (match) {
      return { 
        owner: match[1],
        // Remove .git suffix if present
        repo: match[2] 
      };
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsError(false);
    
    if (!repoUrl.trim()) {
      setIsError(true);
      setErrorMessage("Please enter a GitHub repository URL");
      return;
    }
    
    if (!validateGithubUrl(repoUrl)) {
      setIsError(true);
      setErrorMessage("Please enter a valid GitHub repository URL");
      return;
    }
    
    const repoInfo = extractRepoInfo(repoUrl);
    if (repoInfo) {
      // Show loading state
      setIsLoading(true);
      
      // Redirect to timeline page with repo info
      router.push(`/timeline?owner=${repoInfo.owner}&repo=${repoInfo.repo}`);
    }
  };

  const handleDemoClick = (demoUrl: string) => {
    setRepoUrl(demoUrl);
  };

  const handleDirectContributorsView = (owner: string, repo: string) => {
    router.push(`/contributors?owner=${owner}&repo=${repo}`);
  };

  const handleDirectInsightsView = (owner: string, repo: string) => {
    router.push(`/insights?owner=${owner}&repo=${repo}`);
  };

  const exampleRepos = [
    {
      name: "React",
      url: "https://github.com/facebook/react",
      owner: "facebook",
      repo: "react",
      description: "A JavaScript library for building user interfaces"
    },
    {
      name: "Next.js",
      url: "https://github.com/vercel/next.js",
      owner: "vercel",
      repo: "next.js",
      description: "The React framework for the web"
    },
    {
      name: "TensorFlow",
      url: "https://github.com/tensorflow/tensorflow",
      owner: "tensorflow",
      repo: "tensorflow",
      description: "Machine learning platform for everyone"
    }
  ];

  // Fetch repository star count for the "Star Us" button
  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const stats = await getRepoStats(repoOwner, repoName);
        setStarCount(stats.stargazers_count);
      } catch (error) {
        console.error("Error fetching star count:", error);
        // Don't set an error state to keep the UI clean
      }
    };
    
    fetchStarCount();
  }, [repoOwner, repoName]);

  if (isLoading) {
    return <RepositoryLoader message="Preparing to generate your repository story..." />;
  }

  return (
    <main className="min-h-screen">
      <BackgroundBeamsWithCollision className="min-h-screen h-full pb-24">
        {/* Star Us Button - Fixed Position */}
        <div className="absolute top-4 right-4 z-20">
          <a 
            href={`https://github.com/${repoOwner}/${repoName}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-black text-yellow-400 text-sm font-medium py-1.5 px-3 rounded-full border border-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors duration-200"
          >
            <Star className="h-3.5 w-3.5" />
            <span>Star Us</span>
            {starCount !== null && (
              <>
                <span className="mx-0.5">•</span>
                <span className="font-semibold">{starCount.toLocaleString()}</span>
              </>
            )}
          </a>
        </div>
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8 relative">
              <Github className="h-16 w-16 text-primary" />
              <div className="absolute -top-3 -right-3">
                <Sparkles className="h-8 w-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Transform Your GitHub Repo into a Story!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12">
              Visualize your repository journey through an interactive narrative.
              See the characters, plot twists, and development of your codebase.
            </p>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mb-20 max-w-2xl mx-auto">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., https://github.com/facebook/react"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className={cn("flex-1", isError && "border-red-500")}
                  />
                  <Button type="submit" className="transition-all hover:scale-105">
                    Generate Story
                  </Button>
                </div>
                {isError && (
                  <p className="text-red-500 text-sm text-left">{errorMessage}</p>
                )}
              </div>
            </form>

            {/* Example Repos Section - Now inside the background */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-6">Try with these examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exampleRepos.map((repo) => (
                  <Card key={repo.name} className="relative p-6 flex flex-col h-full hover:shadow-md transition-shadow bg-white/80 dark:bg-black/50 backdrop-blur-sm border-0 overflow-hidden">
                    <h3 className="font-semibold text-lg mb-2 relative z-10">{repo.name}</h3>
                    <p className="text-sm text-muted-foreground flex-grow mb-4 relative z-10">
                      {repo.description}
                    </p>
                    <div className="flex flex-col gap-2 mt-auto relative z-10">
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 flex items-center justify-center gap-2"
                          onClick={() => handleDemoClick(repo.url)}
                        >
                          Story <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button 
                          className="flex-1 flex items-center justify-center gap-2 bg-background/80 text-foreground border border-input hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
                          onClick={() => handleDirectContributorsView(repo.owner, repo.repo)}
                        >
                          Contributors <Users className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                        onClick={() => handleDirectInsightsView(repo.owner, repo.repo)}
                      >
                        Insights & Analytics <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Meteors number={10} />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </BackgroundBeamsWithCollision>

      {/* Decorative elements now are absolute positioned */}
      <div className="fixed -z-10 opacity-5 top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4">
          <Code className="w-32 h-32 text-primary animate-pulse" style={{ animationDuration: '7s' }} />
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <Code className="w-32 h-32 text-primary animate-pulse" style={{ animationDuration: '10s' }} />
        </div>
      </div>
    </main>
  );
}