"use client";

import { useState } from "react";

const AMOUNTS = [3, 5, 10, 25];

export default function DonateButton() {
  const [selected, setSelected] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDonate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selected }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not start checkout.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="donate" className="pt-10 pb-10">
      <div className="rounded-2xl p-8 h-full bg-white border-2 border-zinc-900">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
          Keep it going
        </p>
        <h2 className="text-2xl font-black text-zinc-900 mb-3">
          Help keep LARPER free
        </h2>
        <p className="text-zinc-500 text-sm mb-7 leading-relaxed">
          LARPER is written by students, for students. It costs nothing to read
          and never will. If you find it useful, a small contribution keeps it
          running and independent.
        </p>
        <div className="flex gap-2 mb-3">
          {AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => setSelected(amt)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all duration-200 ${
                selected === amt
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "bg-white border-zinc-300 text-zinc-500 hover:border-zinc-700 hover:text-zinc-900"
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>
        <button
          onClick={handleDonate}
          disabled={loading}
          className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:opacity-40 text-white font-black py-3 rounded-lg text-sm transition-colors duration-200"
        >
          {loading ? "Redirecting..." : `Donate $${selected} via Stripe`}
        </button>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <p className="text-zinc-400 text-xs mt-3 text-center">
          One-time. No subscription. No pressure.
        </p>
      </div>
    </section>
  );
}
