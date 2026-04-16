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
    <section id="subscribe" className="border-t border-zinc-200 pt-10 pb-10">
      <p className="text-sm font-mono uppercase tracking-widest text-emerald-600 mb-3">
        Join the community
      </p>
      <h2 className="text-3xl font-black text-zinc-900 mb-3">
        Stay in the loop, for free
      </h2>
      <p className="text-zinc-600 text-base mb-7 leading-relaxed">
        Every Monday you get one issue: what happened in AI and tech this week,
        explained clearly with zero assumptions about what you already know.
      </p>
      {status === "success" ? (
        <div className="flex items-center gap-2 text-zinc-900 animate-fade-in">
          <span className="text-lg text-emerald-500">✓</span>
          <span className="font-semibold">{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-white border border-zinc-300 rounded-lg px-4 py-3 text-zinc-900 placeholder-zinc-400 text-base focus:outline-none focus:border-zinc-900 transition-colors duration-200"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-zinc-900 hover:bg-zinc-700 disabled:opacity-40 text-white font-bold px-7 py-3 rounded-lg text-base transition-colors duration-200 whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe Free"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-500 text-sm mt-2">{message}</p>
      )}
    </section>
  );
}
