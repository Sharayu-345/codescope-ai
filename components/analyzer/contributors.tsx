"use client";

import { Trophy, ExternalLink } from "lucide-react";

interface ContributorsProps {
  contributors: any[];
}

export default function Contributors({
  contributors,
}: ContributorsProps) {
  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-lg">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Top Contributors
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Developers contributing the most to this repository
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
          <Trophy className="text-yellow-400" size={26} />
        </div>

      </div>

      {contributors.length === 0 ? (

        <div className="text-center py-12 text-slate-400">
          No contributors found.
        </div>

      ) : (

        <div className="space-y-4">

          {contributors.slice(0, 5).map((user, index) => (

            <div
              key={user.id}
              className="group flex items-center justify-between bg-[#0F172A] border border-slate-700 rounded-xl p-5 hover:border-violet-500 hover:bg-gradient-to-r hover:from-[#0F172A] hover:to-[#1E1B4B] transition-all duration-300 hover:scale-[1.02]"
            >

              {/* Left */}

              <div className="flex items-center gap-4">

                {/* Rank */}

                <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center shadow-md">
                  #{index + 1}
                </div>

                {/* Avatar */}

                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-14 h-14 rounded-full ring-2 ring-violet-500 object-cover"
                />

                {/* Info */}

                <div>

                  <h3 className="font-semibold text-lg text-white">
                    {user.login}
                  </h3>

                  <p className="text-sm text-slate-400">
                    GitHub Contributor
                  </p>

                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-violet-400 hover:text-violet-300 transition text-sm"
                  >
                    <ExternalLink size={15} />
                    View GitHub Profile
                  </a>

                </div>

              </div>

              {/* Right */}

              <div className="text-right">

                <div className="inline-flex px-4 py-2 rounded-full bg-violet-600/20 text-violet-300 font-bold text-lg">
                  {user.contributions}
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Contributions
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}