
import { useCalendarStore } from "@/store/calendar-store";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, format, isToday as isDateToday } from "date-fns";
import { TaskList } from "../tasks/TaskList";
import { cn } from "@/lib/utils";

export function MonthView() {
  const { currentDate, tasks } = useCalendarStore();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  for (let day = weekStart; day <= weekEnd; day = addDays(day, 1)) {
    days.push(day);
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.date), date));
  };

  // Day labels
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="h-full bg-white">
      {/* Month header */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {dayLabels.map((label) => (
          <div key={label} className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </div>
        ))}
      </div>

      {/* Month grid */}
      <div className="grid grid-cols-7 auto-rows-fr h-full">
        {days.map((day) => {
          const dayTasks = getTasksForDate(day);
          const isToday = isDateToday(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-b border-gray-100 last:border-r-0 min-h-[120px] tweek-day-column group",
                !isCurrentMonth && "bg-gray-50 text-gray-400",
                isWeekend && "bg-gray-50",
                isToday && "bg-blue-50/30"
              )}
            >
              <div className="p-3 h-full">
                <div className="mb-2">
                  <div
                    className={cn(
                      "text-sm font-medium w-6 h-6 rounded-full flex items-center justify-center",
                      isToday
                        ? "bg-blue-500 text-white"
                        : isCurrentMonth
                        ? "text-gray-700"
                        : "text-gray-400"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>
                <div className="overflow-y-auto tweek-scroll max-h-[calc(100%-2rem)]">
                  <TaskList tasks={dayTasks} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
