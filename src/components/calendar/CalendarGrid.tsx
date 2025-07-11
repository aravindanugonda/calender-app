"use client";

import { useState, useRef } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import { CalendarHeader } from "./CalendarHeader";
import { TaskModal } from "../tasks/TaskModal";
import { useGesture } from "@use-gesture/react";

export function CalendarGrid() {
  const { viewMode, currentDate, setCurrentDate } = useCalendarStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch gesture: swipe left/right to navigate calendar
  useGesture(
    {
      onDrag: ({ direction }) => {
        const [x] = direction as [number, number];
        if (Math.abs(x) > 0.5) {
          if (x > 0) {
            // Swipe right: previous
            setCurrentDate(viewMode === "month"
              ? new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
              : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7)
            );
          } else {
            // Swipe left: next
            setCurrentDate(viewMode === "month"
              ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
              : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7)
            );
          }
        }
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      drag: { axis: "x" },
    }
  );

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <CalendarHeader />
      <div className="flex-1 overflow-hidden">
        {viewMode === "week" ? (
          <WeekView onDateClick={handleDateClick} />
        ) : (
          <MonthView />
        )}
      </div>
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}
// ...existing code...
