"use client";

import Link from "next/link";
import { Plus, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex justify-end items-center mb-8">

      <div className="flex items-center gap-4">

        <Link href="/analyzer">
          <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-5 py-3 rounded-xl transition">
            <Plus size={18} />
            Analyze Repo
          </button>
        </Link>

        <Link href="/profile">
          <div className="flex items-center gap-3 bg-[#1E293B] border border-slate-700 rounded-xl px-3 py-2 cursor-pointer hover:border-violet-500 transition">

            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold">
              S
            </div>

            <div>
              <p className="font-medium hover:text-violet-400 transition">
                Shara
              </p>

              <p className="text-xs text-slate-400">
                Computer Engineer
              </p>
            </div>

          </div>
        </Link>

      </div>

    </div>
  );
}