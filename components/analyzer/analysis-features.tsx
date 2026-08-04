"use client";

export default function AnalysisFeatures() {
  return (
    <div className="grid grid-cols-3 gap-6 mt-8">
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700">
        <h3 className="font-semibold text-lg">Code Quality</h3>
        <p className="text-slate-400 mt-2">
          Detect bugs, code smells and maintainability issues.
        </p>
      </div>

      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700">
        <h3 className="font-semibold text-lg">Architecture</h3>
        <p className="text-slate-400 mt-2">
          Analyze project structure and best practices.
        </p>
      </div>

      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700">
        <h3 className="font-semibold text-lg">AI Suggestions</h3>
        <p className="text-slate-400 mt-2">
          Receive improvements powered by Gemini AI.
        </p>
      </div>
    </div>
  );
}