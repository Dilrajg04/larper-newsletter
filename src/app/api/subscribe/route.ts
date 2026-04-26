import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { email } = await req.json().catch(() => ({}));

  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "LARPER <newsletter@larper.co>";

  if (!apiKey || !audienceId) {
    return NextResponse.json(
      { error: "Email service not configured yet. Check back soon!" },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const normalized = email.toLowerCase().trim();

  // Add to Resend Audience — ignore duplicate errors, always continue to send email
  const { error: audienceError } = await resend.contacts.create({
    audienceId,
    email: normalized,
    unsubscribed: false,
  });

  if (audienceError) {
    // Log but don't block — duplicate contacts are fine, we still send the email
    console.warn("Resend audience warning:", audienceError.message);
  }

  // Always send the confirmation email
  const { error: emailError } = await resend.emails.send({
    from: fromEmail,
    to: normalized,
    subject: "You're in — welcome to LARPER 🎉",
    html: confirmationEmail(process.env.NEXT_PUBLIC_BASE_URL ?? "https://larper.co"),
  });

  if (emailError) {
    console.error("Resend email error:", emailError);
    return NextResponse.json(
      { error: "Couldn't send confirmation email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "You're subscribed! Check your inbox for a confirmation email.",
  });
}

function confirmationEmail(baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to LARPER</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #e4e4e7;">
              <span style="font-size:28px;font-weight:900;letter-spacing:-1px;color:#111111;">LARPER</span>
              <span style="font-size:11px;color:#71717a;font-family:monospace;margin-left:10px;">/AI &amp; TECH FOR STUDENTS</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 0 28px;">
              <p style="margin:0 0 16px;font-size:24px;font-weight:800;color:#111111;line-height:1.3;">
                You're officially subscribed ✓
              </p>
              <p style="margin:0 0 16px;font-size:16px;color:#3f3f46;line-height:1.7;">
                Welcome to LARPER — the newsletter that makes AI and tech news actually make sense.
                Every Monday you'll get 2 issues: clear explanations, no assumed knowledge,
                and a buzzword broken down so you actually know what people are talking about.
              </p>
              <p style="margin:0 0 28px;font-size:16px;color:#3f3f46;line-height:1.7;">
                Your first issue arrives next Monday. Until then, check out what we've published so far.
              </p>
              <a href="${baseUrl}"
                 style="display:inline-block;background:#111111;color:#ffffff;font-size:15px;font-weight:700;
                        padding:14px 28px;border-radius:8px;text-decoration:none;">
                Read the latest issues →
              </a>
            </td>
          </tr>

          <!-- Buzzword teaser -->
          <tr>
            <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:24px;">
              <p style="margin:0 0 6px;font-size:11px;font-family:monospace;text-transform:uppercase;
                         letter-spacing:2px;color:#d97706;">🔍 Buzzword of the week</p>
              <p style="margin:0 0 8px;font-size:18px;font-weight:900;color:#d97706;">Large Language Model</p>
              <p style="margin:0;font-size:14px;color:#52525b;line-height:1.7;">
                An AI trained on massive amounts of text that learns to predict what word comes next.
                Everything ChatGPT does comes from being really, really good at that one trick.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;border-top:1px solid #e4e4e7;margin-top:32px;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;font-family:monospace;">
                LARPER · AI &amp; tech for students · 2 issues every Monday, free<br/>
                You subscribed at larper.co.
                <a href="${baseUrl}/unsubscribe" style="color:#a1a1aa;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
