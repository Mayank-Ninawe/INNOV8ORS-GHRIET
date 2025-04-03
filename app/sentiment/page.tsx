"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Smile,
  Meh,
  Frown,
  Calendar,
  BarChart2,
  LineChart,
  Loader2,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";

// Mock sentiment analysis data - in a real app, you would use an actual sentiment analysis library
interface CommitSentiment {
  id: string;
  message: string;
  date: string;
  author: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number; // -1 to 1
  keywords: string[];
}

interface SentimentData {
  commits: CommitSentiment[];
  sentimentOverTime: {
    dateRange: string;
    averageScore: number;
  }[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  commonPositiveWords: { word: string; count: number }[];
  commonNegativeWords: { word: string; count: number }[];
  biggestMoodSwings: {
    from: string;
    to: string;
    date: string;
    description: string;
  }[];
}

export default function SentimentPage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner") || "facebook";
  const repo = searchParams.get("repo") || "react";
  
  const [loading, setLoading] = useState(true);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  useEffect(() => {
    // In a real app, this would fetch from an API
    setTimeout(() => {
      setSentimentData(generateMockData());
      setLoading(false);
    }, 1500);
  }, [owner, repo]);

  const generateMockData = (): SentimentData => {
    // This function generates mock data for the example
    // In a real app, this would come from the GitHub API and sentiment analysis
    
    const commits: CommitSentiment[] = [
      {
        id: "abc123",
        message: "Added new feature with improved performance! 🚀",
        date: "2023-05-15",
        author: "developer1",
        sentiment: "positive",
        sentimentScore: 0.82,
        keywords: ["feature", "improved", "performance"]
      },
      {
        id: "def456",
        message: "Fixed critical bug in authentication flow",
        date: "2023-05-10",
        author: "developer2",
        sentiment: "neutral",
        sentimentScore: 0.1,
        keywords: ["fixed", "bug", "authentication"]
      },
      {
        id: "ghi789",
        message: "Refactored horrible code in the user service. This was a nightmare!",
        date: "2023-05-05",
        author: "developer1",
        sentiment: "negative",
        sentimentScore: -0.76,
        keywords: ["refactored", "horrible", "nightmare"]
      },
      {
        id: "jkl012",
        message: "Finally solved the persistent cache issue. So happy it's working now! ✨",
        date: "2023-04-28",
        author: "developer3",
        sentiment: "positive",
        sentimentScore: 0.91,
        keywords: ["solved", "happy", "working"]
      },
      {
        id: "mno345",
        message: "Updated documentation",
        date: "2023-04-22",
        author: "developer2",
        sentiment: "neutral",
        sentimentScore: 0.0,
        keywords: ["updated", "documentation"]
      },
      {
        id: "pqr678",
        message: "This build system is driving me crazy! Tried fixing the CI pipeline again. Still broken. 😡",
        date: "2023-04-15",
        author: "developer1",
        sentiment: "negative",
        sentimentScore: -0.88,
        keywords: ["crazy", "broken", "fixing"]
      },
      {
        id: "stu901",
        message: "Implemented awesome new UI components for the dashboard",
        date: "2023-04-10",
        author: "developer3",
        sentiment: "positive",
        sentimentScore: 0.75,
        keywords: ["awesome", "new", "dashboard"]
      },
      {
        id: "vwx234",
        message: "Addressed code review feedback",
        date: "2023-04-05",
        author: "developer2",
        sentiment: "neutral",
        sentimentScore: 0.05,
        keywords: ["addressed", "feedback", "review"]
      },
      {
        id: "yz0123",
        message: "Everything is broken after the migration. Reverting changes until we figure out what's wrong.",
        date: "2023-03-30",
        author: "developer1",
        sentiment: "negative",
        sentimentScore: -0.82,
        keywords: ["broken", "reverting", "wrong"]
      },
      {
        id: "abc567",
        message: "Breakthrough! Found an elegant solution to our performance bottleneck! 🎉",
        date: "2023-03-25",
        author: "developer3",
        sentiment: "positive",
        sentimentScore: 0.95,
        keywords: ["breakthrough", "elegant", "solution"]
      },
    ];

    return {
      commits,
      sentimentOverTime: [
        { dateRange: "Jan 2023", averageScore: 0.2 },
        { dateRange: "Feb 2023", averageScore: -0.3 },
        { dateRange: "Mar 2023", averageScore: -0.1 },
        { dateRange: "Apr 2023", averageScore: 0.4 },
        { dateRange: "May 2023", averageScore: 0.7 },
      ],
      sentimentDistribution: {
        positive: 40,
        neutral: 30,
        negative: 30
      },
      commonPositiveWords: [
        { word: "feature", count: 12 },
        { word: "improved", count: 10 },
        { word: "awesome", count: 8 },
        { word: "elegant", count: 7 },
        { word: "solution", count: 6 }
      ],
      commonNegativeWords: [
        { word: "bug", count: 15 },
        { word: "broken", count: 11 },
        { word: "nightmare", count: 9 },
        { word: "crazy", count: 8 },
        { word: "wrong", count: 6 }
      ],
      biggestMoodSwings: [
        {
          from: "negative",
          to: "positive",
          date: "2023-03-25",
          description: "From migration issues to performance breakthrough"
        },
        {
          from: "positive",
          to: "negative",
          date: "2023-04-15",
          description: "From UI improvements to CI pipeline frustrations"
        }
      ]
    };
  };

