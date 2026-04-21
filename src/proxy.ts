import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "larper-admin-session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes — leave /admin/login open
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const secret = getSecret();
  if (!secret) {
    // SESSION_SECRET not configured — redirect to login with a hint
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (payload.isAdmin !== true) throw new Error("not admin");
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
