"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2 } from "lucide-react";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Signup failed.");
        return;
      }

      // Signup succeeded — log them straight in and go to the dashboard.
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        // Backend didn't return a user object — send to login instead.
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Get started with CodeScope AI.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm text-slate-300 mb-2 block">Name</label>
        <div className="relative">
          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-300 mb-2 block">Email</label>
        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-300 mb-2 block">Password</label>
        <div className="relative">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl py-3 transition disabled:opacity-50"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <a href="/login" className="text-violet-400 hover:text-violet-300">
          Log in
        </a>
      </p>
    </form>
  );
}