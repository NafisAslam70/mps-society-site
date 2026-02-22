import { NextResponse } from "next/server";
import { signAccessToken } from "@/utils/accessToken";

const ADMIN_COOKIE = "mpss_admin_session";
const ADMIN_MAX_AGE = 60 * 60 * 12; // 12 hours

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = String(body?.username || "");
    const password = String(body?.password || "");

    const expectedUsername = process.env.ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const secret = process.env.ACCESS_COOKIE_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "ACCESS_COOKIE_SECRET is not configured" },
        { status: 500 }
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const token = await signAccessToken(
      {
        sub: username,
        role: "admin",
        iat: now,
        exp: now + ADMIN_MAX_AGE,
      },
      secret
    );

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_MAX_AGE,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to sign in: ${error.message}` },
      { status: 500 }
    );
  }
}
