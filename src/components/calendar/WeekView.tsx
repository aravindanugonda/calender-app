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
    const dayTasks = tasks.filter((task) => {
      try {
        const taskDate = new Date(task.date);
        return isSameDay(taskDate, date);
      } catch {
        console.error("Invalid date in task:", task);
        return false;
      }
    });
    return dayTasks;
  };

  // Get tasks that don't have a specific date (someday tasks)
  const somedayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    return taskDate.getTime() === 0 || task.title.toLowerCase().includes('someday');
  });

  return (
    <div className="h-full flex">
      {/* Week columns */}
      <div className="flex-1 grid grid-cols-7">
        {/* Week header */}
        <div className="col-span-7 grid grid-cols-7 border-b-2 border-gray-200">
          {weekDays.map((day) => {
            const isToday = isDateToday(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "weekday-header text-center border-r border-gray-100 last:border-r-0",
                  isWeekend && "bg-gray-50"
                )}
              >
                <div className="font-semibold text-gray-700">{format(day, "EEE")}</div>
                <div className="text-xs text-gray-500 mt-1">{format(day, "MMM d")}</div>
                <div
                  className={cn(
                    "day-number w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-2 text-sm font-medium",
                    isToday
                      ? "today text-white"
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
                  "day-cell group relative cursor-pointer",
                  isWeekend && "weekend",
                  isToday && "today"
                )}
              >
                {/* Day column content */}
                <div className="p-4 h-full overflow-y-auto tweek-scroll">
                  <TaskList tasks={dayTasks} />
                  
                  {/* Add task button - appears on hover */}
                  <button
                    onClick={() => onDateClick(day)}
                    className="w-full p-3 text-left text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2 mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add task
                  </button>
                </div>

                {/* Paper lines for empty days */}
                {dayTasks.length === 0 && (
                  <div className="absolute inset-x-4 bottom-4 space-y-2 opacity-10">
                    <div className="h-px bg-gray-300"></div>
                    <div className="h-px bg-gray-300"></div>
                    <div className="h-px bg-gray-300"></div>
                  </div>
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-lg pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Someday column */}
      <div className="w-64 border-l-2 border-gray-200 bg-gradient-to-b from-purple-50 to-indigo-50">
        <div className="weekday-header text-center border-b border-gray-200 py-4">
          <div className="font-semibold text-purple-700 whitespace-nowrap">Someday</div>
          <div className="text-xs text-purple-500 mt-1 whitespace-nowrap">Future Plans</div>
          <div className="text-2xl mt-2 whitespace-nowrap">∞</div>
        </div>
        <div className="p-4 h-full overflow-y-auto tweek-scroll">
          <TaskList tasks={somedayTasks} />
          <button
            onClick={() => {
              // Create a special someday date
              const somedayDate = new Date(0);
              onDateClick(somedayDate);
            }}
            className="w-full p-3 text-left text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-all flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            Add someday task
          </button>
        </div>
      </div>
    </div>
  );
}
