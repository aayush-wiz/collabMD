import { Octokit } from "@octokit/rest";

const octokit = new Octokit();

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  description: string | null;
  stars: number;
  topics: string[];
  languages: { [key: string]: number };
  defaultBranch: string;
}

export interface GitHubFileContent {
  path: string;
  content: string;
}

export interface RepoStructure {
  tree: string;
  keyFiles: GitHubFileContent[];
}

/**
 * Parse GitHub URL to extract owner and repo name
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  // Handle various GitHub URL formats:
  // - https://github.com/owner/repo
  // - https://github.com/owner/repo.git
  // - https://github.com/owner/repo/
  // - github.com/owner/repo
  // - owner/repo

  let cleanUrl = url.trim();

  // Remove .git suffix if present
  cleanUrl = cleanUrl.replace(/\.git$/, "");

  // Remove trailing slash
  cleanUrl = cleanUrl.replace(/\/$/, "");

  // Remove protocol and github.com if present
  cleanUrl = cleanUrl.replace(/^https?:\/\//, "");
  cleanUrl = cleanUrl.replace(/^github\.com\//, "");

  // Now we should have owner/repo or owner/repo/anything
  const parts = cleanUrl.split("/");

  if (parts.length < 2) {
    throw new Error("Invalid GitHub URL format");
  }

  const owner = parts[0];
  const repo = parts[1];

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL: missing owner or repository name");
  }

  return { owner, repo };
}

/**
 * Fetch repository information from GitHub
 */
export async function getRepositoryInfo(
  owner: string,
  repo: string
): Promise<GitHubRepoInfo> {
  try {
    // Fetch repository data
    const { data: repoData } = await octokit.repos.get({ owner, repo });

    // Fetch languages
    const { data: languagesData } = await octokit.repos.listLanguages({
      owner,
      repo,
    });

    // Fetch topics
    const { data: topicsData } = await octokit.repos.getAllTopics({
      owner,
      repo,
    });

    return {
      owner,
      repo,
      description: repoData.description,
      stars: repoData.stargazers_count,
      topics: topicsData.names || [],
      languages: languagesData,
      defaultBranch: repoData.default_branch,
    };
  } catch (error: any) {
    if (error.status === 404) {
      throw new Error("Repository not found or is private");
    }
    throw new Error(`Failed to fetch repository info: ${error.message}`);
  }
}

/**
 * Fetch file content from GitHub
 */
export async function getFileContents(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<string> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (Array.isArray(data) || data.type !== "file") {
      throw new Error(`${path} is not a file`);
    }

    // Decode base64 content
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return content;
  } catch (error: any) {
    if (error.status === 404) {
      return ""; // File not found, return empty string
    }
    throw new Error(`Failed to fetch file ${path}: ${error.message}`);
  }
}

/**
 * Build a tree structure representation of the repository
 */
async function buildTreeStructure(
  owner: string,
  repo: string,
  branch: string
): Promise<string> {
  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "1",
    });

    // Filter out large trees and limit to reasonable size
    const items = data.tree.slice(0, 200); // Limit to 200 items

    // Build tree string
    const treeLines: string[] = [];
    items.forEach((item) => {
      const type = item.type === "tree" ? "📁" : "📄";
      treeLines.push(`${type} ${item.path}`);
    });

    return treeLines.join("\n");
  } catch (error: any) {
    return "Unable to fetch repository structure";
  }
}

/**
 * Identify and fetch key files from the repository
 */
async function fetchKeyFiles(
  owner: string,
  repo: string,
  branch: string
): Promise<GitHubFileContent[]> {
  // Priority files to fetch
  const priorityFiles = [
    "README.md",
    "readme.md",
    "package.json",
    "requirements.txt",
    "setup.py",
    "Cargo.toml",
    "go.mod",
    "pom.xml",
    "build.gradle",
    "composer.json",
    "Gemfile",
    "Makefile",
    ".env.example",
    "docker-compose.yml",
    "Dockerfile",
  ];

  const keyFiles: GitHubFileContent[] = [];

  // Fetch priority files
  for (const filePath of priorityFiles) {
    try {
      const content = await getFileContents(owner, repo, filePath, branch);
      if (content) {
        // Limit file size to prevent token overflow
        const truncatedContent =
          content.length > 5000
            ? content.substring(0, 5000) + "\n...[truncated]"
            : content;
        keyFiles.push({ path: filePath, content: truncatedContent });
      }
    } catch (error) {
      // Skip files that don't exist or can't be fetched
      continue;
    }

    // Stop if we have enough files
    if (keyFiles.length >= 10) break;
  }

  return keyFiles;
}

/**
 * Get repository structure including tree and key files
 */
export async function getRepositoryStructure(
  owner: string,
  repo: string,
  branch: string
): Promise<RepoStructure> {
  try {
    const [tree, keyFiles] = await Promise.all([
      buildTreeStructure(owner, repo, branch),
      fetchKeyFiles(owner, repo, branch),
    ]);

    return {
      tree,
      keyFiles,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch repository structure: ${error.message}`);
  }
}
