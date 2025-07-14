"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push("/dashboard");
      } else {
        // User is not authenticated, redirect to login
        router.push("/auth/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  // This should not render as we redirect above
  return null;
}
