import { create } from "zustand";
import { Task, CalendarState } from "@/types";
// Removed unused imports

interface CalendarStore extends CalendarState {
  setCurrentDate: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setViewMode: (mode: "week" | "month") => void;
  setLoading: (loading: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  currentDate: new Date(),
  selectedDate: new Date(),
  tasks: [],
  viewMode: "week",
  isLoading: false,


  setCurrentDate: (date) => set({ currentDate: date }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setTasks: (tasks) => set({ tasks }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setLoading: (loading) => set({ isLoading: loading }),

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  toggleTaskComplete: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
}));
