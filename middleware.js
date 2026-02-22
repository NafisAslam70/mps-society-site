import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/utils/accessToken";

const ACCESS_COOKIE = "mpss_private_access";

const PUBLIC_PATHS = [
  "/access",
  "/robots.txt",
  "/api/private-links/consume",
  "/api/private-links/create",
  "/admin",
];

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((basePath) =>
    pathname === basePath || pathname.startsWith(`${basePath}/`)
  );
}

export async function middleware(request) {
  const url = request.nextUrl.clone();
  const invite = url.searchParams.get("invite");
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
