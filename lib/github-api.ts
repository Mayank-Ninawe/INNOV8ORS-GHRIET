import axios from 'axios';

// Base GitHub API URL
const GITHUB_API_BASE_URL = 'https://api.github.com';

// Optional Personal Access Token - you can set this as an environment variable
// This will increase your rate limit
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || '';

// Create axios instance with default configuration
const githubAPI = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: GITHUB_TOKEN ? {
    Authorization: `token ${GITHUB_TOKEN}`
  } : {}
});

// Interface definitions
export interface RepoStats {
  name: string;
  full_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  closed_at: string | null;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  comments: number;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  additions: number;
  deletions: number;
  changed_files: number;
}

/**
 * Format error message for API errors
 */
function formatErrorMessage(error: any): string {
  if (error.response) {
    const status = error.response.status;
    
    // Check for specific status codes
    if (status === 404) {
      return 'Repository not found. Please check the owner and repo name.';
    } else if (status === 403) {
      const rateLimitRemaining = error.response.headers['x-ratelimit-remaining'];
      if (rateLimitRemaining === '0') {
        return 'GitHub API rate limit exceeded. Please try again later.';
      }
      return 'Access forbidden. This repository may be private.';
    } else if (status === 401) {
      return 'Authentication failed. Please check your GitHub token.';
    }
    
    // Get message from response if available
    const message = error.response.data?.message;
    if (message) {
      return `GitHub API error: ${message}`;
    }
    
    return `GitHub API error (${status})`;
  }
  
  if (error.request) {
    return 'No response received from GitHub. Please check your internet connection.';
  }
  
  return error.message || 'An unexpected error occurred';
}

/**
 * Fetch repository statistics
 */
export async function getRepoStats(owner: string, repo: string): Promise<RepoStats> {
  try {
    // Clean up repo name (remove .git if present)
    const cleanRepo = repo.replace(/\.git$/, '');
    
    const response = await githubAPI.get(`/repos/${owner}/${cleanRepo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching repository stats:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Fetch repository contributors
 */
export async function getContributors(owner: string, repo: string): Promise<Contributor[]> {
  try {
    // Clean up repo name
    const cleanRepo = repo.replace(/\.git$/, '');
    
    const response = await githubAPI.get(`/repos/${owner}/${cleanRepo}/contributors`, {
      params: {
        per_page: 100 // Get more contributors
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Fetch repository issues
 */
export async function getIssues(owner: string, repo: string): Promise<Issue[]> {
  try {
    // Clean up repo name
    const cleanRepo = repo.replace(/\.git$/, '');
    
    const response = await githubAPI.get(`/repos/${owner}/${cleanRepo}/issues`, {
      params: {
        state: 'all',
        per_page: 100
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Fetch repository pull requests
 */
export async function getPullRequests(owner: string, repo: string): Promise<PullRequest[]> {
  try {
    // Clean up repo name
    const cleanRepo = repo.replace(/\.git$/, '');
    
    const response = await githubAPI.get(`/repos/${owner}/${cleanRepo}/pulls`, {
      params: {
        state: 'all',
        per_page: 30 // Limiting to 30 to avoid hitting rate limits
      }
    });
    
    // Get basic PR info first, then detailed info only if needed and within rate limits
    const pullRequests = response.data;
    
    // For demo/limited environments, we can use the basic PR info if we don't have detailed stats
    return pullRequests;
  } catch (error) {
    console.error('Error fetching pull requests:', error);
    throw new Error(formatErrorMessage(error));
  }
}

/**
 * Get all repository data in one function
 */
export async function getRepoData(owner: string, repo: string) {
  try {
    // Clean up owner and repo names
    const cleanOwner = owner.trim();
    const cleanRepo = repo.replace(/\.git$/, '').trim();
    
    if (!cleanOwner || !cleanRepo) {
      throw new Error('Repository owner or name is missing');
    }
    
    // Sequential requests to avoid rate limiting issues
    const repoStats = await getRepoStats(cleanOwner, cleanRepo);
    const contributors = await getContributors(cleanOwner, cleanRepo);
    
    // Use a try/catch for issues and PRs to still return partial data if these fail
    let issues: Issue[] = [];
    let pullRequests: PullRequest[] = [];
    
    try {
      issues = await getIssues(cleanOwner, cleanRepo);
    } catch (error) {
      console.warn('Failed to fetch issues, continuing with partial data:', error);
    }
    
    try {
      pullRequests = await getPullRequests(cleanOwner, cleanRepo);
    } catch (error) {
      console.warn('Failed to fetch pull requests, continuing with partial data:', error);
    }
    
    return {
      repoStats,
      contributors,
      issues,
      pullRequests
    };
  } catch (error) {
    console.error('Error fetching repository data:', error);
    throw error;
  }
}
