"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Calendar, 
  GithubIcon, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  Bug, 
  MessageSquare,
  Filter,
  Loader2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import Link from "next/link";

interface TimelineEvent {
  id: number;
  type: "commit" | "pull" | "issue";
  title: string;
  description: string;
  date: string;
  author: string;
  category: "milestone" | "feature" | "bugfix" | "community";
  emoji: string;
}

interface FilterState {
  commits: boolean;
  pulls: boolean;
  issues: boolean;
  milestones: boolean;
  features: boolean;
  bugfixes: boolean;
  community: boolean;
}

// Mock data - replace with actual GitHub API calls
const mockEvents: TimelineEvent[] = [
  {
    id: 1,
    type: "commit",
    title: "Initial commit",
    description: "Project setup and basic structure",
    date: "2023-04-01",
    author: "johndoe",
    category: "milestone",
    emoji: "🚀"
  },
  {
    id: 2,
    type: "commit",
    title: "Add authentication system",
    description: "Implemented user login and registration",
    date: "2023-04-03",
    author: "janedoe",
    category: "feature",
    emoji: "📢"
  },
  {
    id: 3,
    type: "pull",
    title: "Fix navigation bar",
    description: "Fixed responsive issues in the navigation component",
    date: "2023-04-05",
    author: "johndoe",
    category: "bugfix",
    emoji: "🛠️"
  },
  {
    id: 4,
    type: "issue",
    title: "Dark mode support",
    description: "We need to add dark mode support",
    date: "2023-04-10",
    author: "community-member",
    category: "community",
    emoji: "💬"
  },
  {
    id: 5,
    type: "commit",
    title: "v1.0.0 Release",
    description: "First stable version release",
    date: "2023-04-15",
    author: "janedoe",
    category: "milestone",
    emoji: "🚀"
  }
];

export default function Timeline() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  
  const [events, setEvents] = useState<TimelineEvent[]>(mockEvents);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    commits: true,
    pulls: true,
    issues: true,
    milestones: true,
    features: true,
    bugfixes: true,
    community: true
  });

  useEffect(() => {
    // Simulate API loading
    if (owner && repo) {
      const timer = setTimeout(() => {
        setLoading(false);
        // Here you would fetch actual data from GitHub API
        // Example: fetchGitHubData(owner, repo)
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [owner, repo]);

  const handleFilterChange = (filterKey: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const filteredEvents = events.filter(event => {
    if (event.type === "commit" && !filters.commits) return false;
    if (event.type === "pull" && !filters.pulls) return false;
    if (event.type === "issue" && !filters.issues) return false;
    if (event.category === "milestone" && !filters.milestones) return false;
    if (event.category === "feature" && !filters.features) return false;
    if (event.category === "bugfix" && !filters.bugfixes) return false;
    if (event.category === "community" && !filters.community) return false;
    return true;
  });

  const renderEventIcon = (event: TimelineEvent) => {
    switch (event.type) {
      case "commit":
        return <GitCommit className="h-5 w-5 text-primary" />;
      case "pull":
        return <GitPullRequest className="h-5 w-5 text-purple-500" />;
      case "issue":
        return <Bug className="h-5 w-5 text-orange-500" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: TimelineEvent["category"]) => {
    switch (category) {
      case "milestone":
        return "bg-blue-500";
      case "feature":
        return "bg-green-500";
      case "bugfix":
        return "bg-red-500";
      case "community":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <GithubIcon className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight">
                {owner}/{repo}
              </h1>
            </div>
            <p className="text-muted-foreground">
              The Evolution of Your Project
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button asChild>
              <Link href={`/contributors?owner=${owner}&repo=${repo}`}>
                <Users className="h-4 w-4 mr-2" />
                Meet Contributors
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/sentiment?owner=${owner}&repo=${repo}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Code Mood
              </Link>
            </Button>
            <Button className="bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground" onClick={() => window.history.back()}>
              Back to Home
            </Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Filters Section */}
        <div className="bg-card p-4 rounded-lg shadow mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h2 className="font-semibold">Filters</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Toggle 
              pressed={filters.commits} 
              onPressedChange={() => handleFilterChange('commits')}
              className="data-[state=on]:bg-primary/20"
            >
              <GitCommit className="h-4 w-4 mr-2" />
              Commits
            </Toggle>
            <Toggle 
              pressed={filters.pulls} 
              onPressedChange={() => handleFilterChange('pulls')}
              className="data-[state=on]:bg-primary/20"
            >
              <GitPullRequest className="h-4 w-4 mr-2" />
              Pull Requests
            </Toggle>
            <Toggle 
              pressed={filters.issues} 
              onPressedChange={() => handleFilterChange('issues')}
              className="data-[state=on]:bg-primary/20"
            >
              <Bug className="h-4 w-4 mr-2" />
              Issues
            </Toggle>
            <Toggle 
              pressed={filters.community} 
              onPressedChange={() => handleFilterChange('community')}
              className="data-[state=on]:bg-primary/20"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Community
            </Toggle>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading repository data...</span>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              {/* Timeline Events */}
              <div className="space-y-8 ml-16 relative">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="relative">
                    {/* Timeline node */}
                    <div className="absolute -left-[60px] flex items-center justify-center w-10 h-10 rounded-full border bg-background">
                      {renderEventIcon(event)}
                    </div>
                    
                    {/* Timeline content */}
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{event.emoji}</span>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {event.date}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              by {event.author}
                            </span>
                          </div>
                        </div>
                        <Badge className={`ml-auto ${getCategoryColor(event.category)} text-white`}>
                          {event.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 