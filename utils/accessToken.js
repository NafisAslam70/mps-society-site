const encoder = new TextEncoder();

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toBase64Url(bytes) {
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return base64ToBytes(base64 + padding);
}

async function hmacSha256(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(sig);
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

export async function signAccessToken(payload, secret) {
  const payloadBytes = encoder.encode(JSON.stringify(payload));
  const payloadPart = toBase64Url(payloadBytes);
  const sigBytes = await hmacSha256(secret, payloadPart);
  const sigPart = toBase64Url(sigBytes);
  return `${payloadPart}.${sigPart}`;
}

export async function verifyAccessToken(token, secret) {
  if (!token || !secret) return null;
  const [payloadPart, sigPart] = token.split(".");
  if (!payloadPart || !sigPart) return null;

  const expectedSig = await hmacSha256(secret, payloadPart);
  const actualSig = fromBase64Url(sigPart);
  if (!timingSafeEqual(expectedSig, actualSig)) return null;

  const payloadRaw = new TextDecoder().decode(fromBase64Url(payloadPart));
  let payload;
  try {
    payload = JSON.parse(payloadRaw);
  } catch {
    return null;
  }

  if (!payload?.exp || Number(payload.exp) * 1000 <= Date.now()) return null;
  return payload;
}
