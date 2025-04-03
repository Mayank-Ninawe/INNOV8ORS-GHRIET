"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CalendarClock,
  TrendingUp,
  BarChart2,
  Sparkles,
  ActivityIcon,
  GithubIcon,
  GitCommit,
  GitPullRequest,
  Users,
  AlarmClock,
  Calendar,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Types for prediction data
interface PredictionData {
  activityForecast: {
    month: string;
    actual: number | null;
    predicted: number;
  }[];
  milestones: {
    title: string;
    description: string;
    estimatedDate: string;
    confidence: number;
  }[];
  engagementForecast: {
    month: string;
    commits: number;
    pulls: number;
    issues: number;
    contributors: number;
  }[];
  regressionStats: {
    r2Score: number;
    meanError: number;
    slope: number;
  };
}

export default function PredictionsPage() {
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner") || "facebook";
  const repo = searchParams.get("repo") || "react";
  
  const [loading, setLoading] = useState(true);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [forecastRange, setForecastRange] = useState(6); // Default 6 months
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    setTimeout(() => {
      setPredictionData(generateMockData());
      setLoading(false);
    }, 1500);
  }, [owner, repo]);

  const handleRangeChange = (value: number[]) => {
    setForecastRange(value[0]);
  };

  const generateMockData = (): PredictionData => {
    // This function generates mock data for the example
    // In a real app, this would come from GitHub API + ML predictions
    
    const activityForecast = [
      { month: "Jan", actual: 145, predicted: 140 },
      { month: "Feb", actual: 132, predicted: 138 },
      { month: "Mar", actual: 151, predicted: 145 },
      { month: "Apr", actual: 160, predicted: 155 },
      { month: "May", actual: 178, predicted: 165 },
      { month: "Jun", actual: 172, predicted: 180 },
      { month: "Jul", actual: null, predicted: 190 },
      { month: "Aug", actual: null, predicted: 205 },
      { month: "Sep", actual: null, predicted: 215 },
      { month: "Oct", actual: null, predicted: 222 },
      { month: "Nov", actual: null, predicted: 235 },
      { month: "Dec", actual: null, predicted: 250 },
    ];

    const milestones = [
      {
        title: "Major Version Release",
        description: "Based on commit patterns, a major version release is likely",
        estimatedDate: "August 15, 2023",
        confidence: 0.87,
      },
      {
        title: "Feature Development Spike",
        description: "Expected surge in new feature development",
        estimatedDate: "September 10, 2023",
        confidence: 0.75,
      },
      {
        title: "Community Contribution Peak",
        description: "Predicted increase in external contributions",
        estimatedDate: "October 5, 2023",
        confidence: 0.68,
      },
    ];

    const engagementForecast = [
      { month: "Jul", commits: 190, pulls: 45, issues: 65, contributors: 12 },
      { month: "Aug", commits: 205, pulls: 52, issues: 70, contributors: 15 },
      { month: "Sep", commits: 215, pulls: 58, issues: 75, contributors: 18 },
      { month: "Oct", commits: 222, pulls: 63, issues: 80, contributors: 22 },
      { month: "Nov", commits: 235, pulls: 68, issues: 85, contributors: 25 },
      { month: "Dec", commits: 250, pulls: 75, issues: 90, contributors: 28 },
    ];

    return {
      activityForecast,
      milestones,
      engagementForecast,
      regressionStats: {
        r2Score: 0.86,
        meanError: 8.2,
        slope: 10.4,
      },
    };
  };

  // Helper function to filter forecast data based on selected time range
  const getFilteredForecastData = () => {
    if (!predictionData) return [];
    
    // Get last 6 months of actual data and N months of forecast based on range
    const actualData = predictionData.activityForecast.filter(d => d.actual !== null);
    const lastSixMonthsActual = actualData.slice(-6);
    
    const predictedData = predictionData.activityForecast.filter(d => d.actual === null);
    const forecastData = predictedData.slice(0, forecastRange);
    
    return [...lastSixMonthsActual, ...forecastData];
  };

  // Helper function to filter engagement forecast based on selected time range
  const getFilteredEngagementData = () => {
    if (!predictionData) return [];
    return predictionData.engagementForecast.slice(0, forecastRange);
  };

  // Formatting confidence percentage
  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Analyzing repository patterns...</h2>
        <p className="text-muted-foreground mt-2">
          Calculating predictions and forecasting future trends
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
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-heading font-bold flex items-center">
            A Glimpse into the Future 
            <Sparkles className="h-6 w-6 text-amber-400 ml-2" />
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Predicting future activity for <span className="font-semibold">{owner}/{repo}</span>
        </p>
        
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <span className="font-medium">Forecast range:</span>
          </div>
          <div className="w-full md:w-80 flex items-center gap-4">
            <Slider
              defaultValue={[6]}
              max={12}
              min={3}
              step={1}
              value={[forecastRange]}
              onValueChange={handleRangeChange}
              className="flex-grow"
            />
            <span className="w-16 text-center font-medium">
              {forecastRange} months
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Activity Forecast Graph */}
        <Card className="p-6 shadow-md lg:col-span-2">
          <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Future Activity Graph
          </h2>
          
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getFilteredForecastData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    borderRadius: '8px',
                    border: '1px solid #eee' 
                  }} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Actual Commits"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Commits"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mt-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span>Actual commit activity (historical data)</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>Predicted commit activity (linear regression model)</span>
            </div>
          </div>
          {predictionData && (
            <div className="mt-4 text-sm p-3 bg-muted rounded-md">
              <div className="font-medium mb-1">Model Statistics:</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-muted-foreground">R² Score: </span>
                  <span className="font-medium">{predictionData.regressionStats.r2Score.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mean Error: </span>
                  <span className="font-medium">±{predictionData.regressionStats.meanError.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Growth Rate: </span>
                  <span className="font-medium">{predictionData.regressionStats.slope.toFixed(1)}/month</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Predictive Timeline */}
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Predictive Timeline
          </h2>
          
          {predictionData && (
            <div className="space-y-6">
              {predictionData.milestones.map((milestone, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlarmClock className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">{milestone.title}</h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {milestone.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Estimated: </span>
                      <span className="font-medium">{milestone.estimatedDate}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Confidence: </span>
                      <span className="font-medium">{formatConfidence(milestone.confidence)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${milestone.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Engagement Forecast */}
      <div className="mb-12">
        <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-2">
          <ActivityIcon className="h-6 w-6 text-primary" />
          Engagement Forecast
        </h2>
        
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="chart">
              <BarChart2 className="h-4 w-4 mr-2" />
              Visual Chart
            </TabsTrigger>
            <TabsTrigger value="breakdown">
              <GitCommit className="h-4 w-4 mr-2" />
              Detailed Breakdown
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <Card className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getFilteredEngagementData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderRadius: '8px',
                        border: '1px solid #eee' 
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="commits" 
                      stackId="1" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pulls" 
                      stackId="2" 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="issues" 
                      stackId="3" 
                      stroke="#ffc658" 
                      fill="#ffc658" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="contributors" 
                      stackId="4" 
                      stroke="#ff8042" 
                      fill="#ff8042" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="breakdown">
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Month</th>
                      <th className="text-center py-3 px-4">
                        <div className="flex justify-center items-center gap-1">
                          <GitCommit className="h-4 w-4" />
                          <span>Commits</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="flex justify-center items-center gap-1">
                          <GitPullRequest className="h-4 w-4" />
                          <span>Pull Requests</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="flex justify-center items-center gap-1">
                          <ActivityIcon className="h-4 w-4" />
                          <span>Issues</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="flex justify-center items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Contributors</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredEngagementData().map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 px-4 font-medium">{item.month}</td>
                        <td className="py-3 px-4 text-center">{item.commits}</td>
                        <td className="py-3 px-4 text-center">{item.pulls}</td>
                        <td className="py-3 px-4 text-center">{item.issues}</td>
                        <td className="py-3 px-4 text-center">{item.contributors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Prediction details */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
            <GithubIcon className="h-5 w-5" />
            About these predictions
          </h2>
        </div>
        
        <p className="text-muted-foreground mb-4">
          These predictions are created using linear regression models trained on historical repository data.
          The model analyzes patterns in commit frequency, contributor activity, and issue/PR resolution rates
          to provide forecasts of future repository activity.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">Limitations</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Based on historical patterns only</li>
              <li>Cannot predict unexpected events</li>
              <li>Accuracy decreases with longer forecasts</li>
            </ul>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">Methodology</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Linear regression on time series data</li>
              <li>Pattern recognition in commit history</li>
              <li>Contributor behavior analysis</li>
            </ul>
          </div>
          
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-medium mb-2">Refresh cycle</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Predictions updated weekly</li>
              <li>Model retrained monthly</li>
              <li>Historical data from last 12 months</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 