"use client";

import { useEffect, useState } from "react";
import { CalendarGrid } from "../calendar/CalendarGrid";

function MobileHeader() {
  return <div className="p-2 bg-blue-500 text-white">Mobile Header</div>;
}

function DesktopSidebar() {
  return <div className="w-64 bg-gray-100 p-4">Desktop Sidebar</div>;
}

export function ResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <DesktopSidebar />}
      <div className="flex-1 flex flex-col">
        {isMobile && <MobileHeader />}
        <main className="flex-1 overflow-hidden">
          <CalendarGrid />
        </main>
      </div>
    </div>
  );
}
