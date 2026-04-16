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
    <section id="donate" className="border-t border-zinc-200 pt-10 pb-10">
      <p className="text-sm font-mono uppercase tracking-widest text-amber-500 mb-3">
        Keep it going
      </p>
      <h2 className="text-3xl font-black text-zinc-900 mb-3">
        Help keep LARPER free
      </h2>
      <p className="text-zinc-600 text-base mb-7 leading-relaxed">
        LARPER is written by students, for students. It costs nothing to read
        and never will. If you find it useful, even a small contribution keeps
        it running and independent.
      </p>
      <div className="flex gap-2 mb-3">
        {AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => setSelected(amt)}
            className={`flex-1 py-3 rounded-lg text-base font-bold border transition-all duration-200 ${
              selected === amt
                ? "bg-zinc-900 border-zinc-900 text-white"
                : "bg-white border-zinc-300 text-zinc-600 hover:border-zinc-500 hover:text-zinc-900"
            }`}
          >
            ${amt}
          </button>
        ))}
      </div>
      <button
        onClick={handleDonate}
        disabled={loading}
        className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:opacity-40 text-white font-black py-3.5 rounded-lg text-base transition-colors duration-200"
      >
        {loading ? "Redirecting..." : `Donate $${selected} via Stripe`}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <p className="text-zinc-500 text-sm mt-3 text-center">
        One-time. No subscription. No pressure.
      </p>
    </section>
  );
}
