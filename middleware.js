import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/accessToken";

const ACCESS_COOKIE = "mpss_private_access";
const ADMIN_COOKIE = "mpss_admin_session";

const PUBLIC_PATHS = [
  "/access",
  "/robots.txt",
  "/api/private-links/consume",
  "/admin/login",
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
];

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((basePath) =>
    pathname === basePath || pathname.startsWith(`${basePath}/`)
  );
}

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const invite = url.searchParams.get("invite");
  const pathname = url.pathname;
  const secret = process.env.ACCESS_COOKIE_SECRET;

  // Always keep search engines out, regardless of access state.
  const withNoIndex = (response) => {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  };

  if (!secret) {
    return withNoIndex(
      new NextResponse(
        `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Access Unavailable</title>
    <style>
      body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#0b1220;color:#e5e7eb;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
      .card{max-width:560px;width:100%;background:#111827;border:1px solid #374151;border-radius:14px;padding:24px}
      h1{margin:0 0 8px;font-size:24px}
      p{margin:0 0 14px;color:#cbd5e1;line-height:1.5}
      .muted{font-size:12px;color:#94a3b8}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Access unavailable</h1>
      <p>This private site is currently not configured for access verification. Please contact the administrator.</p>
      <p class="muted">Error: ACCESS_COOKIE_SECRET is missing.</p>
    </div>
  </body>
</html>`,
        {
          status: 503,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      )
    );
  }

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isCreateLinkApi = pathname === "/api/private-links/create";
  if (isAdminPath || isCreateLinkApi) {
    const adminToken = request.cookies.get(ADMIN_COOKIE)?.value;
    const adminPayload = adminToken
      ? await verifyAccessToken(adminToken, secret)
      : null;
    const hasAdminSession = adminPayload?.role === "admin";

    if (pathname === "/admin/login" && hasAdminSession) {
      const adminUrl = request.nextUrl.clone();
      adminUrl.pathname = "/admin";
      adminUrl.search = "";
      return withNoIndex(NextResponse.redirect(adminUrl));
    }

    if (pathname === "/admin/login" && !hasAdminSession) {
      return withNoIndex(NextResponse.next());
    }

    if (!hasAdminSession) {
      if (isCreateLinkApi) {
        return withNoIndex(
          NextResponse.json({ error: "Admin login required" }, { status: 401 })
        );
      }

      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.search = "";
      return withNoIndex(NextResponse.redirect(loginUrl));
    }

    return withNoIndex(NextResponse.next());
  }

  if (isPublicPath(url.pathname)) {
    return withNoIndex(NextResponse.next());
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const payload = accessToken
    ? await verifyAccessToken(accessToken, secret)
    : null;
  if (payload) {
    return withNoIndex(NextResponse.next());
  }

  if (invite) {
    const destinationUrl = request.nextUrl.clone();
    destinationUrl.searchParams.delete("invite");
    const cleanSearch = destinationUrl.searchParams.toString();
    const cleanNext = `${destinationUrl.pathname}${cleanSearch ? `?${cleanSearch}` : ""}`;

    const accessUrl = request.nextUrl.clone();
    accessUrl.pathname = "/access";
    accessUrl.search = "";
    accessUrl.searchParams.set("invite", invite);
    accessUrl.searchParams.set("next", cleanNext || "/");
    return withNoIndex(NextResponse.redirect(accessUrl));
  }

  return withNoIndex(
    new NextResponse(
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page Not Available</title>
    <style>
      body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#0b1220;color:#e5e7eb;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
      .card{max-width:560px;width:100%;background:#111827;border:1px solid #374151;border-radius:14px;padding:24px}
      h1{margin:0 0 8px;font-size:24px}
      p{margin:0 0 16px;color:#cbd5e1;line-height:1.5}
      a{display:inline-block;text-decoration:none;padding:10px 14px;border-radius:10px;font-weight:600}
      .primary{background:#0f766e;color:#ecfeff}
      .muted{font-size:12px;color:#94a3b8;margin-top:14px}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Page Not Available</h1>
      <p>The page you requested is not available.</p>
      <a class="primary" href="/admin/login">Go to Login</a>
      <p class="muted">If you believe this is an error, contact the administrator.</p>
    </div>
  </body>
</html>`,
      {
        status: 401,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    )
  );
}

export const config = {
  matcher: [
    // Protect all routes while skipping static assets and the robots file itself
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
