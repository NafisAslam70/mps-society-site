import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/accessToken";

const ADMIN_COOKIE = "mpss_admin_session";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const secret = process.env.ACCESS_COOKIE_SECRET;

  // Always keep search engines out, regardless of access state.
  const withNoIndex = (response) => {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  };

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isCreateLinkApi = pathname === "/api/private-links/create";
  if (isAdminPath || isCreateLinkApi) {
    if (!secret) {
      return withNoIndex(
        NextResponse.json({ error: "Admin authentication is unavailable" }, { status: 503 })
      );
    }

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

  // Public site pages and assets are open; admin routes remain session protected.
  return withNoIndex(NextResponse.next());
}

export const config = {
  matcher: [
    // Keep middleware on routes while skipping framework assets and robots files.
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
