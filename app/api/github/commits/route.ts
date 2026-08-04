import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();

    const match = repoUrl.match(
      /github\.com\/([^/]+)\/([^/]+)/
    );

    if (!match) {
      return NextResponse.json(
        { message: "Invalid Repository URL" },
        { status: 400 }
      );
    }

    const owner = match[1];
    const repo = match[2].replace(".git", "");

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    const commits = await response.json();

    return NextResponse.json(commits);

  } catch (error) {
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}