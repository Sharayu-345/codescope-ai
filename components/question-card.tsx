import { ReactNode } from "react";

interface QuestionCardProps {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
}

export default function QuestionCard({
  icon,
  title,
  onClick,
}: QuestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="
      flex items-center gap-3
      w-full
      p-4
      rounded-xl
      bg-slate-900
      border border-slate-800
      hover:border-indigo-500
      hover:bg-slate-800
      transition-all
      "
    >
      <div className="text-indigo-400">
        {icon}
      </div>

      <span className="text-white font-medium">
        {title}
      </span>
    </button>
  );
}
