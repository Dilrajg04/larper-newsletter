import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getIssueBySlug } from "@/lib/issues";

export async function POST(req: NextRequest) {
  const { slug } = await req.json().catch(() => ({}));

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Issue slug required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "LARPER <newsletter@larper.co>";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://larper.co";

  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
  }

  // Load the issue
  let issue;
  try {
    issue = await getIssueBySlug(slug);
  } catch {
    return NextResponse.json({ error: "Issue not found." }, { status: 404 });
  }

  const resend = new Resend(apiKey);

  // Fetch all subscribers from the audience
  const { data: contactsData, error: contactsError } = await resend.contacts.list({ audienceId });
  if (contactsError) {
    return NextResponse.json({ error: "Could not fetch subscribers." }, { status: 500 });
  }

  const subscribers = (contactsData?.data ?? []).filter((c) => !c.unsubscribed);

  if (subscribers.length === 0) {
    return NextResponse.json({ error: "No subscribers to send to." }, { status: 400 });
  }

  const issueUrl = `${baseUrl}/issues/${slug}`;
  const subject = `LARPER #${String(issue.issue).padStart(3, "0")}: ${issue.title}`;
  const html = issueEmail({ issue, issueUrl, baseUrl });

  // Resend batch allows up to 100 emails per call — chunk if needed
  const BATCH_SIZE = 100;
  const chunks: string[][] = [];
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    chunks.push(subscribers.slice(i, i + BATCH_SIZE).map((c) => c.email));
  }

  let sent = 0;
  for (const chunk of chunks) {
    const batch = chunk.map((to) => ({ from: fromEmail, to, subject, html }));
    const { data, error } = await resend.batch.send(batch);
    if (error) {
      console.error("Batch send error:", error);
      return NextResponse.json(
        { error: `Failed after sending ${sent} emails: ${error.message}` },
        { status: 500 }
      );
    }
    sent += data?.data?.length ?? chunk.length;
  }

  return NextResponse.json({ sent, total: subscribers.length });
}

// ── Email template ────────────────────────────────────────

interface Issue {
  issue: number;
  title: string;
  description: string;
  date: string;
  tags: string[];
  buzzword: { term: string; definition: string; examples: string[] };
  contentHtml: string;
}

function issueEmail({ issue, issueUrl, baseUrl }: { issue: Issue; issueUrl: string; baseUrl: string }): string {
  const formatted = new Date(issue.date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });

  const tags = issue.tags.map((t) =>
    `<span style="display:inline-block;background:#f4f4f5;color:#52525b;font-family:monospace;font-size:11px;padding:2px 8px;border-radius:4px;margin:0 4px 4px 0;">${t}</span>`
  ).join("");

  const examples = issue.buzzword.examples.map((ex) =>
    `<p style="margin:0 0 10px;padding-left:12px;border-left:2px solid #fde68a;font-style:italic;color:#52525b;font-size:14px;line-height:1.7;">"${ex}"</p>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${issue.title}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;">
  <tr><td align="center" style="padding:32px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">

      <!-- Header -->
      <tr><td style="padding:28px 36px;border-bottom:1px solid #e4e4e7;background:#ffffff;">
        <a href="${baseUrl}" style="text-decoration:none;">
          <span style="font-size:24px;font-weight:900;letter-spacing:-1px;color:#111111;">LARPER</span>
          <span style="font-size:10px;color:#71717a;font-family:monospace;margin-left:8px;">/AI & TECH FOR STUDENTS</span>
        </a>
      </td></tr>

      <!-- Issue label -->
      <tr><td style="padding:28px 36px 0;">
        <p style="margin:0 0 6px;font-size:11px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#059669;">
          Issue #${String(issue.issue).padStart(3, "0")} · ${formatted}
        </p>
        <h1 style="margin:0 0 14px;font-size:26px;font-weight:900;color:#111111;line-height:1.25;">${issue.title}</h1>
        <p style="margin:0 0 16px;font-size:16px;color:#3f3f46;line-height:1.7;">${issue.description}</p>
        <div style="margin-bottom:24px;">${tags}</div>
      </td></tr>

      <!-- Buzzword spotlight -->
      <tr><td style="padding:0 36px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
          <tr><td style="padding:22px 24px;">
            <p style="margin:0 0 8px;font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#d97706;">🔍 Buzzword Spotlight</p>
            <p style="margin:0 0 10px;font-size:20px;font-weight:900;color:#d97706;line-height:1.2;">${issue.buzzword.term}</p>
            <p style="margin:0 0 16px;font-size:14px;color:#3f3f46;line-height:1.7;">${issue.buzzword.definition}</p>
            <p style="margin:0 0 10px;font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:2px;color:#d97706;">You might hear it like this:</p>
            ${examples}
          </td></tr>
        </table>
      </td></tr>

      <!-- Divider -->
      <tr><td style="padding:0 36px;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 28px;"/></td></tr>

      <!-- Article content -->
      <tr><td style="padding:0 36px 28px;font-size:15px;color:#27272a;line-height:1.8;">
        ${issue.contentHtml}
      </td></tr>

      <!-- CTA -->
      <tr><td style="padding:0 36px 36px;">
        <a href="${issueUrl}"
           style="display:inline-block;background:#111111;color:#ffffff;font-size:14px;font-weight:700;
                  padding:12px 24px;border-radius:8px;text-decoration:none;">
          Read on larper.co →
        </a>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:20px 36px;border-top:1px solid #e4e4e7;background:#fafafa;">
        <p style="margin:0;font-size:11px;color:#a1a1aa;font-family:monospace;line-height:1.8;">
          LARPER · AI &amp; tech for students · Free, every Monday<br/>
          <a href="${baseUrl}/unsubscribe" style="color:#a1a1aa;text-decoration:underline;">Unsubscribe</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
