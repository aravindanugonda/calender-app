import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addDays, startOfWeek } from "date-fns";
import { useCalendarStore } from "@/store/calendar-store";
import { TaskList } from "../tasks/TaskList";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  onDateClick: (date: Date) => void;
}

export function MonthView({ onDateClick }: MonthViewProps) {
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  
  // Get all dates to display including padding days
  const allDates = eachDayOfInterval({
    start: calendarStart,
    end: endOfMonth(monthEnd)
  });

  // Get week days for the header
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    format(addDays(calendarStart, i), "EEE")
  );

  const getTasksForDate = (date: Date) => {
    const filteredTasks = searchQuery ? getFilteredTasks() : tasks;
    return filteredTasks.filter((task) => isSameDay(new Date(task.date), date));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Week days header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-600",
              (index === 5 || index === 6) && "text-gray-400"
            )}
          >
            <span className="sm:hidden">{day.charAt(0)}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 gap-px bg-gray-200 overflow-auto">
        {allDates.map((date) => {
          const dayTasks = getTasksForDate(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isCurrentDay = isSameDay(date, new Date());
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          return (
            <div 
              key={date.toString()} 
              className={cn(
                "min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 bg-white hover:bg-gray-50 group transition-colors cursor-pointer",
                !isCurrentMonth && "bg-gray-50/50 text-gray-400",
                isCurrentDay && "bg-blue-50 hover:bg-blue-50/80 border-2 border-blue-300 shadow-sm",
                isWeekend && !isCurrentDay && "bg-gray-50/30"
              )}
              onClick={() => {
                // Only allow cell clicks to open add modal when:
                // 1. It's current month
                // 2. On mobile: only if there are no tasks (empty cells)
                // 3. On desktop: always (existing behavior)
                if (isCurrentMonth) {
                  const isMobile = window.innerWidth < 640;
                  if (isMobile && dayTasks.length > 0) {
                    // On mobile with tasks: do nothing, only + button should work
                    return;
                  }
                  onDateClick(date);
                }
              }}
            >
              <div className="flex justify-between items-center mb-1 sm:mb-2">
                <div className={cn(
                  "text-xs sm:text-sm font-medium",
                  isCurrentDay ? "text-blue-700 bg-blue-100 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs" : "text-gray-500",
                  !isCurrentMonth && "text-gray-400"
                )}>
                  {format(date, "d")}
                </div>
                {isCurrentMonth && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateClick(date);
                    }}
                    className="opacity-0 sm:group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200 hidden sm:flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  </button>
                )}
              </div>
              
              {isCurrentMonth && (
                <>
                  {/* Mobile: Show only task indicators and add button */}
                  <div className="sm:hidden">
                    {dayTasks.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 items-center" onClick={(e) => e.stopPropagation()}>
                        {dayTasks.slice(0, 6).map((task) => (
                          <button
                            key={task.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Open task modal for editing immediately
                              const event = new CustomEvent('openTaskModal', { 
                                detail: { task, mode: 'edit' } 
                              });
                              window.dispatchEvent(event);
                            }}
                            className="w-2 h-2 rounded-full transition-all hover:scale-125"
                            style={{ backgroundColor: getTaskIndicatorColor(task.color) }}
                            title={task.title}
                          />
                        ))}
                        {dayTasks.length > 6 && (
                          <span className="text-xs text-gray-500 ml-1">+{dayTasks.length - 6}</span>
                        )}
                        {/* Add task button for cells with tasks */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDateClick(date);
                          }}
                          className="w-3 h-3 rounded-full flex items-center justify-center text-xs text-gray-500 border border-gray-300 transition-all hover:bg-gray-100 ml-1"
                          title="Add task"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Desktop: Show full task list */}
                  <div className="hidden sm:block space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                    <TaskList tasks={dayTasks} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
