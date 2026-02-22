import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/utils/db";
import { ensurePrivateInvitesTable, randomToken, sha256Hex } from "@/utils/privateInvites";

function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function POST(request) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    if (!process.env.ADMIN_LINK_KEY) {
      return NextResponse.json({ error: "ADMIN_LINK_KEY is not configured" }, { status: 500 });
    }
    if (!adminKey || adminKey !== process.env.ADMIN_LINK_KEY) {
      return unauthorized();
    }

    const body = await request.json().catch(() => ({}));
    const rawMinutes = Number(body?.expiresInMinutes ?? 60 * 24);
    const expiresInMinutes = Number.isFinite(rawMinutes)
      ? Math.max(5, Math.min(60 * 24 * 14, Math.floor(rawMinutes)))
      : 60 * 24;
    const note = typeof body?.note === "string" ? body.note.trim().slice(0, 200) : null;

    await ensurePrivateInvitesTable();

    const inviteToken = randomToken(24);
    const tokenHash = await sha256Hex(inviteToken);
    const inviteId = crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await db.execute(sql`
      INSERT INTO private_invites (id, token_hash, note, expires_at)
      VALUES (${inviteId}, ${tokenHash}, ${note}, ${expiresAt})
    `);

    const origin = new URL(request.url).origin;
    const link = `${origin}/?invite=${inviteToken}`;

    return NextResponse.json({
      link,
      inviteId,
      expiresAt: expiresAt.toISOString(),
      expiresInMinutes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create private link: ${error.message}` },
      { status: 500 }
    );
  }
}
