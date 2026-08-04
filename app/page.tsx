import Link from "next/link";
import { GitBranch, Network, ShieldCheck, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-violet-600 rounded-lg p-2">
            <GitBranch size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold">
            CodeScope <span className="text-violet-400">AI</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold">
          Understand any GitHub repo in seconds
        </h1>
        <p className="text-slate-400 mt-3 leading-7">
          AI-powered architecture detection, security analysis, and code
          quality insights — before you write a single line.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="bg-violet-600 hover:bg-violet-700 px-8 py-3 rounded-xl font-semibold transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-3 rounded-xl font-semibold transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Feature strip */}
        <div className="grid grid-cols-3 gap-4 mt-12 text-left">
          <FeatureChip
            icon={<Network size={18} className="text-violet-400" />}
            text="Architecture Detection"
          />
          <FeatureChip
            icon={<ShieldCheck size={18} className="text-green-400" />}
            text="Security Analysis"
          />
          <FeatureChip
            icon={<Sparkles size={18} className="text-yellow-400" />}
            text="AI Suggestions"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-xl p-4 flex flex-col items-center gap-2 text-center">
      {icon}
      <span className="text-xs text-slate-300">{text}</span>
    </div>
  );
}
