import { useEffect, useCallback } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { format, addMonths, subMonths, addWeeks, subWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarHeader() {
  const { currentDate, setCurrentDate, viewMode, setViewMode } = useCalendarStore();

  const handlePrev = useCallback(() => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  }, [currentDate, setCurrentDate, viewMode]);

  const handleNext = useCallback(() => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  }, [currentDate, setCurrentDate, viewMode]);

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
          setViewMode("month");
          break;
        case "w":
          setViewMode("week");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentDate, viewMode, handlePrev, handleNext, handleToday, setViewMode]);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
      {/* Left side - Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleToday}
          className="ml-2 h-8 px-3 hover:bg-gray-100 rounded-md text-sm font-medium text-gray-700"
        >
          Today
        </Button>
      </div>

      {/* Center - Current period */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-medium text-gray-800">
          {viewMode === "month" 
            ? format(currentDate, "MMMM yyyy")
            : format(currentDate, "MMM d, yyyy")
          }
        </h1>
      </div>

      {/* Right side - View switcher */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
        <Button
          variant={viewMode === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("week")}
          className={`h-7 px-3 text-xs font-medium rounded-sm ${
            viewMode === "week" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "bg-transparent text-gray-600 hover:bg-gray-50"
          }`}
        >
          Week
        </Button>
        <Button
          variant={viewMode === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("month")}
          className={`h-7 px-3 text-xs font-medium rounded-sm ${
            viewMode === "month" 
              ? "bg-white text-gray-900 shadow-sm" 
              : "bg-transparent text-gray-600 hover:bg-gray-50"
          }`}
        >
          Month
        </Button>
      </div>
    </div>
  );
}
