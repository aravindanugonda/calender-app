"use client";

import { useCalendarStore } from "@/store/calendar-store";
import { format, startOfWeek, addDays, isSameDay, isToday as isDateToday } from "date-fns";
import { TaskList } from "../tasks/TaskList";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

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

  // Get tasks that don't have a specific date (someday tasks)
  const somedayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    return taskDate.getTime() === 0 || task.title.toLowerCase().includes('someday');
  });

  return (
    <div className="h-full bg-white flex">
      {/* Week columns */}
      <div className="flex-1 grid grid-cols-7">
        {/* Week header */}
        <div className="col-span-7 grid grid-cols-7 border-b border-gray-100">
          {weekDays.map((day) => {
            const isToday = isDateToday(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-4 text-center border-r border-gray-100 last:border-r-0",
                  isWeekend && "bg-gray-50"
                )}
              >
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "text-sm font-medium w-8 h-8 rounded-full flex items-center justify-center mx-auto",
                    isToday
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Week content */}
        <div className="col-span-7 grid grid-cols-7 flex-1">
          {weekDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isToday = isDateToday(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "border-r border-gray-100 last:border-r-0 min-h-[500px] tweek-day-column group relative",
                  isWeekend && "bg-gray-50",
                  isToday && "bg-blue-50/30"
                )}
              >
                {/* Day column content */}
                <div className="p-3 h-full overflow-y-auto tweek-scroll">
                  <TaskList tasks={dayTasks} />
                  
                  {/* Add task button - appears on hover */}
                  <button
                    onClick={() => onDateClick(day)}
                    className="w-full p-3 text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Someday column */}
      <div className="w-64 border-l border-gray-100 bg-gray-50/50">
        <div className="p-4 text-center border-b border-gray-100">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Someday
          </div>
          <div className="text-sm font-medium text-gray-700">
            ∞
          </div>
        </div>
        <div className="p-3 h-full overflow-y-auto tweek-scroll">
          <TaskList tasks={somedayTasks} />
          <button
            onClick={() => {
              // Create a special someday date
              const somedayDate = new Date(0);
              onDateClick(somedayDate);
            }}
            className="w-full p-3 text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add someday task
          </button>
        </div>
      </div>
    </div>
  );
}
