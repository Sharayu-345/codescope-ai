import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();

    if (!repoUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Repository URL is required",
        },
        { status: 400 }
      );
    }

    // Extract owner and repository name
    const match = repoUrl.match(
      /github\.com\/([^/]+)\/([^/]+)/
    );

    if (!match) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid GitHub Repository URL",
        },
        { status: 400 }
      );
    }

    const owner = match[1];
    const repo = match[2].replace(".git", "");

    console.log("Owner:", owner);
    console.log("Repository:", repo);

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: process.env.GITHUB_TOKEN
            ? `Bearer ${process.env.GITHUB_TOKEN}`
            : "",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();

      console.log(error);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to fetch contributors",
        },
        { status: response.status }
      );
    }

    const contributors = await response.json();

    return NextResponse.json({
      success: true,
      data: contributors,
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