import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();

    console.log("Repo URL:", repoUrl);

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);

    if (!match) {
      return NextResponse.json(
        { message: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    const owner = match[1];
    const repo = match[2].replace(".git", "").replace("/", "");

    console.log("Owner:", owner);
    console.log("Repo:", repo);

    const githubUrl = `https://api.github.com/repos/${owner}/${repo}`;

    console.log("GitHub URL:", githubUrl);

    const response = await fetch(githubUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    console.log("GitHub Status:", response.status);

    const data = await response.json();

    console.log("GitHub Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          githubStatus: response.status,
          githubResponse: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}