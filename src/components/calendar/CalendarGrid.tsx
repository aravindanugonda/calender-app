"use client";

import { useState, useRef } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import { CalendarHeader } from "./CalendarHeader";
import { TaskModal } from "../tasks/TaskModal";
import { useGesture } from "@use-gesture/react";
import { addWeeks, subWeeks, addMonths, subMonths } from "date-fns";

export function CalendarGrid() {
  const { viewMode, currentDate, setCurrentDate } = useCalendarStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch gesture: swipe left/right to navigate calendar
  useGesture(
    {
      onDrag: ({ direction, distance }) => {
        const [x] = direction as [number, number];
        if (Math.abs(x) > 0.5 && distance[0] > 50) {
          if (x > 0) {
            // Swipe right: previous
            setCurrentDate(viewMode === "month"
              ? subMonths(currentDate, 1)
              : subWeeks(currentDate, 1)
            );
          } else {
            // Swipe left: next
            setCurrentDate(viewMode === "month"
              ? addMonths(currentDate, 1)
              : addWeeks(currentDate, 1)
            );
          }
        }
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      drag: { axis: "x", threshold: 10 },
    }
  );

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden" ref={containerRef}>
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
