"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Github, 
  Star, 
  Code, 
  Trophy, 
  Award,
  User,
  Briefcase,
  Bug,
  Loader2,
  ChevronLeft,
  X,
  LineChart,
  MessageSquare,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import Link from "next/link";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  role: string;
  title: string;
  badges: Badge[];
  stats: {
    commits: number;
    pullRequests: number;
    issues: number;
    codeAdditions: number;
    codeDeletions: number;
  };
  topContributions: {
    title: string;
    description: string;
    type: "commit" | "pr" | "issue";
    date: string;
  }[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// Mock data - replace with actual GitHub API calls
const mockContributors: Contributor[] = [
  {
    id: 1,
    login: "johndoe",
    avatar_url: "https://avatars.githubusercontent.com/u/1234567",
    html_url: "https://github.com/johndoe",
    contributions: 124,
    role: "Lead Developer",
    title: "Feature Architect",
    badges: [
      {
        id: "code-wizard",
        name: "Code Wizard",
        description: "Made 100+ commits",
        icon: "✨",
        unlocked: true
      },
      {
        id: "bug-hunter",
        name: "Bug Hunter",
        description: "Fixed 50+ bugs",
        icon: "🐞",
        unlocked: true
      },
      {
        id: "night-owl",
        name: "Night Owl",
        description: "Commits after midnight",
        icon: "🌙",
        unlocked: false
      }
    ],
    stats: {
      commits: 124,
      pullRequests: 47,
      issues: 28,
      codeAdditions: 12500,
      codeDeletions: 5200
    },
    topContributions: [
      {
        title: "Add authentication system",
        description: "Implemented OAuth2 login flow",
        type: "pr",
        date: "2023-04-15"
      },
      {
        title: "Fix responsive navigation",
        description: "Fixed issues on mobile devices",
        type: "commit",
        date: "2023-03-28"
      },
      {
        title: "Improve performance",
        description: "Added caching layer for API responses",
        type: "pr",
        date: "2023-02-10"
      }
    ]
  },
  {
    id: 2,
    login: "janedoe",
    avatar_url: "https://avatars.githubusercontent.com/u/7654321",
    html_url: "https://github.com/janedoe",
    contributions: 86,
    role: "UI/UX Specialist",
    title: "Design Maestro",
    badges: [
      {
        id: "ui-artist",
        name: "UI Artist",
        description: "Implemented 20+ UI components",
        icon: "🎨",
        unlocked: true
      },
      {
        id: "first-responder",
        name: "First Responder",
        description: "Quick response to issues",
        icon: "⚡",
        unlocked: true
      },
      {
        id: "code-wizard",
        name: "Code Wizard",
        description: "Made 100+ commits",
        icon: "✨",
        unlocked: false
      }
    ],
    stats: {
      commits: 86,
      pullRequests: 32,
      issues: 15,
      codeAdditions: 8400,
      codeDeletions: 3600
    },
    topContributions: [
      {
        title: "Redesign homepage",
        description: "Complete overhaul of landing page",
        type: "pr",
        date: "2023-05-02"
      },
      {
        title: "Add dark mode support",
        description: "Implemented theme switching",
        type: "commit",
        date: "2023-04-18"
      },
      {
        title: "Fix accessibility issues",
        description: "Improved screen reader support",
        type: "pr",
        date: "2023-03-15"
      }
    ]
  },
  {
    id: 3,
    login: "alansmith",
    avatar_url: "https://avatars.githubusercontent.com/u/5555555",
    html_url: "https://github.com/alansmith",
    contributions: 42,
    role: "QA Engineer",
    title: "Bug Fixer",
    badges: [
      {
        id: "bug-hunter",
        name: "Bug Hunter",
        description: "Fixed 50+ bugs",
        icon: "🐞",
        unlocked: true
      },
      {
        id: "tester",
        name: "Meticulous Tester",
        description: "Created comprehensive test cases",
        icon: "🔍",
        unlocked: true
      },
      {
        id: "first-responder",
        name: "First Responder",
        description: "Quick response to issues",
        icon: "⚡",
        unlocked: false
      }
    ],
    stats: {
      commits: 42,
      pullRequests: 18,
      issues: 38,
      codeAdditions: 3200,
      codeDeletions: 2700
    },
    topContributions: [
      {
        title: "Add unit tests for auth module",
        description: "Increased test coverage to 80%",
        type: "pr",
        date: "2023-05-10"
      },
      {
        title: "Fix data loading bug",
        description: "Fixed race condition in API calls",
        type: "commit",
        date: "2023-04-28"
      },
      {
        title: "Implement error handling",
        description: "Added robust error handlers across app",
        type: "pr",
        date: "2023-04-05"
      }
    ]
  }
];

// Helper function to determine role color
const getRoleColor = (role: string): string => {
  switch (role) {
    case "Lead Developer":
      return "bg-purple-600";
    case "UI/UX Specialist":
      return "bg-pink-600";
    case "QA Engineer":
      return "bg-blue-600";
    case "DevOps Engineer":
      return "bg-orange-600";
    case "Backend Developer":
      return "bg-green-600";
    default:
      return "bg-gray-600";
  }
};

// Helper function to get contribution icon
const getContributionIcon = (type: string) => {
  switch (type) {
    case "pr":
      return <Code className="h-4 w-4 text-primary" />;
    case "commit":
      return <Star className="h-4 w-4 text-amber-500" />;
    case "issue":
      return <Bug className="h-4 w-4 text-red-500" />;
    default:
      return <Star className="h-4 w-4" />;
  }
};

export default function Contributors() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  
  const [contributors, setContributors] = useState<Contributor[]>(mockContributors);
  const [loading, setLoading] = useState(true);
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  
  useEffect(() => {
    // Simulate API loading
    if (owner && repo) {
      const timer = setTimeout(() => {
        setLoading(false);
        // Here you would fetch actual data from GitHub API
        // Example: fetchContributors(owner, repo)
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [owner, repo]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Github className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight">
                {owner}/{repo}
              </h1>
            </div>
            <p className="text-muted-foreground">
              Meet the Characters
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button asChild>
              <Link href={`/timeline?owner=${owner}&repo=${repo}`}>
                <LineChart className="h-4 w-4 mr-2" />
                View Timeline
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/sentiment?owner=${owner}&repo=${repo}`}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Code Mood
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/predictions?owner=${owner}&repo=${repo}`}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Predictions
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/achievements?owner=${owner}&repo=${repo}`}>
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </Link>
            </Button>
            <Button className="bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground" onClick={() => window.history.back()}>
              Back to Home
            </Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Contributors Grid */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading contributors data...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributors.map((contributor) => (
                <Card 
                  key={contributor.id} 
                  className="p-6 hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                  onClick={() => setSelectedContributor(contributor)}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Contributor Avatar with animation */}
                    <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-primary/20 hover:border-primary transition-all">
                      <div 
                        className="w-full h-full bg-center bg-cover rounded-full" 
                        style={{ backgroundImage: `url(${contributor.avatar_url})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-1">
                        <span className="text-xs text-white font-medium">View Profile</span>
                      </div>
                    </div>
                    
                    {/* Contributor Name and Role */}
                    <h3 className="text-xl font-bold mb-1">{contributor.login}</h3>
                    <Badge className={`${getRoleColor(contributor.role)} mb-3 text-white`}>
                      {contributor.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">{contributor.title}</p>
                    
                    {/* Stats and Badges */}
                    <div className="flex items-center justify-center gap-2 text-sm mb-4">
                      <span className="flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        {contributor.stats.commits}
                      </span>
                      <span className="flex items-center">
                        <Trophy className="h-4 w-4 mr-1" />
                        {contributor.stats.pullRequests}
                      </span>
                      <span className="flex items-center">
                        <Bug className="h-4 w-4 mr-1" />
                        {contributor.stats.issues}
                      </span>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {contributor.badges.filter(badge => badge.unlocked).map((badge) => (
                        <div 
                          key={badge.id} 
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-colors tooltip relative group"
                          title={`${badge.name}: ${badge.description}`}
                        >
                          <span className="text-lg">{badge.icon}</span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {badge.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contributor Detail Dialog */}
        <Dialog open={!!selectedContributor} onOpenChange={(open) => !open && setSelectedContributor(null)}>
          <DialogContent className="sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 bg-center bg-cover rounded-full" 
                  style={{ backgroundImage: `url(${selectedContributor?.avatar_url})` }}
                />
                {selectedContributor?.login}
              </DialogTitle>
              <DialogDescription>
                <Badge className={`${selectedContributor ? getRoleColor(selectedContributor.role) : 'bg-gray-600'} text-white`}>
                  {selectedContributor?.role}
                </Badge>
                <span className="ml-2 text-muted-foreground">{selectedContributor?.title}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-card rounded-lg p-3">
                  <div className="text-2xl font-bold text-primary">{selectedContributor?.stats.commits}</div>
                  <div className="text-xs text-muted-foreground">Commits</div>
                </div>
                <div className="bg-card rounded-lg p-3">
                  <div className="text-2xl font-bold text-primary">{selectedContributor?.stats.pullRequests}</div>
                  <div className="text-xs text-muted-foreground">Pull Requests</div>
                </div>
                <div className="bg-card rounded-lg p-3">
                  <div className="text-2xl font-bold text-primary">{selectedContributor?.stats.issues}</div>
                  <div className="text-xs text-muted-foreground">Issues</div>
                </div>
              </div>

              {/* Code Stats */}
              <div className="flex justify-between bg-card rounded-lg p-3">
                <div>
                  <div className="text-xs text-muted-foreground">Added</div>
                  <div className="text-sm font-medium text-green-600">+{selectedContributor?.stats.codeAdditions}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Deleted</div>
                  <div className="text-sm font-medium text-red-600">-{selectedContributor?.stats.codeDeletions}</div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h4 className="text-sm font-medium mb-2">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContributor?.badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs 
                        ${badge.unlocked ? 'bg-primary/20' : 'bg-muted'}`}
                    >
                      <span className="text-base">{badge.icon}</span>
                      <span>{badge.name}</span>
                      {!badge.unlocked && <span className="text-muted-foreground text-xs">(Locked)</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributions */}
              <div>
                <h4 className="text-sm font-medium mb-2">Top Contributions</h4>
                <div className="space-y-2">
                  {selectedContributor?.topContributions.map((contribution, index) => (
                    <div key={index} className="flex items-start gap-3 bg-card p-3 rounded-lg">
                      <div className="mt-1">
                        {getContributionIcon(contribution.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{contribution.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {contribution.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {contribution.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild className="bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground mt-2">
                <a href={selectedContributor?.html_url} target="_blank" rel="noopener noreferrer">
                  View GitHub Profile
                  <Github className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
} 