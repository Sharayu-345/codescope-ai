import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6 shadow-lg hover:border-violet-500 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h2 className="text-3xl font-bold mt-2 text-white">
            {value}
          </h2>

          <p className="text-sm text-violet-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="h-14 w-14 rounded-xl bg-violet-600/20 flex items-center justify-center">
          <Icon className="text-violet-400" size={28} />
        </div>
      </div>
    </div>
  );
}