"use client";

import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

interface AnalysisResultProps {
  analysis: {
    architecture: string[];
    codeQuality: string[];
    suggestions: string[];
    interviewQuestions: string[];
  } | null;
}

export default function AnalysisResult({
  analysis,
}: AnalysisResultProps) {
  if (!analysis) return null;

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 space-y-6">

      <div>
        <h2 className="text-xl font-semibold">
          AI Code Analysis Result
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          AI generated insights based on repository analysis
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">

        <AnalysisCard
          title="Architecture"
          icon={<CheckCircle2 className="text-green-400" />}
          points={analysis.architecture}
        />

        <AnalysisCard
          title="Code Quality"
          icon={<AlertTriangle className="text-yellow-400" />}
          points={analysis.codeQuality}
        />

        <AnalysisCard
          title="AI Suggestions"
          icon={<Lightbulb className="text-violet-400" />}
          points={analysis.suggestions}
        />

      </div>

      <div className="bg-[#0F172A] rounded-xl p-5">

        <h3 className="font-semibold mb-3">
          Interview Readiness Suggestions
        </h3>

        <ul className="space-y-2 text-sm text-slate-300">

          {analysis.interviewQuestions.map((item) => (
            <li key={item}>
              • {item}
            </li>
          ))}

        </ul>

      </div>

    </div>
  );
}

function AnalysisCard({
  title,
  icon,
  points,
}: {
  title: string;
  icon: React.ReactNode;
  points: string[];
}) {
  return (
    <div className="bg-[#0F172A] rounded-xl p-5">

      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>

      <ul className="space-y-2 text-sm text-slate-300">

        {points.map((item) => (
          <li key={item}>
            • {item}
          </li>
        ))}

      </ul>

    </div>
  );
}
