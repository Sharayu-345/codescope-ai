"use client";

import { useState } from "react";

import RepoInput from "@/components/analyzer/repo-input";
import Contributors from "@/components/analyzer/contributors";
import ReportSection from "@/components/analyzer/report-section";
import StatsCards from "@/components/analyzer/stats-cards";
import LanguageDistribution from "@/components/analyzer/language-distribution";
import CodeQuality from "@/components/analyzer/code-quality";
import RepositoryActivity from "@/components/analyzer/repository-activity";
import AnalysisResult from "@/components/analyzer/analysis-result";
import AuthGuard from "@/components/auth-guard";


export default function AnalyzerPage() {
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commitData, setCommitData] = useState<any[]>([]);
  const [repoData, setRepoData] = useState<any>(null);
  const [languageData, setLanguageData] = useState<any>({});
  const [contributors, setContributors] = useState<any[]>([]);
  const [readme, setReadme] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
const [analysis, setAnalysis] = useState<any>(null);

  // Saves the completed analysis so it shows up on the Dashboard.
  // Normalizes Gemini's shape (codeQualityScore, suggestions, etc.) into
  // the same RepoAnalysis schema the rest of the app uses.
  const saveToDashboard = async (
    repo: any,
    langResult: any,
    aiData: any,
    repoUrl: string
  ) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return; // not logged in, skip silently

      const user = JSON.parse(storedUser);

      // codeQualityScore may come back 0-10 or 0-100 depending on the prompt —
      // normalize to a 0-10 scale either way.
      const rawScore = aiData?.codeQualityScore ?? 0;
      const score = rawScore > 10 ? Math.round(rawScore) / 10 : rawScore;

      const languages =
        langResult?.data && typeof langResult.data === "object"
          ? langResult.data
          : langResult && typeof langResult === "object"
          ? langResult
          : {};

      const techStack = Object.keys(languages)
        .filter((key) => key !== "success" && key !== "message")
        .join(" + ");

      const improvements = Array.isArray(aiData?.suggestions)
        ? aiData.suggestions
        : [];

      await fetch("/api/analysis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          repoUrl,
          repoName: repo?.full_name || repo?.name || repoUrl,
          techStack,
          score,
          improvements,
          recommendation: aiData?.recommendation || "",
        }),
      });
    } catch (err) {
      console.error("Failed to save analysis to dashboard:", err);
    }
  };

  const handleAnalyze = async (repoUrl: string) => {
    try {
      setLoading(true);

      // ===============================
      // Fetch Repository Details
      // ===============================
      const repoRes = await fetch("/api/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      const repoResult = await repoRes.json();

      if (!repoResult.success) {
        alert(repoResult.message);
        return;
      }

      // ===============================
      // Fetch Languages
      // ===============================
      const langRes = await fetch("/api/github/languages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      const langResult = await langRes.json();

      console.log("Repository:", repoResult.data);
      console.log("Languages:", langResult);

      const commitRes = await fetch("/api/github/commits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
        }),
      });
      console.log("Languages API Response:", langResult);
      const commitResult = await commitRes.json();

      console.log(commitResult);

      setCommitData(commitResult);

      // Save Data
      setRepoData(repoResult.data);
localStorage.setItem(
  "repoData",
  JSON.stringify(repoResult.data)
);
      const geminiRes = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repository: repoResult.data,
        }),
      });

      const geminiResult = await geminiRes.json();
      if (geminiResult.success) {
  setAnalysis(geminiResult.data);
}
      if (geminiResult.success) {
        setAiResult(geminiResult.data);
        saveToDashboard(repoResult.data, langResult, geminiResult.data, repoUrl);
      }

      console.log(geminiResult.data);

      console.log("Gemini Result:", geminiResult);
      setLanguageData(langResult);
localStorage.setItem(
  "languageData",
  JSON.stringify(langResult)
);
      // ===============================
      // Fetch Contributors
      // ===============================

      const contributorRes = await fetch("/api/github/contributors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
        }),
      });

      const contributorResult = await contributorRes.json();

      console.log("Contributors:", contributorResult);

      if (contributorResult.success) {
        setContributors(contributorResult.data);
        localStorage.setItem(
  "contributors",
  JSON.stringify(contributorResult.data)
);
      }

      // ===============================
      // Fetch README
      // ===============================

      const readmeRes = await fetch("/api/github/readme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
        }),
      });

      const readmeResult = await readmeRes.json();

      console.log("README:", readmeResult);

      if (readmeResult.success) {
        setReadme(readmeResult.data);
        localStorage.setItem(
  "readme",
  readmeResult.data
);
      }

      // Show Analysis UI
      setAnalyzed(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-8">
        <RepoInput onAnalyze={handleAnalyze} />

        {loading && (
          <div className="text-center text-violet-400 text-lg font-semibold">
            Analyzing Repository...
          </div>
        )}

        {analyzed && (
          <>
            <Contributors contributors={contributors} />

            {/* Next we'll pass repoData here */}
            <StatsCards data={repoData} />

            <div className="grid lg:grid-cols-3 gap-6">
              <LanguageDistribution data={languageData} />

              <CodeQuality score={aiResult?.codeQualityScore ?? null} />

              <RepositoryActivity commits={commitData} />
            </div>

            <AnalysisResult analysis={aiResult} />

            <ReportSection
              repoData={repoData}
              languageData={languageData}
              contributors={contributors}
              commitData={commitData}
              analysis={analysis}
            />
          </>
        )}
      </div>
    </AuthGuard>
  );
}