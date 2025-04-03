"use client";

import { useState } from "react";
import { Github, GitBranch, GitCommit, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement GitHub repo fetching
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <Github className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            GitHub Repository Story
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Transform your GitHub repository into an interactive story. Visualize commits,
            analyze sentiment, and discover insights about your project&apos;s journey.
          </p>

          <form onSubmit={handleSubmit} className="mb-12">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter GitHub repository URL (e.g., facebook/react)"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                Visualize
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <GitCommit className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Commit Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your repository&apos;s history through an interactive timeline
              </p>
            </Card>

            <Card className="p-6 text-center">
              <GitPullRequest className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Understand team mood through commit message analysis
              </p>
            </Card>

            <Card className="p-6 text-center">
              <GitBranch className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Contributor Insights</h3>
              <p className="text-sm text-muted-foreground">
                Meet the characters behind your codebase
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}