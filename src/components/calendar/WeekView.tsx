"use client";

import { useCalendarStore } from "@/store/calendar-store";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { TaskList } from "../tasks/TaskList";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  onDateClick: (date: Date) => void;
}

export function WeekView({ onDateClick }: WeekViewProps) {
  const { currentDate, tasks } = useCalendarStore();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.date), date));
  };

  return (
    <div className="grid grid-cols-7 gap-1 h-full">
      {weekDays.map((day) => {
        const dayTasks = getTasksForDate(day);
        const isToday = isSameDay(day, new Date());

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer",
              isToday && "ring-2 ring-blue-500"
            )}
            onClick={() => onDateClick(day)}
          >
            <div className="text-center mb-2">
              <div className="text-xs text-gray-500 uppercase">
                {format(day, "EEE")}
              </div>
              <div className={cn("text-lg font-semibold", isToday && "text-blue-600")}> 
                {format(day, "d")}
              </div>
            </div>
            <TaskList tasks={dayTasks} />
          </div>
        );
      })}
    </div>
  );
}
