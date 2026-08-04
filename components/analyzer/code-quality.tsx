"use client";

interface CodeQualityScore {
  overall: number;
  maintainability: number;
  readability: number;
  security: number;
  performance: number;
  bestPractices: number;
}

interface CodeQualityProps {
  score: CodeQualityScore | null;
}

export default function CodeQuality({ score }: CodeQualityProps) {
  // While AI hasn't returned data yet, show a neutral empty state
  // instead of fake numbers.
  if (!score) {
    return (
      <div className="bg-[#1E293B] rounded-2xl border border-slate-700 p-6 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Analyzing code quality...</p>
      </div>
    );
  }

  const scores = [
    { title: "Maintainability", value: score.maintainability },
    { title: "Readability", value: score.readability },
    { title: "Security", value: score.security },
    { title: "Performance", value: score.performance },
    { title: "Best Practices", value: score.bestPractices },
  ];

  return (
    <div className="bg-[#1E293B] rounded-2xl border border-slate-700 p-6">
      <h2 className="text-xl font-bold mb-6">Code Quality Score</h2>

      <div className="flex justify-center mb-8">
        <div className="w-36 h-36 rounded-full border-[12px] border-violet-500 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">{score.overall}</h1>
            <p className="text-slate-400">/100</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {scores.map((item) => (
          <div key={item.title}>
            <div className="flex justify-between mb-2">
              <span>{item.title}</span>
              <span>{item.value}%</span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-violet-500 h-2 rounded-full"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
