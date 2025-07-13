import { useEffect, useCallback } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { format, addMonths, subMonths, addWeeks, subWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarHeader() {
  const { currentDate, setCurrentDate, viewType, setViewType } = useCalendarStore();

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
    <div className="paper-header flex items-center justify-between px-8 py-6">
      {/* Left side - Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full shadow-sm border border-gray-200 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full shadow-sm border border-gray-200 flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToday}
          className="ml-3 h-10 px-4 hover:bg-blue-50 rounded-full text-sm font-medium text-blue-600 border border-blue-200"
        >
          Today
        </Button>
      </div>

      {/* Center - Current period */}
      <div className="flex-1 text-center">
        <h1 className="month-title">
          {viewType === "month" 
            ? format(currentDate, "MMMM yyyy")
            : format(currentDate, "MMM d, yyyy")
          }
        </h1>
      </div>

      {/* Right side - View switcher */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 shadow-sm">
        <Button
          variant={viewType === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewType("week")}
          className={`h-8 px-4 text-xs font-medium rounded-full transition-all duration-200 ${
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
          className={`h-8 px-4 text-xs font-medium rounded-full transition-all duration-200 ${
            viewType === "month" 
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
