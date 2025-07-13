"use client";
import AuthStatus from "@/components/ui/AuthStatus";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useCalendarStore } from "@/store/calendar-store";
import { MonthYearPicker } from "@/components/calendar/MonthYearPicker";


export default function Home() {
  const { currentDate, fetchTasks } = useCalendarStore();
  const [pickerType, setPickerType] = useState<'month' | 'year' | null>(null);

  useEffect(() => {
    // Initial task fetch
    fetchTasks(currentDate);
  }, [fetchTasks, currentDate]); // Add dependencies

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Month and Year buttons - now leftmost with fixed width wrapper */}
              <div className="flex items-center gap-2">
                <div className="relative group w-[120px]">
                  <button 
                    onClick={() => setPickerType('month')}
                    className="text-xl font-semibold hover:text-blue-600 transition-colors truncate w-full text-left"
                    title={format(currentDate, "MMMM")}
                  >
                    {format(currentDate, "MMMM")}
                  </button>
                </div>
                <button 
                  onClick={() => setPickerType('year')}
                  className="text-xl font-semibold hover:text-blue-600 transition-colors w-[70px] text-left"
                >
                  {format(currentDate, "yyyy")}
                </button>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <AuthStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto px-6 py-4">
          <CalendarGrid />
        </div>
      </div>

      {/* Month/Year Picker */}
      {pickerType && (
        <MonthYearPicker 
          type={pickerType} 
          onClose={() => setPickerType(null)} 
        />
      )}
    </div>
  );
}
