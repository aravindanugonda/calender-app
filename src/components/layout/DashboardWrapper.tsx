"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import AuthStatus from "@/components/ui/AuthStatus";

export function DashboardWrapper() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">
            You are not authorized. Please log in.
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
            onClick={() => {
              window.location.href = "/auth/login?returnTo=/dashboard";
            }}
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Top Header with Auth Status only */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2 sm:gap-4">
              <AuthStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Calendar Header with Navigation Controls showing Month/Year */}
      <CalendarHeader />

      {/* Calendar Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto px-2 sm:px-6 py-2 sm:py-4">
          <CalendarGrid session={{ user }} />
        </div>
      </div>
    </main>
  );
}