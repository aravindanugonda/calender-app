import { create } from "zustand";
import { startOfWeek, endOfWeek } from "date-fns";

type ViewType = "week" | "month";

interface CalendarStore {
  currentDate: Date;
  weekStart: Date;
  weekEnd: Date;
  viewType: ViewType;
  setCurrentDate: (date: Date) => void;
  setViewType: (type: ViewType) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  currentDate: new Date(),
  weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }),
  weekEnd: endOfWeek(new Date(), { weekStartsOn: 1 }),
  viewType: "week",
  setCurrentDate: (date: Date) =>
    set((state) => ({
      currentDate: date,
      weekStart: startOfWeek(date, { weekStartsOn: 1 }),
      weekEnd: endOfWeek(date, { weekStartsOn: 1 }),
    })),
  setViewType: (type: ViewType) => set({ viewType: type }),
}));
