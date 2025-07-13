// For Auth0 version 4.0.0, we need to mount the authentication routes
import { NextRequest, NextResponse } from "next/server";

// Create route handlers to handle authentication paths
export async function GET(request: NextRequest) {
  // Route will be handled by middleware automatically
  // Just route based on path
  const { pathname } = new URL(request.url);
  
  if (pathname.endsWith('/login')) {
    return NextResponse.redirect(new URL('/api/auth/login', request.url));
  } else if (pathname.endsWith('/logout')) {
    return NextResponse.redirect(new URL('/api/auth/logout', request.url));
  } else if (pathname.endsWith('/callback')) {
    // The auth0 middleware handles the callback
    return NextResponse.next();
  }
  
  // Default response for other paths
  return NextResponse.next();
}
