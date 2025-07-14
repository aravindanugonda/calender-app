
import { auth0 } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  // Debug log for session
  // console.log("Dashboard session:", session);
  if (!session) {
    redirect("/auth/login");
  }

  // Import client-side calendar components
  // Note: This must be a client component wrapper for CalendarGrid, etc.
  const DashboardHeader = (await import("@/components/layout/DashboardHeader")).default;
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <DashboardHeader userName={session.user.name ?? ""} />
      {/* Calendar */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto px-6 py-4">
          <CalendarGrid session={session} />
        </div>
      </div>
    </main>
  );
}
