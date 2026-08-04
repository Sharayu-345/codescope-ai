"use client";

import {
  Bot,
  Send,
  Link2,
  Loader2,
  BookOpen,
  Cpu,
  Star,
  TriangleAlert,
  Globe,
  Rocket,
  Briefcase,
  Shield,
  CheckCircle2,
} from "lucide-react";

import QuestionCard from "@/components/question-card";
import AuthGuard from "@/components/auth-guard";
import { useState } from "react";

interface CoachResponse {
  score: number;
  answer: string;
  improvements: string[];
  recommendation: string;
}

export default function AICoachPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [repoMeta, setRepoMeta] = useState("");

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState<CoachResponse>({
    score: 0,
    answer: "",
    improvements: [],
    recommendation: "",
  });

  // Fetches repo data for the pasted URL and stores it the same way
  // the rest of the app expects (localStorage keys used by askAI below).
  const loadRepo = async () => {
    if (!repoUrl.trim()) return;

    try {
      setRepoLoading(true);

      const res = await fetch("/api/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("repoData", JSON.stringify(data.repoData || {}));
        localStorage.setItem(
          "languageData",
          JSON.stringify(data.languageData || {})
        );
        localStorage.setItem(
          "contributors",
          JSON.stringify(data.contributors || [])
        );
        localStorage.setItem("readme", data.readme || "");

        setRepoName(data.repoData?.name || repoUrl.trim());
        setRepoMeta(
          (data.languageData ? Object.keys(data.languageData).join(" • ") : "") ||
            ""
        );

        // reset previous answers for the newly loaded repo
        setResponse({ score: 0, answer: "", improvements: [], recommendation: "" });
      } else {
        alert(data.message || "Could not load that repository.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load repository.");
    } finally {
      setRepoLoading(false);
    }
  };

  const askAI = async (customQuestion?: string) => {
    try {
      setLoading(true);

      const res = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: customQuestion || question,

          repoData: JSON.parse(localStorage.getItem("repoData") || "{}"),

          languageData: JSON.parse(
            localStorage.getItem("languageData") || "{}"
          ),

          contributors: JSON.parse(
            localStorage.getItem("contributors") || "[]"
          ),

          readme: localStorage.getItem("readme") || "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.data);
        saveAnalysis(data.data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("AI Coach failed.");
    } finally {
      setLoading(false);
    }
  };

  // Persists the analysis so it shows up on the Dashboard.
  const saveAnalysis = async (coachData: CoachResponse) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return; // not logged in, skip silently

      const user = JSON.parse(storedUser);
      const storedRepoData = JSON.parse(localStorage.getItem("repoData") || "{}");
      const storedLanguageData = JSON.parse(
        localStorage.getItem("languageData") || "{}"
      );

      if (!storedRepoData?.name) return; // no repo loaded yet

      await fetch("/api/analysis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          repoUrl: storedRepoData.url || repoUrl,
          repoName: storedRepoData.name,
          techStack: Object.keys(storedLanguageData).join(" + "),
          score: coachData.score,
          improvements: coachData.improvements,
          recommendation: coachData.recommendation,
        }),
      });
    } catch (err) {
      console.error("Failed to save analysis:", err);
    }
  };

  return (
    <AuthGuard>
    <div className="space-y-8">
      {/* Heading */}

      <div>
        <h1 className="text-4xl font-bold text-white">AI Coach</h1>

        <p className="text-slate-400 mt-2">
          Your personal AI mentor for understanding and improving your GitHub
          repository.
        </p>
      </div>

      {/* Repository URL input */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Link2 size={20} />
          Repository URL
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadRepo()}
            placeholder="https://github.com/username/repository"
            className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <button
            onClick={loadRepo}
            disabled={repoLoading || !repoUrl.trim()}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white transition disabled:opacity-50 whitespace-nowrap"
          >
            {repoLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Link2 size={18} />
            )}
            {repoLoading ? "Loading..." : "Load Repository"}
          </button>
        </div>
      </div>

      {/* Repository summary */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {repoName || "No repository loaded"}
          </h2>

          <p className="text-slate-400 mt-2">
            {repoMeta || "Paste a repository URL above to get started."}
          </p>
        </div>

        <div className="text-right">
          <p className="text-slate-400">AI Score</p>

          <h2 className="text-3xl font-bold text-indigo-400">
            {response.score || "--"} / 10
          </h2>
        </div>
      </div>

      {/* Ask AI — primary, larger box */}

      <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-5">
          <Bot size={22} />
          Ask AI About Your Repository
        </h2>

        <textarea
          rows={8}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about this repository..."
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-4 text-white text-base outline-none resize-none focus:border-indigo-500"
        />

        <button
          onClick={() => askAI()}
          disabled={loading || !question.trim()}
          className="mt-5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl text-white transition disabled:opacity-50"
        >
          <Send size={18} />
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {/* AI Response */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-5">AI Response</h2>

        <p className="text-slate-300 leading-8">
          {loading
            ? "AI is thinking..."
            : response.answer || "Ask AI about your repository."}
        </p>

        {response.improvements?.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {response.improvements.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="text-green-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        )}

        <p className="text-white/90 leading-7 mt-6">
          {loading
            ? "Generating recommendation..."
            : response.recommendation || "Ask AI to receive recommendations."}
        </p>
      </div>

      {/* Quick Questions */}

      <div>
        <h2 className="text-2xl font-bold text-white mb-5">
          Quick Questions
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <QuestionCard
            icon={<BookOpen />}
            title="Explain Repository"
            onClick={() => askAI("Explain what this repository does.")}
          />
          <QuestionCard
            icon={<Cpu />}
            title="Tech Stack"
            onClick={() => askAI("What tech stack does this repository use?")}
          />
          <QuestionCard
            icon={<Star />}
            title="Why is this Project Good?"
            onClick={() => askAI("Why is this project good?")}
          />
          <QuestionCard
            icon={<TriangleAlert />}
            title="What Should Improve?"
            onClick={() => askAI("What should improve in this repository?")}
          />
          <QuestionCard
            icon={<Globe />}
            title="Real-world Applications"
            onClick={() =>
              askAI("What are real-world applications of this repository?")
            }
          />
          <QuestionCard
            icon={<Rocket />}
            title="Next Features"
            onClick={() => askAI("What features should be built next?")}
          />
          <QuestionCard
            icon={<Briefcase />}
            title="Interview Questions"
            onClick={() =>
              askAI("Give me interview questions based on this repository.")
            }
          />
          <QuestionCard
            icon={<Shield />}
            title="Security Review"
            onClick={() => askAI("Do a security review of this repository.")}
          />
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}