  const getSentimentIcon = (sentiment: "positive" | "neutral" | "negative", size: number = 20) => {
    switch (sentiment) {
      case "positive":
        return <Smile size={size} className="text-green-500" />;
      case "neutral":
        return <Meh size={size} className="text-amber-500" />;
      case "negative":
        return <Frown size={size} className="text-red-500" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return "bg-gradient-to-r from-green-300 to-green-500";
    if (score < -0.3) return "bg-gradient-to-r from-red-300 to-red-500";
    return "bg-gradient-to-r from-amber-300 to-amber-500";
  };

  const getSentimentWidth = (score: number) => {
    return `${Math.abs(score) * 100}%`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Analyzing commit sentiments...</h2>
        <p className="text-muted-foreground mt-2">
          We're reading between the lines of your commit messages
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/timeline?owner=${owner}&repo=${repo}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <div className="ml-auto">
            <Link href={`/predictions?owner=${owner}&repo=${repo}`}>
              <Button className="gap-1">
                <TrendingUp className="h-4 w-4" /> See Predictions
              </Button>
            </Link>
            <Link href={`/achievements?owner=${owner}&repo=${repo}`} className="ml-2">
              <Button className="gap-1">
                <Trophy className="h-4 w-4" /> Achievements
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-heading font-bold">
            The Mood of the Code 
            <span className="inline-flex ml-2">
              <Smile className="h-7 w-7 text-green-500" />
              <Meh className="h-7 w-7 text-amber-500 -ml-1" />
              <Frown className="h-7 w-7 text-red-500 -ml-1" />
            </span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Analyzing the emotional landscape of <span className="font-semibold">{owner}/{repo}</span>
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Sentiment Distribution Card */}
        <Card className="p-6 shadow-md flex flex-col">
          <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Sentiment Breakdown
          </h2>
          
          {sentimentData && (
            <div className="space-y-4 flex-grow">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-green-500" />
                    <span>Happy</span>
                  </div>
                  <span className="font-semibold">{sentimentData.sentimentDistribution.positive}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${sentimentData.sentimentDistribution.positive}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Feature additions, celebrations</p>
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Meh className="h-5 w-5 text-amber-500" />
                    <span>Neutral</span>
                  </div>
                  <span className="font-semibold">{sentimentData.sentimentDistribution.neutral}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${sentimentData.sentimentDistribution.neutral}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Routine maintenance</p>
              </div>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Frown className="h-5 w-5 text-red-500" />
                    <span>Frustrated</span>
                  </div>
                  <span className="font-semibold">{sentimentData.sentimentDistribution.negative}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${sentimentData.sentimentDistribution.negative}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Bug fixes, rollback commits</p>
              </div>
            </div>
          )}
        </Card>

        {/* Mood Heatmap Card */}
        <Card className="p-6 shadow-md col-span-1 lg:col-span-2">
          <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Mood Comparison Chart
          </h2>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger 
                value="all" 
                onClick={() => setSelectedTimeframe("all")}
              >
                All time
              </TabsTrigger>
              <TabsTrigger 
                value="3months" 
                onClick={() => setSelectedTimeframe("3months")}
              >
                Last 3 months
              </TabsTrigger>
              <TabsTrigger 
                value="1month" 
                onClick={() => setSelectedTimeframe("1month")}
              >
                Last month
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {sentimentData && (
                <div className="space-y-4">
                  {sentimentData.sentimentOverTime.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.dateRange}</span>
                        <span className="text-sm font-semibold">
                          {item.averageScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="h-8 bg-muted rounded-full overflow-hidden flex items-center">
                        <div 
                          className={`h-4 ${getSentimentColor(item.averageScore)} rounded-full ml-2`}
                          style={{ width: getSentimentWidth(item.averageScore) }}
                        ></div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between pt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Frown className="h-4 w-4 text-red-500" /> Negative
                    </span>
                    <span className="flex items-center gap-1">
                      Neutral <Meh className="h-4 w-4 text-amber-500" />
                    </span>
                    <span className="flex items-center gap-1">
                      <Smile className="h-4 w-4 text-green-500" /> Positive
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="3months">
              <div className="text-center py-6 text-muted-foreground">
                Data for last 3 months
              </div>
            </TabsContent>
            
            <TabsContent value="1month">
              <div className="text-center py-6 text-muted-foreground">
                Data for last month
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Commits with sentiment */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Recent Commits & Their Moods
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {sentimentData?.commits.map((commit) => (
            <Card key={commit.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getSentimentIcon(commit.sentiment, 24)}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <h3 className="font-medium">{commit.message}</h3>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {commit.date} by {commit.author}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {commit.keywords.map((keyword, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 rounded-full text-xs bg-muted"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center px-2 py-2 rounded-md bg-muted min-w-16 text-center">
                  <div className="font-mono font-semibold text-sm">
                    {commit.sentimentScore > 0 && "+"}
                    {commit.sentimentScore.toFixed(2)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Word Clouds */}
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Common Sentiment Words
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                Positive Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {sentimentData?.commonPositiveWords.map((word, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    style={{ 
                      fontSize: `${Math.max(0.8, Math.min(1.4, 0.8 + word.count / 20))}rem` 
                    }}
                  >
                    {word.word}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-red-500" />
                Negative Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {sentimentData?.commonNegativeWords.map((word, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 rounded-full text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    style={{ 
                      fontSize: `${Math.max(0.8, Math.min(1.4, 0.8 + word.count / 20))}rem` 
                    }}
                  >
                    {word.word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Mood Swings */}
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Biggest Mood Swings
          </h2>
          
          <div className="space-y-4">
            {sentimentData?.biggestMoodSwings.map((swing, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(swing.from as "positive" | "neutral" | "negative")}
                    <span className="text-muted-foreground">→</span>
                    {getSentimentIcon(swing.to as "positive" | "neutral" | "negative")}
                  </div>
                  <span className="text-sm text-muted-foreground">{swing.date}</span>
                </div>
                <p className="text-sm">{swing.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 