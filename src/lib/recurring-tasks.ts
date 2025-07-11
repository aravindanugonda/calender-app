import { Task, RecurringPattern } from "@/types";
import { addDays, addWeeks, addMonths, isBefore, format } from "date-fns";

export function generateRecurringTasks(
  baseTask: Task,
  pattern: RecurringPattern,
  startDate: Date,
  endDate: Date
): Task[] {
  const tasks: Task[] = [];
  let currentDate = new Date(baseTask.date);

  while (isBefore(currentDate, endDate)) {
    if (!isBefore(currentDate, startDate)) {
      const newTask: Task = {
        ...baseTask,
        id: `${baseTask.id}-${format(currentDate, "yyyy-MM-dd")}`,
        date: format(currentDate, "yyyy-MM-dd"),
        completed: false,
      };
      tasks.push(newTask);
    }

    switch (pattern.type) {
      case "daily":
        currentDate = addDays(currentDate, pattern.interval);
        break;
      case "weekly":
        currentDate = addWeeks(currentDate, pattern.interval);
        break;
      case "monthly":
        currentDate = addMonths(currentDate, pattern.interval);
        break;
    }

    if (pattern.endDate && isBefore(new Date(pattern.endDate), currentDate)) {
      break;
    }
  }

  return tasks;
}
