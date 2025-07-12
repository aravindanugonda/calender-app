"use client";
import AuthStatus from "@/components/ui/AuthStatus";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal header inspired by Tweek */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-medium text-gray-800">Tweek</span>
          </div>
          <div className="flex items-center gap-4">
            <AuthStatus />
          </div>
        </div>
      </header>

      {/* Main calendar area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <CalendarGrid />
        </div>
      </main>
    </div>
  );
}
