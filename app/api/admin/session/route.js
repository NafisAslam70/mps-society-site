import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/accessToken";

const ADMIN_COOKIE = "mpss_admin_session";

export async function GET(request) {
  const secret = process.env.ACCESS_COOKIE_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const payload = token ? await verifyAccessToken(token, secret) : null;
  const isAdmin = payload?.role === "admin";

  if (!isAdmin) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
