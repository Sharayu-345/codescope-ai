"use client";

import { FolderGit2, ChevronRight } from "lucide-react";

interface RepoCardProps {
  name: string;
  score: number;
  language: string;
}

function scoreColor(score: number) {
  if (score >= 8) return "text-green-400";
  if (score >= 5) return "text-yellow-400";
  return "text-red-400";
}

export default function RepoCard({ name, score, language }: RepoCardProps) {
  return (
    <div className="flex items-center justify-between bg-[#1E293B] border border-slate-700 rounded-xl px-5 py-4 hover:border-violet-500 transition">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-violet-600/20 flex items-center justify-center">
          <FolderGit2 size={20} className="text-violet-400" />
        </div>

        <div>
          <p className="font-semibold text-white">{name}</p>
          <p className="text-sm text-slate-400">{language || "Unknown stack"}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`text-lg font-bold ${scoreColor(score)}`}>
            {score}/10
          </p>
          <p className="text-xs text-slate-500">Score</p>
        </div>

        <ChevronRight size={18} className="text-slate-500" />
      </div>
    </div>
  );
}