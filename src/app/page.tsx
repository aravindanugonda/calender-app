"use client";
import AuthStatus from "@/components/ui/AuthStatus";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { useCalendarStore } from "@/store/calendar-store";
import { MonthYearPicker } from "@/components/calendar/MonthYearPicker";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { currentDate, setCurrentDate, viewType, setViewType, fetchTasks } = useCalendarStore();
  const [pickerType, setPickerType] = useState<'month' | 'year' | null>(null);

  useEffect(() => {
    // Initial task fetch
    fetchTasks(currentDate);
  }, []); // Only run once on mount

  const handlePrevious = () => {
    if (viewType === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewType === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

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

              {/* Fixed width spacer to maintain layout */}
              <div className="w-6" />

              {/* View type toggle and Today button */}
              <div className="flex items-center gap-2 min-w-[200px]">
                <div className="flex rounded-md overflow-hidden border border-gray-200">
                  <button 
                    onClick={() => setViewType('week')}
                    className={`px-3 py-1 text-sm ${
                      viewType === 'week' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setViewType('month')}
                    className={`px-3 py-1 text-sm border-l border-gray-200 ${
                      viewType === 'month' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Month
                  </button>
                </div>
                <button
                  onClick={handleToday}
                  className="px-3 py-1 text-sm rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Today
                </button>
              </div>

              {/* Navigation arrows with fixed width */}
              <div className="flex items-center gap-1 min-w-[80px]">
                <button 
                  onClick={handlePrevious}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={handleNext}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
