"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed.");
        setPassword("");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="text-center mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-emerald-600 mb-3">
            Admin Access
          </p>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">
            LARPER
          </h1>
          <p className="text-sm text-zinc-500 mt-2">Enter your password to continue.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                autoComplete="current-password"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-zinc-900 placeholder-zinc-400 text-sm focus:outline-none focus:border-zinc-400 transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:opacity-40 text-white font-black py-3 rounded-lg text-sm transition-colors duration-200"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-400 font-mono mt-6">
          ← <a href="/" className="hover:text-zinc-700 transition-colors">Back to LARPER</a>
        </p>
      </div>
    </div>
  );
}
