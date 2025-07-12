import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useCalendarStore } from "@/store/calendar-store";

export function MonthView() {
  const { currentDate } = useCalendarStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="h-full">
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((date) => (
          <div 
            key={date.toString()} 
            className={`min-h-[100px] p-2 bg-white ${
              isSameDay(date, currentDate) ? "bg-blue-50" : ""
            }`}
          >
            <div className="text-sm text-gray-500">
              {format(date, "d")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
