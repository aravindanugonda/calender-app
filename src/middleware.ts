import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Let Auth0 handle its own SDK routes
  const auth0Routes = [
    "/auth/login",
    "/auth/logout",
    "/auth/callback",
    "/auth/profile",
    "/auth/access-token",
    "/auth/backchannel-logout",
    "/api/auth"
  ];
  if (auth0Routes.some(route => pathname.startsWith(route))) {
    try {
      return await auth0.middleware(request);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null) {
        const errorObj = err as { name?: string; message?: string };
        if (errorObj.name === "JWTExpired" || errorObj.message?.includes("exp")) {
          return NextResponse.redirect(new URL("/auth/login", request.url));
        }
      }
      throw err;
    }
  }

  // Allow access to public routes without authentication
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    try {
      return await auth0.middleware(request);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null) {
        const errorObj = err as { name?: string; message?: string };
        if (errorObj.name === "JWTExpired" || errorObj.message?.includes("exp")) {
          return NextResponse.redirect(new URL("/auth/login", request.url));
        }
      }
      throw err;
    }
  }

  // Protect dashboard and other protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/(protected)")) {
    try {
      const session = await auth0.getSession(request);
      if (!session) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null) {
        const errorObj = err as { name?: string; message?: string };
        if (errorObj.name === "JWTExpired" || errorObj.message?.includes("exp")) {
          return NextResponse.redirect(new URL("/auth/login", request.url));
        }
      }
      throw err;
    }
  }

  // For all other routes, use the auth response
  try {
    return await auth0.middleware(request);
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null) {
      const errorObj = err as { name?: string; message?: string };
      if (errorObj.name === "JWTExpired" || errorObj.message?.includes("exp")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
    throw err;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
