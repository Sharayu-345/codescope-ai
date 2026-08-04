import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import RepoAnalysis from "@/models/RepoAnalysis";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required." },
        { status: 400 }
      );
    }

    const analyses = await RepoAnalysis.find({ userId }).sort({
      createdAt: -1,
    });

    const totalRepos = analyses.length;

    const averageScore = totalRepos
      ? analyses.reduce((sum, a) => sum + (a.score || 0), 0) / totalRepos
      : 0;

    const totalIssues = analyses.reduce(
      (sum, a) => sum + (a.issuesFound || 0),
      0
    );

    const interviewReadyCount = analyses.filter((a) => a.interviewReady).length;
    const interviewReadyPct = totalRepos
      ? Math.round((interviewReadyCount / totalRepos) * 100)
      : 0;

    // "+N this week" for the Repositories card
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = analyses.filter(
      (a) => new Date(a.createdAt) >= oneWeekAgo
    ).length;

    const recent = analyses.slice(0, 5).map((a) => ({
      id: a._id,
      name: a.repoName,
      score: a.score,
      language: a.techStack,
      createdAt: a.createdAt,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRepos,
        newThisWeek,
        averageScore: Math.round(averageScore * 10) / 10,
        totalIssues,
        interviewReadyPct,
      },
      recent,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard." },
      { status: 500 }
    );
  }
}