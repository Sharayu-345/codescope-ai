"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface RepositoryActivityProps {
  commits: any[];
}

interface ChartPoint {
  date: string;
  label: string;
  commits: number;
}

export default function RepositoryActivity({
  commits,
}: RepositoryActivityProps) {
  if (!commits || commits.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Repository Activity</h2>
        <p className="text-slate-400">No commit data available.</p>
      </div>
    );
  }

  // Group commits by calendar day using the real commit date,
  // instead of just plotting row index (which always produced a straight line).
  const countsByDay: Record<string, number> = {};

  commits.forEach((c: any) => {
    const rawDate =
      c?.commit?.author?.date ||
      c?.commit?.committer?.date ||
      c?.commit?.date;

    if (!rawDate) return;

    const dayKey = new Date(rawDate).toISOString().slice(0, 10); // YYYY-MM-DD
    countsByDay[dayKey] = (countsByDay[dayKey] || 0) + 1;
  });

  const sortedDays = Object.keys(countsByDay).sort(); // ascending chronological

  // Show at most the last 14 active days so the chart stays readable.
  const recentDays = sortedDays.slice(-14);

  const chartData: ChartPoint[] = recentDays.map((day) => {
    const d = new Date(day);
    return {
      date: day,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      commits: countsByDay[day],
    };
  });

  const totalCommits = commits.length;
  const peakDay = chartData.reduce(
    (max, p) => (p.commits > max.commits ? p : max),
    chartData[0]
  );

  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Repository Activity</h2>
          <p className="text-sm text-slate-400 mt-1">
            {totalCommits} commits across {sortedDays.length} active day
            {sortedDays.length === 1 ? "" : "s"}
          </p>
        </div>

        {peakDay && (
          <div className="text-right">
            <p className="text-xs text-slate-500">Peak day</p>
            <p className="text-sm font-semibold text-violet-400">
              {peakDay.label} · {peakDay.commits} commits
            </p>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="label"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            allowDecimals={false}
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={28}
          />

          <Tooltip
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#E2E8F0" }}
            formatter={(value: number) => [`${value} commits`, ""]}
          />

          <Area
            type="monotone"
            dataKey="commits"
            stroke="#8B5CF6"
            strokeWidth={2.5}
            fill="url(#commitGradient)"
            dot={{ r: 3, fill: "#8B5CF6", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
