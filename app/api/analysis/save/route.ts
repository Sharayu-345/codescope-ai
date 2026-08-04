import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import RepoAnalysis from "@/models/RepoAnalysis";

const INTERVIEW_READY_THRESHOLD = 8;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      userId,
      repoUrl,
      repoName,
      techStack,
      score,
      improvements,
      recommendation,
    } = await req.json();

    if (!userId || !repoUrl || !repoName) {
      return NextResponse.json(
        { success: false, message: "userId, repoUrl, and repoName are required." },
        { status: 400 }
      );
    }

    const numericScore = typeof score === "number" ? score : 0;
    const issuesFound = Array.isArray(improvements) ? improvements.length : 0;

    const analysis = await RepoAnalysis.create({
      userId,
      repoUrl,
      repoName,
      techStack: techStack || "",
      score: numericScore,
      issuesFound,
      interviewReady: numericScore >= INTERVIEW_READY_THRESHOLD,
      improvements: improvements || [],
      recommendation: recommendation || "",
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Save analysis error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save analysis." },
      { status: 500 }
    );
  }
}