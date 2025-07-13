import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addDays, startOfWeek } from "date-fns";
import { useCalendarStore } from "@/store/calendar-store";
import { TaskList } from "../tasks/TaskList";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  onDateClick: (date: Date) => void;
}

export function MonthView({ onDateClick }: MonthViewProps) {
  const { currentDate, tasks } = useCalendarStore();

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
    return tasks.filter((task) => isSameDay(new Date(task.date), date));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Week days header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "py-2 text-center text-sm font-semibold text-gray-600",
              (index === 5 || index === 6) && "text-gray-400"
            )}
          >
            {day}
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
                "min-h-[120px] p-2 bg-white hover:bg-gray-50 group transition-colors",
                !isCurrentMonth && "bg-gray-50/50 text-gray-400",
                isCurrentDay && "bg-blue-50 hover:bg-blue-50/80",
                isWeekend && !isCurrentDay && "bg-gray-50/30"
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <div className={cn(
                  "text-sm font-medium",
                  isCurrentDay ? "text-blue-600" : "text-gray-500",
                  !isCurrentMonth && "text-gray-400"
                )}>
                  {format(date, "d")}
                </div>
                {isCurrentMonth && (
                  <button
                    onClick={() => onDateClick(date)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              
              {isCurrentMonth && (
                <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                  <TaskList tasks={dayTasks} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
