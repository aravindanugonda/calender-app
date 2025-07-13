// Create a minimal route handler for Auth0
// In Auth0 v4, most of the work is done by the middleware,
// but we still need to export a route handler

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server";

export async function GET() {
  // This is a minimal implementation that will be overridden
  // by the Auth0 middleware, but it satisfies Next.js requirements
  return new Response("Auth route", { status: 200 });
}

export async function POST() {
  // This is a minimal implementation that will be overridden
  // by the Auth0 middleware, but it satisfies Next.js requirements
  return new Response("Auth route", { status: 200 });
}
/* eslint-enable @typescript-eslint/no-unused-vars */
