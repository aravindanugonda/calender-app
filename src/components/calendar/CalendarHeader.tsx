"use client";

import { useEffect, useCallback, useState } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { format, addMonths, subMonths, addWeeks, subWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { MonthYearPicker } from "./MonthYearPicker";

export function CalendarHeader() {
  const { currentDate, setCurrentDate, viewType, setViewType, searchQuery, setSearchQuery } = useCalendarStore();
  const [pickerOpen, setPickerOpen] = useState<'month' | 'year' | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const handlePrev = useCallback(() => {
    if (viewType === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  }, [currentDate, setCurrentDate, viewType]);

  const handleNext = useCallback(() => {
    if (viewType === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  }, [currentDate, setCurrentDate, viewType]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, [setCurrentDate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case "arrowleft":
          handlePrev();
          break;
        case "arrowright":
          handleNext();
          break;
        case "t":
          handleToday();
          break;
        case "m":
          setViewType("month");
          break;
        case "w":
          setViewType("week");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentDate, viewType, handlePrev, handleNext, handleToday, setViewType]);

  return (
    <div className="paper-header flex flex-col sm:flex-row items-center justify-between px-3 sm:px-8 py-4 sm:py-6 gap-4 sm:gap-0">
      {/* Top row on mobile: Navigation + Date */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        {/* Left side - Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            className="h-9 w-9 sm:h-10 sm:w-10 p-0 hover:bg-gray-100 rounded-full shadow-sm border border-gray-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="h-9 w-9 sm:h-10 sm:w-10 p-0 hover:bg-gray-100 rounded-full shadow-sm border border-gray-200 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="ml-2 sm:ml-3 h-9 sm:h-10 px-3 sm:px-4 hover:bg-blue-50 rounded-full text-xs sm:text-sm font-medium text-blue-600 border border-blue-200"
          >
            Today
          </Button>
        </div>

        {/* Center - Current period */}
        <div className="flex-1 sm:flex-none text-center sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {viewType === "week" && (
              <span className="month-title text-lg sm:text-xl">
                {format(currentDate, "d")}
              </span>
            )}
            <button
              onClick={() => setPickerOpen('month')}
              className="month-title hover:bg-gray-100 px-1 sm:px-2 py-1 rounded cursor-pointer transition-colors text-lg sm:text-xl"
            >
              {viewType === "month" 
                ? format(currentDate, window.innerWidth < 640 ? "MMM" : "MMMM")
                : format(currentDate, "MMMM")
              }
            </button>
            <button
              onClick={() => setPickerOpen('year')}
              className="month-title hover:bg-gray-100 px-1 sm:px-2 py-1 rounded cursor-pointer transition-colors text-lg sm:text-xl"
            >
              {format(currentDate, "yyyy")}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row on mobile: Search and View switcher */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        {/* Search */}
        <div className="relative">
          {showSearch ? (
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 sm:w-48 text-sm bg-transparent border-none focus:outline-none placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <Search className="w-4 h-4 text-gray-600" />
            </Button>
          )}
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-full p-1 shadow-sm">
          <Button
            variant={viewType === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewType("week")}
            className={`h-8 px-3 sm:px-4 text-xs font-medium rounded-full transition-all duration-200 ${
              viewType === "week" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "bg-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            Week
          </Button>
          <Button
            variant={viewType === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewType("month")}
            className={`h-8 px-3 sm:px-4 text-xs font-medium rounded-full transition-all duration-200 ${
              viewType === "month" 
                ? "bg-white text-gray-900 shadow-sm" 
                : "bg-transparent text-gray-600 hover:bg-gray-50"
            }`}
          >
            Month
          </Button>
        </div>
      </div>
      
      {/* Month/Year Picker Modal */}
      {pickerOpen && (
        <MonthYearPicker
          type={pickerOpen}
          onClose={() => setPickerOpen(null)}
        />
      )}
    </div>
  );
}
