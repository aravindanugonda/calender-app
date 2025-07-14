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

export function isRecurringTaskDue(task: Task, currentDate: Date): boolean {
  if (!task.isRecurring || !task.recurringPattern) {
    return false;
  }

  const taskDate = new Date(task.date);
  const pattern = task.recurringPattern;

  // Check if the task is due today based on its recurring pattern
  switch (pattern.type) {
    case "daily":
      return true; // Daily tasks are always due
    case "weekly":
      return taskDate.getDay() === currentDate.getDay();
    case "monthly":
      return taskDate.getDate() === currentDate.getDate();
    default:
      return false;
  }
}

export function getNextRecurringDate(task: Task): Date | null {
  if (!task.isRecurring || !task.recurringPattern) {
    return null;
  }

  const taskDate = new Date(task.date);
  const pattern = task.recurringPattern;

  switch (pattern.type) {
    case "daily":
      return addDays(taskDate, pattern.interval);
    case "weekly":
      return addWeeks(taskDate, pattern.interval);
    case "monthly":
      return addMonths(taskDate, pattern.interval);
    default:
      return null;
  }
}