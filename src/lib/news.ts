export interface HNStory {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  source: "hackernews";
}

export interface GuardianArticle {
  title: string;
  description: string | null;
  url: string;
  section: string;
  publishedAt: string;
  origin: "guardian";
}

// ── HackerNews ────────────────────────────────────────────

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

const AI_TECH_KEYWORDS = [
  "ai", "artificial intelligence", "machine learning", "llm", "gpt", "claude",
  "openai", "anthropic", "google deepmind", "gemini", "mistral", "llama",
  "neural", "deep learning", "model", "chatbot", "agent", "automation",
  "robot", "tech", "startup", "software", "programming", "developer",
  "github", "python", "javascript", "open source", "api", "cloud",
  "data", "chip", "nvidia", "semiconductor", "crypto", "cybersecurity",
];

function isRelevant(title: string): boolean {
  const lower = title.toLowerCase();
  return AI_TECH_KEYWORDS.some((kw) => lower.includes(kw));
}

async function fetchHNItem(id: number): Promise<HNStory | null> {
  try {
    const res = await fetch(`${HN_BASE}/item/${id}.json`, {
      next: { revalidate: 1800 },
    });
    const item = await res.json();
    if (!item || item.type !== "story" || !item.url || !item.title) return null;
    return {
      id: item.id,
      title: item.title,
      url: item.url,
      score: item.score ?? 0,
      by: item.by ?? "unknown",
      time: item.time,
      descendants: item.descendants ?? 0,
      source: "hackernews",
    };
  } catch {
    return null;
  }
}

export async function fetchHNStories(limit = 30): Promise<HNStory[]> {
  const res = await fetch(`${HN_BASE}/topstories.json`, {
    next: { revalidate: 1800 },
  });
  const ids: number[] = await res.json();

  const batch = ids.slice(0, 80);
  const items = await Promise.all(batch.map(fetchHNItem));
  const stories = items.filter((s): s is HNStory => s !== null);
  return stories.filter((s) => isRelevant(s.title)).slice(0, limit);
}

// ── Guardian API ──────────────────────────────────────────

export async function fetchGuardianNews(limit = 20): Promise<GuardianArticle[]> {
  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    q: "artificial intelligence OR machine learning OR OpenAI OR Anthropic OR LLM OR tech",
    section: "technology",
    "show-fields": "trailText",
    "order-by": "newest",
    "page-size": String(limit),
    "api-key": apiKey,
  });

  try {
    const res = await fetch(
      `https://content.guardianapis.com/search?${params}`,
      { next: { revalidate: 1800 } }
    );
    const data = await res.json();
    if (data.response?.status !== "ok") return [];

    return (data.response.results as Array<{
      webTitle: string;
      webUrl: string;
      sectionName: string;
      webPublicationDate: string;
      fields?: { trailText?: string };
    }>).map((a) => ({
      title: a.webTitle,
      description: a.fields?.trailText?.replace(/<[^>]+>/g, "") ?? null,
      url: a.webUrl,
      section: a.sectionName,
      publishedAt: a.webPublicationDate,
      origin: "guardian" as const,
    }));
  } catch {
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────

export function hnDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000) - timestamp;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
