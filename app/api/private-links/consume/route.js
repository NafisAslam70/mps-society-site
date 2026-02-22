import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/utils/db";
import { signAccessToken } from "@/utils/accessToken";
import { ensurePrivateInvitesTable, sha256Hex } from "@/utils/privateInvites";

const ACCESS_COOKIE = "mpss_private_access";
const ACCESS_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function sanitizePath(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  return value;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const invite = typeof body?.invite === "string" ? body.invite.trim() : "";
    const nextPath = sanitizePath(body?.nextPath);

    if (!invite) {
      return NextResponse.json({ error: "Missing invite token" }, { status: 400 });
    }
    if (!process.env.ACCESS_COOKIE_SECRET) {
      return NextResponse.json(
        { error: "ACCESS_COOKIE_SECRET is not configured" },
        { status: 500 }
      );
    }

    await ensurePrivateInvitesTable();

    const tokenHash = await sha256Hex(invite);
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const ua = request.headers.get("user-agent") || null;

    const result = await db.execute(sql`
      UPDATE private_invites
      SET used_at = NOW(), used_ip = ${ip}, used_ua = ${ua}
      WHERE token_hash = ${tokenHash}
        AND used_at IS NULL
        AND expires_at > NOW()
      RETURNING id
    `);

    const inviteId = Array.isArray(result)
      ? result?.[0]?.id
      : result?.rows?.[0]?.id;
    if (!inviteId) {
      return NextResponse.json(
        { error: "Link is invalid, expired, or already used." },
        { status: 401 }
      );
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const token = await signAccessToken(
      {
        sub: inviteId,
        iat: nowSeconds,
        exp: nowSeconds + ACCESS_MAX_AGE,
      },
      process.env.ACCESS_COOKIE_SECRET
    );

    const response = NextResponse.json({ ok: true, redirectTo: nextPath });
    response.cookies.set(ACCESS_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ACCESS_MAX_AGE,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to validate link: ${error.message}` },
      { status: 500 }
    );
  }
}
