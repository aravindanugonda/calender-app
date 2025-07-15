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
  const { currentDate, tasks, searchQuery, getFilteredTasks } = useCalendarStore();

  // Helper function to get a solid color for mobile indicators
  const getTaskIndicatorColor = (colorKey: string) => {
    const colorMap = {
      'default': '#6B7280', // gray-500
      'red': '#EF4444',     // red-500
      'amber': '#F59E0B',   // amber-500
      'emerald': '#10B981', // emerald-500
      'blue': '#3B82F6',    // blue-500
      'purple': '#8B5CF6'   // purple-500
    };
    return colorMap[colorKey as keyof typeof colorMap] || colorMap.default;
  };
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTasksForDate = (date: Date) => {
    const filteredTasks = searchQuery ? getFilteredTasks() : tasks;
    const dayTasks = filteredTasks.filter((task) => {
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
  const somedayTasks = (searchQuery ? getFilteredTasks() : tasks).filter((task) => {
    const taskDate = new Date(task.date);
    return taskDate.getTime() === 0;
  });

  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* Week columns */}
      <div className="flex-1 flex flex-col">
        {/* Week header */}
        <div className="flex sm:grid sm:grid-cols-7 border-b-2 border-gray-200 overflow-x-auto">
          {weekDays.map((day) => {
            const isToday = isDateToday(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "weekday-header flex-shrink-0 w-20 sm:w-auto text-center border-r border-gray-100 last:border-r-0 py-2 sm:py-4",
                  isWeekend && "bg-gray-50"
                )}
              >
                <div className="font-semibold text-gray-700 text-xs sm:text-sm">{format(day, "EEE")}</div>
                <div className="text-xs text-gray-500 mt-1 hidden sm:block">{format(day, "MMMM")}</div>
                <div className="text-xs text-gray-500 mt-1 sm:hidden">{format(day, "MMM")}</div>
                <div
                  className={cn(
                    "day-number w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mx-auto mt-1 sm:mt-2 text-xs sm:text-sm font-medium",
                    isToday
                      ? "bg-blue-500 text-white shadow-md"
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
        <div className="flex-1 flex sm:grid sm:grid-cols-7 overflow-x-auto sm:overflow-hidden">
          {weekDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isToday = isDateToday(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "day-cell group relative cursor-pointer flex-shrink-0 w-20 sm:w-auto border-r border-gray-100 last:border-r-0",
                  isWeekend && "bg-gray-50/50",
                  isToday && "bg-blue-50/30 sm:border-l-2 sm:border-blue-400"
                )}
                onClick={() => onDateClick(day)}
              >
                {/* Day column content */}
                <div className="p-2 sm:p-4 h-full overflow-y-auto calendar-scroll"
                     onClick={(e) => e.stopPropagation()}>
                  {/* Mobile: Show simplified task indicators and add button */}
                  <div className="sm:hidden">
                    <div className="flex flex-wrap gap-1 items-center">
                      {dayTasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Open task modal for editing
                            const event = new CustomEvent('openTaskModal', { 
                              detail: { task, mode: 'edit' } 
                            });
                            window.dispatchEvent(event);
                          }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white transition-all hover:scale-110 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: getTaskIndicatorColor(task.color) }}
                          title={task.title}
                        >
                          {task.title.charAt(0).toUpperCase()}
                        </button>
                      ))}
                      {dayTasks.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDateClick(day);
                          }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-gray-500 border border-gray-300 transition-all hover:bg-gray-100 flex-shrink-0"
                          title="Add task"
                        >
                          +
                        </button>
                      )}
                    </div>
                    {/* Mobile empty area click handler */}
                    {dayTasks.length === 0 && (
                      <div 
                        className="h-full min-h-[40px] w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDateClick(day);
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Desktop: Show full task list */}
                  <div className="hidden sm:block">
                    <TaskList tasks={dayTasks} />
                  </div>
                  
                  {/* Add task button - only visible on desktop hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateClick(day);
                    }}
                    className="w-full p-2 sm:p-3 text-left text-xs sm:text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all opacity-0 sm:group-hover:opacity-100 hidden sm:flex items-center gap-1 sm:gap-2 mt-2"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Add task</span>
                  </button>
                </div>

                {/* Paper lines for empty days - hidden on mobile */}
                {dayTasks.length === 0 && (
                  <div className="absolute inset-x-2 sm:inset-x-4 bottom-4 space-y-2 opacity-10 hidden sm:block">
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

      {/* Someday column - bottom on mobile, side on desktop */}
      <div className="h-32 sm:h-auto sm:w-64 border-t-2 sm:border-t-0 sm:border-l-2 border-gray-200 bg-gradient-to-r sm:bg-gradient-to-b from-purple-50 to-indigo-50 cursor-pointer"
           onClick={() => {
             const somedayDate = new Date(0);
             onDateClick(somedayDate);
           }}>
        <div className="weekday-header text-center border-b border-gray-200 py-2 sm:py-4">
          <div className="font-semibold text-purple-700 text-sm sm:text-base">Someday</div>
          <div className="text-xs text-purple-500 mt-1 hidden sm:block">Future Plans</div>
          <div className="text-lg sm:text-2xl mt-1 sm:mt-2">∞</div>
        </div>
        <div className="p-2 sm:p-4 h-full overflow-y-auto calendar-scroll"
             onClick={(e) => e.stopPropagation()}>
          {/* Mobile: Show simplified task indicators and add button */}
          <div className="sm:hidden">
            <div className="flex flex-wrap gap-1 items-center">
              {somedayTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open task modal for editing
                    const event = new CustomEvent('openTaskModal', { 
                      detail: { task, mode: 'edit' } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white transition-all hover:scale-110 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: getTaskIndicatorColor(task.color) }}
                  title={task.title}
                >
                  {task.title.charAt(0).toUpperCase()}
                </button>
              ))}
              {somedayTasks.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const somedayDate = new Date(0);
                    onDateClick(somedayDate);
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-purple-600 border border-purple-300 transition-all hover:bg-purple-100 flex-shrink-0"
                  title="Add someday task"
                >
                  +
                </button>
              )}
            </div>
            {/* Mobile empty area click handler */}
            {somedayTasks.length === 0 && (
              <div 
                className="h-full min-h-[40px] w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  const somedayDate = new Date(0);
                  onDateClick(somedayDate);
                }}
              />
            )}
          </div>
          
          {/* Desktop: Show full task list */}
          <div className="hidden sm:block">
            <TaskList tasks={somedayTasks} />
          </div>
          
          {/* Add task button - only visible on desktop */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const somedayDate = new Date(0);
              onDateClick(somedayDate);
            }}
            className="w-full p-2 sm:p-3 text-left text-xs sm:text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-all hidden sm:flex items-center gap-1 sm:gap-2 mt-2"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Add someday task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
