"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BrainCircuit,
  GraduationCap,
  User,
  FileText,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "AI Analyzer",
    href: "/analyzer",
    icon: BrainCircuit,
  },
  {
    title: "AI Coach",
    href: "/coach",
    icon: GraduationCap,
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        CodeScope <span className="text-violet-500">AI</span>
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                pathname === item.href
                  ? "bg-violet-600"
                  : "hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}