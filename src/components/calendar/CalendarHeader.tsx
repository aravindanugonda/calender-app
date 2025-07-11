

import { useEffect, useCallback } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";


export function CalendarHeader() {
  const { currentDate, setCurrentDate, viewMode, setViewMode } = useCalendarStore();

  const handlePrev = useCallback(() => {
    setCurrentDate(viewMode === "month" ? subMonths(currentDate, 1) : subMonths(currentDate, 0));
  }, [currentDate, setCurrentDate, viewMode]);
  const handleNext = useCallback(() => {
    setCurrentDate(viewMode === "month" ? addMonths(currentDate, 1) : addMonths(currentDate, 0));
  }, [currentDate, setCurrentDate, viewMode]);
  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, [setCurrentDate]);

  // Keyboard shortcuts: ←/→ for prev/next, T for today, M/W for view switch
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
    <div className="flex items-center justify-between p-2 border-b bg-white" role="region" aria-label="Calendar navigation">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handlePrev} aria-label="Previous">
          &lt;
        </Button>
        <Button variant="ghost" size="sm" onClick={handleToday} aria-label="Today">
          Today
        </Button>
        <Button variant="ghost" size="sm" onClick={handleNext} aria-label="Next">
          &gt;
        </Button>
        <span className="ml-4 text-lg font-semibold" aria-live="polite">
          {format(currentDate, "MMMM yyyy")}
        </span>
      </div>
      <div className="flex gap-2" role="group" aria-label="View switcher">
        <Button
          variant={viewMode === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("month")}
          aria-label="Month view"
        >
          Month
        </Button>
        <Button
          variant={viewMode === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode("week")}
          aria-label="Week view"
        >
          Week
        </Button>
      </div>
    </div>
  );
}
