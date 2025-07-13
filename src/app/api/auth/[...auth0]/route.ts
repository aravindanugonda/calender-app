// For Auth0 version 4.0.0, we need to mount the authentication routes
import { auth0 } from "@/lib/auth";

// The routes are automatically mounted by the auth0 middleware
// This file is required to handle the dynamic routes, but no implementation is needed
// as the auth0 middleware handles all the authentication logic

export async function GET() {
  return Response.json({ error: "Route not directly accessible" }, { status: 404 });
}
