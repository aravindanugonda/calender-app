
import { useCalendarStore } from "@/store/calendar-store";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, format } from "date-fns";
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

  return (
    <div className="grid grid-cols-7 gap-1 h-full">
      {days.map((day) => {
        const dayTasks = getTasksForDate(day);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, currentDate);
        return (
          <div
            key={day.toISOString()}
            className={cn(
              "border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[100px] flex flex-col",
              isToday && "ring-2 ring-blue-500",
              !isCurrentMonth && "bg-gray-50 text-gray-400"
            )}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={cn("text-xs font-semibold", isToday && "text-blue-600")}>{format(day, "d")}</span>
            </div>
            <TaskList tasks={dayTasks} />
          </div>
        );
      })}
    </div>
  );
}
