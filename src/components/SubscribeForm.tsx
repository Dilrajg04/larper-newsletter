"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section id="subscribe" className="pt-10 pb-10">
      <div className="rounded-2xl p-8 h-full bg-white border-2 border-emerald-500">
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-600 mb-3">
          Join the community
        </p>
        <h2 className="text-2xl font-black text-emerald-700 mb-3">
          Stay in the loop, for free
        </h2>
        <p className="text-emerald-800/60 text-sm mb-7 leading-relaxed">
          Every Monday you get one issue: what happened in AI and tech this week,
          explained clearly with zero assumptions about what you already know.
        </p>
        {status === "success" ? (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-lg text-emerald-500">✓</span>
            <span className="font-semibold text-emerald-700 text-sm">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-white border border-emerald-300 rounded-lg px-4 py-3 text-zinc-700 placeholder-zinc-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors duration-200"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black px-6 py-3 rounded-lg text-sm transition-colors duration-200 whitespace-nowrap"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe Free"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-500 text-xs mt-2">{message}</p>
        )}
      </div>
    </section>
  );
}
