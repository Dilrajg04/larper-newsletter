"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs font-mono px-2.5 py-1 rounded border transition-all duration-150 ${
        copied
          ? "bg-emerald-50 border-emerald-300 text-emerald-600"
          : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-800"
      }`}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
