import { sql } from "drizzle-orm";
import { db } from "@/utils/db";

const encoder = new TextEncoder();

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomToken(byteLength = 24) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function ensurePrivateInvitesTable() {
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS private_invites (
      id VARCHAR(64) PRIMARY KEY,
      token_hash TEXT NOT NULL UNIQUE,
      note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      used_ip VARCHAR(100),
      used_ua TEXT
    )
  `));
}
