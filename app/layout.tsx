import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "CodeScope AI",
  description: "AI-Powered Developer Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <div className="flex">
          <Sidebar />

          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}