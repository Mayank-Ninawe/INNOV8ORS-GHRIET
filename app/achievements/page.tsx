"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Trophy,
  Star,
  Medal,
  Crown,
  Zap,
  Target,
  Users,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// Types for achievements and challenges
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  dateUnlocked?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "prediction" | "quiz" | "contribution";
  status: "locked" | "in_progress" | "completed";
  reward: {
    points: number;
    badge?: string;
  };
  deadline?: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  points: number;
  badges: number;
  recentActivity: string;
}

export default function AchievementsPage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner") || "facebook";
  const repo = searchParams.get("repo") || "react";
  
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    setTimeout(() => {
      setAchievements(generateMockAchievements());
      setChallenges(generateMockChallenges());
      setLeaderboard(generateMockLeaderboard());
      setLoading(false);
    }, 1500);
  }, [owner, repo]);

  const generateMockAchievements = (): Achievement[] => {
    return [
      {
        id: "commit-master",
        title: "Commit Master",
        description: "Make 100 commits to the repository",
        icon: "💻",
        progress: 75,
        total: 100,
        unlocked: false,
      },
      {
        id: "bug-hunter",
        title: "Bug Hunter",
        description: "Fix 50 issues",
        icon: "🐛",
        progress: 30,
        total: 50,
        unlocked: false,
      },
      {
        id: "review-expert",
        title: "Review Expert",
        description: "Review 25 pull requests",
        icon: "👀",
        progress: 25,
        total: 25,
        unlocked: true,
        dateUnlocked: "2024-02-15",
      },
      {
        id: "early-bird",
        title: "Early Bird",
        description: "Contribute during the first month",
        icon: "🌅",
        progress: 1,
        total: 1,
        unlocked: true,
        dateUnlocked: "2024-01-10",
      },
    ];
  };

  const generateMockChallenges = (): Challenge[] => {
    return [
      {
        id: "predict-commit",
        title: "Predict the Next Commit",
        description: "Guess when the next major commit will happen",
        type: "prediction",
        status: "in_progress",
        reward: {
          points: 100,
          badge: "🔮",
        },
        deadline: "2024-03-01",
      },
      {
        id: "commit-quiz",
        title: "Commit History Quiz",
        description: "Test your knowledge of the repository's history",
        type: "quiz",
        status: "locked",
        reward: {
          points: 50,
          badge: "🎯",
        },
      },
      {
        id: "contribution-streak",
        title: "7-Day Contribution Streak",
        description: "Make contributions for 7 consecutive days",
        type: "contribution",
        status: "completed",
        reward: {
          points: 200,
          badge: "🔥",
        },
      },
    ];
  };

  const generateMockLeaderboard = (): LeaderboardEntry[] => {
    return [
      {
        rank: 1,
        username: "devmaster",
        avatar: "https://github.com/devmaster.png",
        points: 1250,
        badges: 8,
        recentActivity: "Fixed critical bug",
      },
      {
        rank: 2,
        username: "codequeen",
        avatar: "https://github.com/codequeen.png",
        points: 980,
        badges: 6,
        recentActivity: "Added new feature",
      },
      {
        rank: 3,
        username: "bugslayer",
        avatar: "https://github.com/bugslayer.png",
        points: 750,
        badges: 5,
        recentActivity: "Reviewed PR",
      },
      {
        rank: 4,
        username: "newbie",
        avatar: "https://github.com/newbie.png",
        points: 320,
        badges: 2,
        recentActivity: "First contribution",
      },
    ];
  };

  const getStatusIcon = (status: Challenge["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "locked":
        return <Sparkles className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Loading achievements...</h2>
        <p className="text-muted-foreground mt-2">
          Preparing your gaming experience
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Link href={`/timeline?owner=${owner}&repo=${repo}`}>
            <Button className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-heading font-bold flex items-center">
            Unlock the Story 
            <Trophy className="h-6 w-6 text-amber-400 ml-2" />
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Track your progress and achievements in {owner}/{repo}
        </p>
      </div>

      {/* Main content */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="achievements">
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <Target className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Crown className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{achievement.title}</h3>
                      {achievement.unlocked && (
                        <span className="text-xs text-green-500 flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {achievement.description}
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>
                          {achievement.progress}/{achievement.total}
                        </span>
                      </div>
                      <Progress
                        value={(achievement.progress / achievement.total) * 100}
                        className="h-2"
                      />
                    </div>
                    {achievement.unlocked && achievement.dateUnlocked && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Unlocked on {new Date(achievement.dateUnlocked).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="p-6">
                <div className="flex items-start gap-4">
                  {getStatusIcon(challenge.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <span className="text-sm text-primary">
                        {challenge.reward.points} points
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {challenge.description}
                    </p>
                    {challenge.deadline && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                      </p>
                    )}
                    {challenge.reward.badge && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="text-sm">Reward:</span>
                        <span className="text-xl">{challenge.reward.badge}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Contributor</th>
                    <th className="text-center py-3 px-4">Points</th>
                    <th className="text-center py-3 px-4">Badges</th>
                    <th className="text-left py-3 px-4">Recent Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b">
                      <td className="py-3 px-4">
                        {entry.rank === 1 ? (
                          <Crown className="h-5 w-5 text-amber-400" />
                        ) : (
                          <span className="font-medium">#{entry.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={entry.avatar}
                            alt={entry.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-medium">{entry.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-amber-400" />
                          {entry.points}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Medal className="h-4 w-4 text-blue-400" />
                          {entry.badges}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {entry.recentActivity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 