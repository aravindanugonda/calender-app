export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  color: string;
  position: number;
  parentTaskId?: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  subtasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface RecurringPattern {
  type: "daily" | "weekly" | "monthly";
  interval: number;
  endDate?: string;
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date;
  tasks: Task[];
  viewMode: "week" | "month";
  isLoading: boolean;
}

export interface User {
  id: string;
  auth0Id: string;
  email: string;
  name: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
