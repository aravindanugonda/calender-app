import { create } from "zustand";
import { startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { Task } from "@/types";

type ViewType = "week" | "month" | "custom";

interface CalendarStore {
  currentDate: Date;
  weekStart: Date;
  weekEnd: Date;
  viewType: ViewType;
  tasks: Task[];
  searchQuery: string;
  isLoading: boolean;
  selectedTask: Task | null;
  
  setCurrentDate: (date: Date) => void;
  setViewType: (type: ViewType) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (isLoading: boolean) => void;
  setSelectedTask: (task: Task | null) => void;
  getTasksForDate: (date: Date) => Task[];
  getFilteredTasks: () => Task[];
  fetchTasks: (date: Date) => Promise<void>;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentDate: new Date(),
  weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
  weekEnd: endOfWeek(new Date(), { weekStartsOn: 1 }),
  viewType: "week",
  tasks: [],
  searchQuery: "",
  isLoading: false,
  selectedTask: null,

  setCurrentDate: (date: Date) => {
    set((state) => ({
      currentDate: date,
      weekStart: startOfWeek(date, { weekStartsOn: 1 }),
      weekEnd: endOfWeek(date, { weekStartsOn: 1 }),
    }));
    get().fetchTasks(date);
  },

  fetchTasks: async (date: Date) => {
    const store = get();
    if (store.isLoading) return;

    try {
      set({ isLoading: true });
      const startDate = startOfWeek(date, { weekStartsOn: 1 });
      const endDate = endOfWeek(date, { weekStartsOn: 1 });
      
      const url = `/api/tasks?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      console.log('Fetching tasks from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to fetch tasks: ${error.error || 'Unknown error'}`);
      }

      const fetchedTasks = await response.json();
      console.log('Fetched tasks:', fetchedTasks);
      set({ tasks: fetchedTasks, isLoading: false });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      set({ isLoading: false });
    }
  },

  setViewType: (type: ViewType) => set({ viewType: type }),

  setTasks: (tasks: Task[]) => set({ tasks }),

  addTask: async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask: Task = await response.json();
      set((state) => ({ tasks: [...state.tasks, newTask] }));
      
      // Refresh tasks for the current period
      await get().fetchTasks(get().currentDate);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error; // Re-throw to handle in the UI
    }
  },

  updateTask: async (id, updates) => {
    const state = get();
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update task');
      }

      // Update local state
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        ),
      }));

      // Refresh tasks to ensure consistency
      await get().fetchTasks(state.currentDate);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error; // Re-throw to handle in the UI
    }
  },

  deleteTask: async (id) => {
    const state = get();
    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete task');
      }

      // Update local state
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
      }));

      // Refresh tasks to ensure consistency
      await get().fetchTasks(state.currentDate);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error; // Re-throw to handle in the UI
    }
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

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  setLoading: (isLoading: boolean) => set({ isLoading }),
  
  setSelectedTask: (task: Task | null) => set({ selectedTask: task }),

  getTasksForDate: (date: Date) => {
    const state = get();
    return state.tasks.filter((task) => isSameDay(new Date(task.date), date));
  },

  getFilteredTasks: () => {
    const state = get();
    if (!state.searchQuery) return state.tasks;
    
    const query = state.searchQuery.toLowerCase();
    return state.tasks.filter((task) => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  },
}));
