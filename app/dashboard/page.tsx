"use client";

import { useEffect, useState } from "react";

import StatCard from "@/components/stat-card";
import Navbar from "@/components/navbar";
import RepoCard from "@/components/repo-card";
import {
  FolderGit2,
  BarChart3,
  TriangleAlert,
  Award,
} from "lucide-react";

interface DashboardStats {
  totalRepos: number;
  newThisWeek: number;
  averageScore: number;
  totalIssues: number;
  interviewReadyPct: number;
}

interface RecentRepo {
  id: string;
  name: string;
  score: number;
  language: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        const res = await fetch(`/api/dashboard?userId=${user.id}`);
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setRecent(data.recent);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <Navbar />

      {/* Heading */}
      <div>
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>

        <p className="text-slate-400 mt-2">
          Welcome back! Here's an overview of your repositories.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Repositories"
          value={loading ? "--" : String(stats?.totalRepos ?? 0)}
          subtitle={
            loading
              ? ""
              : stats?.newThisWeek
              ? `+${stats.newThisWeek} this week`
              : "No new repos this week"
          }
          icon={FolderGit2}
        />

        <StatCard
          title="Average Score"
          value={loading ? "--" : `${stats?.averageScore ?? 0}/10`}
          subtitle={
            loading
              ? ""
              : (stats?.averageScore ?? 0) >= 8
              ? "Excellent"
              : (stats?.averageScore ?? 0) >= 5
              ? "Good"
              : "Needs Work"
          }
          icon={BarChart3}
        />

        <StatCard
          title="Issues Found"
          value={loading ? "--" : String(stats?.totalIssues ?? 0)}
          subtitle={
            loading
              ? ""
              : (stats?.totalIssues ?? 0) > 0
              ? "Needs Review"
              : "All Clear"
          }
          icon={TriangleAlert}
        />

        <StatCard
          title="Interview Ready"
          value={loading ? "--" : `${stats?.interviewReadyPct ?? 0}%`}
          subtitle={
            loading
              ? ""
              : (stats?.interviewReadyPct ?? 0) >= 70
              ? "Top Performance"
              : "Keep Improving"
          }
          icon={Award}
        />
      </div>

      {/* Recent Repository Analysis */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Repository Analysis</h2>

          <button className="text-violet-400 hover:text-violet-300">
            View All →
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-slate-500">Loading your repositories...</p>
          ) : recent.length === 0 ? (
            <p className="text-slate-500">
              No repositories analyzed yet. Head to AI Coach to analyze your
              first one.
            </p>
          ) : (
            recent.map((repo) => (
              <RepoCard
                key={repo.id}
                name={repo.name}
                score={repo.score}
                language={repo.language}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}