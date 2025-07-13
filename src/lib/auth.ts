import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Create the Auth0 client with default configuration
// This will read all configuration from environment variables
export const auth0 = new Auth0Client();
