"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface LanguageDistributionProps {
  data: Record<string, number>;
}

// A distinct, high-contrast palette — cycles if there are more languages
// than colors, but most repos have under 8 languages so this rarely repeats.
const PALETTE = [
  "#8B5CF6", // violet
  "#22D3EE", // cyan
  "#F472B6", // pink
  "#FBBF24", // amber
  "#34D399", // emerald
  "#60A5FA", // blue
  "#FB923C", // orange
  "#A78BFA", // light violet
];

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)}MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)}KB`;
  return `${bytes}B`;
}

export default function LanguageDistribution({
  data,
}: LanguageDistributionProps) {
  // Defensive: filter out any non-numeric keys (e.g. a stray "success" field
  // if the raw API response object ever gets passed in instead of just the data).
  const languages = Object.entries(data || {}).filter(
    ([, value]) => typeof value === "number"
  );

  const totalBytes = languages.reduce((sum, [, value]) => sum + value, 0);

  const sorted = [...languages].sort((a, b) => b[1] - a[1]);

  const chartData = sorted.map(([language, bytes], index) => ({
    name: language,
    value: bytes,
    color: PALETTE[index % PALETTE.length],
  }));

  const primary = chartData[0];
  const primaryPct = primary
    ? ((primary.value / totalBytes) * 100).toFixed(0)
    : "0";

  return (
    <div className="bg-[#1E293B] rounded-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Language Distribution</h2>
        {primary && (
          <span className="text-xs text-slate-400">
            {languages.length} language{languages.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {languages.length === 0 ? (
        <p className="text-slate-400">No language data available.</p>
      ) : (
        <div className="flex flex-col items-center gap-6">
          {/* Donut chart with primary-language callout in the center */}
          <div className="relative w-full" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: 8,
                  }}
                  formatter={(value: number, name: string) => [
                    `${((value / totalBytes) * 100).toFixed(1)}% (${formatBytes(
                      value
                    )})`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p
                className="text-2xl font-bold"
                style={{ color: primary?.color }}
              >
                {primaryPct}%
              </p>
              <p className="text-xs text-slate-400 max-w-[90px] text-center truncate">
                {primary?.name}
              </p>
            </div>
          </div>

          {/* Legend — colored dot tells you which slice is which */}
          <div className="w-full space-y-3">
            {chartData.map(({ name, value, color }) => {
              const percentage = ((value / totalBytes) * 100).toFixed(1);

              return (
                <div key={name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-slate-200">{name}</span>
                    </div>
                    <span className="text-slate-400">
                      {percentage}%{" "}
                      <span className="text-slate-600">
                        · {formatBytes(value)}
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
