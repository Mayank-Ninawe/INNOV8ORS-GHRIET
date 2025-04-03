"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { getRepoData, RepoStats, Contributor, Issue, PullRequest } from "@/lib/github-api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, AlertCircle, LineChart, BarChart3, PieChart, Trophy, Clock, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { RepositoryLoader } from "@/components/ui/repository-loader";

// Dynamically import ECharts with no SSR to avoid hydration issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function InsightsPage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [repoHealth, setRepoHealth] = useState<number>(0);

  // Calculate insights when data is loaded
  const insights = useMemo(() => {
    if (!contributors.length && !issues.length && !pullRequests.length) {
      return {
        topContributors: [],
        prFrequency: "N/A",
        avgResolutionTime: "N/A",
        healthScore: 0,
        openIssues: 0,
        closedIssues: 0,
        openPRs: 0,
        closedPRs: 0
      };
    }

    // 1. Most active contributors (ranked by contributions)
    const topContributors = [...contributors]
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 5);

    // 2. PR frequency calculation
    const mergedPRs = pullRequests.filter(pr => pr.merged_at);
    let prFrequency = 0;
    
    if (mergedPRs.length > 1) {
      // Sort PRs by merged_at date
      const sortedPRs = [...mergedPRs].sort((a, b) => 
        new Date(a.merged_at!).getTime() - new Date(b.merged_at!).getTime()
      );
      
      // Calculate average days between PRs
      let totalDays = 0;
      for (let i = 1; i < sortedPRs.length; i++) {
        const current = new Date(sortedPRs[i].merged_at!);
        const previous = new Date(sortedPRs[i-1].merged_at!);
        totalDays += (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
      }
      
      // Average days between PRs
      prFrequency = totalDays / (sortedPRs.length - 1);
    }

    // 3. Issue resolution time
    const closedIssues = issues.filter(issue => issue.closed_at);
    let avgResolutionTime = 0;
    
    if (closedIssues.length > 0) {
      let totalResolutionTime = 0;
      for (const issue of closedIssues) {
        const created = new Date(issue.created_at);
        const closed = new Date(issue.closed_at!);
        totalResolutionTime += (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      }
      avgResolutionTime = totalResolutionTime / closedIssues.length;
    }

    // 4. Calculate repository health score (0-100)
    let healthScore = 0;
    
    // Factor 1: PR frequency (lower is better, but we have a maximum threshold)
    const prScore = prFrequency === 0 ? 0 : Math.min(30, Math.max(0, 30 - (prFrequency / 10 * 30)));
    
    // Factor 2: Issue resolution time (lower is better)
    const issueScore = avgResolutionTime === 0 ? 0 : Math.min(30, Math.max(0, 30 - (avgResolutionTime / 30 * 30)));
    
    // Factor 3: Number of contributors (more is better, up to a point)
    const contributorScore = Math.min(20, contributors.length / 10 * 20);
    
    // Factor 4: Number of stars (more is better)
    const starScore = repoStats ? Math.min(20, Math.log10(repoStats.stargazers_count + 1) * 10) : 0;
    
    healthScore = Math.round(prScore + issueScore + contributorScore + starScore);
    setRepoHealth(healthScore);

    return {
      topContributors,
      prFrequency: prFrequency.toFixed(1),
      avgResolutionTime: avgResolutionTime.toFixed(1),
      healthScore,
      openIssues: issues.filter(issue => issue.state === 'open').length,
      closedIssues: closedIssues.length,
      openPRs: pullRequests.filter(pr => pr.state === 'open').length,
      closedPRs: pullRequests.filter(pr => pr.state === 'closed').length
    };
  }, [contributors, issues, pullRequests, repoStats]);

  // Chart options for contributors
  const contributorsChartOption = useMemo(() => {
    if (!insights || !insights.topContributors.length) return {};
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} contributions',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 8,
        textStyle: {
          color: '#fff'
        }
      },
      xAxis: {
        type: 'category',
        data: insights.topContributors.map(c => c.login),
        axisLabel: {
          rotate: 45,
          interval: 0,
          color: '#888',
          fontWeight: 500
        },
        axisLine: {
          lineStyle: {
            color: '#ddd'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Contributions',
        nameTextStyle: {
          color: '#888',
          fontWeight: 500
        },
        axisLabel: {
          color: '#888'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      series: [
        {
          name: 'Contributions',
          type: 'bar',
          data: insights.topContributors.map(c => c.contributions),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82f6' }, // Blue-500
                { offset: 1, color: '#60a5fa' }  // Blue-400
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#2563eb' }, // Blue-600
                  { offset: 1, color: '#3b82f6' }  // Blue-500
                ]
              }
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#888'
          }
        }
      ]
    };
  }, [insights]);

  // Chart options for issues
  const issuesChartOption = useMemo(() => {
    if (!insights) return {};
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 8,
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          color: '#888',
          fontWeight: 500
        },
        itemGap: 20
      },
      series: [
        {
          name: 'Issues',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c} ({d}%)',
            color: '#888',
            fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { 
              value: insights.openIssues, 
              name: 'Open Issues', 
              itemStyle: { 
                color: '#f97316'  // Orange-500 for open issues
              }
            },
            { 
              value: insights.closedIssues, 
              name: 'Closed Issues', 
              itemStyle: { 
                color: '#10b981'  // Emerald-500 for closed issues
              }
            }
          ]
        }
      ]
    };
  }, [insights]);

  // Chart options for pull requests
  const pullRequestsChartOption = useMemo(() => {
    if (!insights) return {};
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 8,
        textStyle: {
          color: '#fff'
        }
      },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: {
          padding: [2, 4],
          color: '#888',
          fontWeight: 500
        },
        itemGap: 20
      },
      series: [
        {
          name: 'Pull Requests',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {c} ({d}%)',
            color: '#888',
            fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#333'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { 
              value: insights.openPRs, 
              name: 'Open PRs', 
              itemStyle: { 
                color: '#6366f1'  // Indigo-500 for open PRs
              }
            },
            { 
              value: insights.closedPRs, 
              name: 'Closed PRs', 
              itemStyle: { 
                color: '#8b5cf6'  // Purple-500 for closed PRs
              }
            }
          ]
        }
      ]
    };
  }, [insights]);

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
        
        // Clean the repo name to handle URLs with .git or trailing slashes
        const cleanRepo = repo.replace(/\.git$/, '').replace(/\/$/, '');
        
        const data = await getRepoData(owner, cleanRepo);
        setRepoStats(data.repoStats);
        setContributors(data.contributors || []);
        setIssues(data.issues || []);
        setPullRequests(data.pullRequests || []);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch repository data. Please check if the repository exists and is public.");
        setLoading(false);
      }
    }

    fetchData();
  }, [owner, repo]);

  if (loading) {
    return <RepositoryLoader message="Generating repository insights..." />;
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
                    View Contributors
                  </Button>
                </Link>
              </div>
            </div>
            
            {repoStats && (
              <div className="flex items-center gap-4 mt-6 mb-4">
                <Image 
                  src={repoStats.owner.avatar_url} 
                  alt={repoStats.owner.login}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {repoStats.full_name} - Insights
                  </h1>
                  {repoStats.description && (
                    <p className="text-muted-foreground mt-1">{repoStats.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Health Score Card */}
          <Card className="p-8 mb-8 bg-background/70 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Repository Health Score</h2>
                <p className="text-muted-foreground mb-4">
                  Based on contributor activity, PR frequency, and issue resolution time
                </p>
              </div>
              
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{repoHealth}</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke={repoHealth > 80 ? "#22c55e" : repoHealth > 50 ? "#eab308" : "#ef4444"} 
                    strokeWidth="10" 
                    strokeDasharray={`${repoHealth * 2.83} 283`} 
                    strokeDashoffset="0" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <Trophy className="h-8 w-8 text-amber-500" />
                <h3 className="text-xl font-semibold">Top Contributors</h3>
              </div>
              {insights && insights.topContributors.slice(0, 3).map((contributor, idx) => (
                <div key={contributor.id} className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold">{idx + 1}.</span>
                  <Image 
                    src={contributor.avatar_url} 
                    alt={contributor.login}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span>{contributor.login}</span>
                  <span className="ml-auto text-muted-foreground">{contributor.contributions}</span>
                </div>
              ))}
              {(!insights.topContributors || insights.topContributors.length === 0) && (
                <p className="text-center text-muted-foreground">No contributor data available</p>
              )}
            </Card>

            <Card className="p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <GitPullRequest className="h-8 w-8 text-blue-500" />
                <h3 className="text-xl font-semibold">PR Frequency</h3>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{insights?.prFrequency || "N/A"}</p>
                <p className="text-muted-foreground">Average days between PRs</p>
              </div>
              {insights && Number(insights.prFrequency) > 0 && (
                <div className="mt-4 text-sm text-center">
                  {Number(insights.prFrequency) < 7 ? (
                    <p className="text-green-500">Great! PRs are merged frequently.</p>
                  ) : Number(insights.prFrequency) < 14 ? (
                    <p className="text-amber-500">Good PR frequency. Regular updates.</p>
                  ) : (
                    <p className="text-red-500">PRs are infrequent. Consider increasing velocity.</p>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <Clock className="h-8 w-8 text-green-500" />
                <h3 className="text-xl font-semibold">Issue Resolution</h3>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold mb-2">{insights?.avgResolutionTime || "N/A"}</p>
                <p className="text-muted-foreground">Average days to close issues</p>
              </div>
              {insights && Number(insights.avgResolutionTime) > 0 && (
                <div className="mt-4 text-sm text-center">
                  {Number(insights.avgResolutionTime) < 7 ? (
                    <p className="text-green-500">Excellent! Issues are resolved quickly.</p>
                  ) : Number(insights.avgResolutionTime) < 30 ? (
                    <p className="text-amber-500">Good resolution time. Keep it up.</p>
                  ) : (
                    <p className="text-red-500">Issues take a long time to resolve.</p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30">
              <div className="flex items-center gap-4 mb-4">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                <h3 className="text-xl font-semibold">Top Contributors</h3>
              </div>
              <div className="h-80">
                {insights.topContributors.length > 0 ? (
                  <ReactECharts option={contributorsChartOption} style={{ height: '100%', width: '100%' }} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No contributor data available</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-950/30">
              <div className="flex items-center gap-4 mb-4">
                <PieChart className="h-6 w-6 text-orange-500" />
                <h3 className="text-xl font-semibold">Issues</h3>
              </div>
              <div className="h-80">
                {(insights.openIssues > 0 || insights.closedIssues > 0) ? (
                  <ReactECharts option={issuesChartOption} style={{ height: '100%', width: '100%' }} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No issue data available</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-8 overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30">
            <div className="flex items-center gap-4 mb-4">
              <LineChart className="h-6 w-6 text-indigo-500" />
              <h3 className="text-xl font-semibold">Pull Requests</h3>
            </div>
            <div className="h-80">
              {(insights.openPRs > 0 || insights.closedPRs > 0) ? (
                <ReactECharts option={pullRequestsChartOption} style={{ height: '100%', width: '100%' }} />
              ) : (
                <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No pull request data available</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recommendations Section */}
          <Card className="p-8 bg-background/70 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Recommendations</h3>
            <div className="space-y-4">
              {repoHealth < 50 && (
                <p className="text-red-500">
                  ⚠️ This repository appears to have low activity. Consider increasing communication frequency, addressing open issues, and encouraging new contributors.
                </p>
              )}
              
              {insights && Number(insights.prFrequency) > 14 && (
                <p>
                  🔍 Pull request frequency is low. Consider implementing smaller, more frequent changes rather than large batches.
                </p>
              )}
              
              {insights && Number(insights.avgResolutionTime) > 30 && (
                <p>
                  ⏱️ Issues take a long time to resolve. Consider reviewing your issue triage process and making issue resolution a higher priority.
                </p>
              )}
              
              {insights && insights.topContributors.length < 3 && (
                <p>
                  👥 The repository has few active contributors. Consider reaching out to the community and encouraging more participation.
                </p>
              )}
              
              {repoHealth >= 50 && repoHealth < 80 && (
                <p>
                  📈 This repository is in good health, but there&apos;s room for improvement. Focus on maintaining consistent contribution patterns.
                </p>
              )}
              
              {repoHealth >= 80 && (
                <p className="text-green-500">
                  🌟 This repository is in excellent health! Keep up the good work with regular updates and active community management.
                </p>
              )}
            </div>
          </Card>
        </div>
      </BackgroundBeamsWithCollision>
    </main>
  );
}
