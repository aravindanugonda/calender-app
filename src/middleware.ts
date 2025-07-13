import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);
  
  // Let Auth0 handle its routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return authRes;
  }
  
  // Allow access to public routes without authentication
  if (request.nextUrl.pathname === "/" || 
      request.nextUrl.pathname.startsWith("/_next") ||
      request.nextUrl.pathname.startsWith("/favicon.ico")) {
    return authRes;
  }
  
  // Protect API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  
  // For all other routes, use the auth response
  return authRes;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
