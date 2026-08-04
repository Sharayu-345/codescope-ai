"use client";

import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  Database,
} from "lucide-react";

interface StatsCardsProps {
  data: any;
}

export default function StatsCards({
  data,
}: StatsCardsProps) {

  if (!data) return null;

  const cards = [
    {
      title: "Stars",
      value: data.stargazers_count,
      icon: Star,
    },
    {
      title: "Forks",
      value: data.forks_count,
      icon: GitFork,
    },
    {
      title: "Watchers",
      value: data.watchers_count,
      icon: Eye,
    },
    {
      title: "Open Issues",
      value: data.open_issues_count,
      icon: AlertCircle,
    },
    {
      title: "Repository Size (KB)",
      value: data.size,
      icon: Database,
    },
  ];

  return (
    <div className="grid md:grid-cols-5 gap-6">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="bg-[#1E293B] border border-slate-700 rounded-xl p-6"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-slate-400 text-sm">
                  {card.title}
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {card.value}
                </h2>

              </div>

              <Icon
                className="text-violet-400"
                size={28}
              />

            </div>

          </div>

        );

      })}

    </div>
  );
}