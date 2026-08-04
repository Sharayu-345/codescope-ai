import { NextRequest, NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

interface RepoRequestBody {
  url: string;
}

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
    const u = new URL(cleaned);

    if (!u.hostname.includes("github.com")) return null;

    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const [owner, repo] = parts;
    return { owner, repo };
  } catch {
    return null;
  }
}

function githubHeaders() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Optional but recommended — raises the rate limit from 60/hr to 5000/hr.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

export async function POST(req: NextRequest) {
  try {
    const body: RepoRequestBody = await req.json();
    const parsed = parseGithubUrl(body.url || "");

    if (!parsed) {
      return NextResponse.json(
        { success: false, message: "Enter a valid GitHub repository URL." },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;
    const headers = githubHeaders();

    const [repoRes, languagesRes, contributorsRes] = await Promise.all([
      fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers }),
      fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, { headers }),
      fetch(`${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=10`, {
        headers,
      }),
    ]);

    if (repoRes.status === 404) {
      return NextResponse.json(
        { success: false, message: "Repository not found." },
        { status: 404 }
      );
    }

    if (!repoRes.ok) {
      const errText = await repoRes.text();
      console.error("GitHub repo fetch error:", errText);
      return NextResponse.json(
        { success: false, message: "Failed to fetch repository from GitHub." },
        { status: 502 }
      );
    }

    const repoJson = await repoRes.json();
    const languageData = languagesRes.ok ? await languagesRes.json() : {};
    const contributorsJson = contributorsRes.ok ? await contributorsRes.json() : [];

    // README — try the default branch, fall back gracefully.
    let readme = "";
    try {
      const readmeRes = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/readme`,
        { headers: { ...headers, Accept: "application/vnd.github.raw+json" } }
      );
      if (readmeRes.ok) {
        readme = await readmeRes.text();
      }
    } catch {
      // README is optional — repo data still returns without it.
    }

    const repoData = {
      name: repoJson.full_name,
      description: repoJson.description,
      stars: repoJson.stargazers_count,
      forks: repoJson.forks_count,
      openIssues: repoJson.open_issues_count,
      defaultBranch: repoJson.default_branch,
      url: repoJson.html_url,
      createdAt: repoJson.created_at,
      updatedAt: repoJson.updated_at,
      license: repoJson.license?.name || null,
    };

    const contributors = Array.isArray(contributorsJson)
      ? contributorsJson.map((c: any) => ({
          login: c.login,
          contributions: c.contributions,
          avatarUrl: c.avatar_url,
        }))
      : [];

    return NextResponse.json({
      success: true,
      repoData,
      languageData,
      contributors,
      readme,
    });
  } catch (err) {
    console.error("Repo fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load repository." },
      { status: 500 }
    );
  }
}