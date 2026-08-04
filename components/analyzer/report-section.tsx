"use client";

import { FileText } from "lucide-react";
import { generateReport } from "@/lib/generate-report";

interface ReportSectionProps {
  repoData?: any;
  languageData?: any;
  contributors?: any[];
  commitData?: any[];
  analysis?: any;
}

export default function ReportSection({
  repoData,
  languageData,
  contributors,
  commitData,
  analysis,
}: ReportSectionProps) {
  return (
    <div
      onClick={() =>
        generateReport({
          repoData,
          languageData,
          contributors,
          commitData,
          analysis,
        })
      }
      className="mt-8 cursor-pointer rounded-2xl border border-slate-700 bg-[#0F172A] p-10 text-center transition-all duration-300 hover:border-violet-500 hover:bg-[#172036]"
    >
      <FileText className="mx-auto h-14 w-14 text-violet-500 mb-5" />

      <h2 className="text-3xl font-bold text-white">
        Analysis Report
      </h2>

      <p className="mt-4 text-slate-400 text-lg">
        Click anywhere in this box to download the complete AI-generated repository report.
      </p>

      <div className="mt-8 inline-block rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white">
        Click to Download
      </div>
    </div>
  );
}