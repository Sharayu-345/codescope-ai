"use client";

import { useState } from "react";
import { GitBranch } from "lucide-react";

interface RepoInputProps {
  onAnalyze: (repoUrl: string) => void | Promise<void>;
}

export default function RepoInput({
  onAnalyze,
}: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");

  const handleClick = () => {
    if (!repoUrl.trim()) {
      alert("Please enter a GitHub Repository URL.");
      return;
    }

    onAnalyze(repoUrl);
  };

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-8">

      <h2 className="text-2xl font-bold mb-2">
        AI Repository Analyzer
      </h2>

      <p className="text-slate-400 mb-6">
        Analyze GitHub repositories with AI-powered insights.
      </p>

      <label className="block text-sm mb-3 text-slate-300">
        GitHub Repository URL
      </label>

      <div className="flex gap-4">

        <div className="relative flex-1">

          <GitBranch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/user/repository"
            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-violet-500"
          />

        </div>

        <button
          onClick={handleClick}
          className="bg-violet-600 hover:bg-violet-700 px-8 rounded-xl font-semibold transition"
        >
          Analyze Repository
        </button>

      </div>

    </div>
  );
}