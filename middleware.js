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
      new NextResponse("Site is locked. Missing ACCESS_COOKIE_SECRET.", { status: 503 })
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
    new NextResponse("Private link required.", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  );
}

export const config = {
  matcher: [
    // Protect all routes while skipping static assets and the robots file itself
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
