"use client";

import { useState } from "react";

interface Props {
  slug: string;
  title: string;
  issueNum: number;
}

type Status = "idle" | "confirming" | "sending" | "sent" | "error";

export default function SendIssueButton({ slug, title, issueNum }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ sent?: number; error?: string }>({});

  async function handleSend() {
    setStatus("sending");
    try {
      const res = await fetch("/api/send-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ sent: data.sent });
        setStatus("sent");
      } else {
        setResult({ error: data.error });
        setStatus("error");
      }
    } catch {
      setResult({ error: "Network error." });
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
        <span>✓</span> Sent to {result.sent} subscriber{result.sent !== 1 ? "s" : ""}
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-red-500">
        <span>✗ {result.error}</span>
        <button
          onClick={() => setStatus("idle")}
          className="underline underline-offset-2 text-zinc-500 hover:text-zinc-900"
        >
          Retry
        </button>
      </span>
    );
  }

  if (status === "confirming") {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="text-zinc-600">Send <strong>&ldquo;{title}&rdquo;</strong> to all subscribers?</span>
        <button
          onClick={handleSend}
          className="bg-zinc-900 hover:bg-zinc-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition-colors"
        >
          Yes, send it
        </button>
        <button
          onClick={() => setStatus("idle")}
          className="text-zinc-400 hover:text-zinc-700 text-xs transition-colors"
        >
          Cancel
        </button>
      </span>
    );
  }

  if (status === "sending") {
    return (
      <span className="text-sm text-zinc-400 font-mono animate-pulse">
        Sending to subscribers...
      </span>
    );
  }

  return (
    <button
      onClick={() => setStatus("confirming")}
      className="inline-flex items-center gap-1.5 text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors duration-150"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
      Send Issue
    </button>
  );
}
