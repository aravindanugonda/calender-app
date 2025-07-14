"use client";

import AuthStatus from "@/components/ui/AuthStatus";

export default function DashboardHeader({ userName }: { userName: string }) {
  return (
    <header className="bg-transparent border-none">
      <div className="max-w-screen-2xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
                    <h1 className="text-xl font-semibold">Welcome, {userName}!</h1>
          </div>
          {/* Right section: AuthStatus */}
          <div className="flex items-center gap-4">
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  );
}
