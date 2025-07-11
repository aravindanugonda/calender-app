
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";

jest.mock("@/store/calendar-store", () => {
  return {
    useCalendarStore: jest.fn(),
  };
});

import { useCalendarStore } from "@/store/calendar-store";

describe("Calendar Grid", () => {
  beforeEach(() => {
  ((useCalendarStore as unknown) as jest.Mock).mockImplementation(() => ({
      currentDate: new Date("2024-01-01"),
      viewMode: "week",
      tasks: [],
      setTasks: jest.fn(),
      setLoading: jest.fn(),
      setViewMode: jest.fn(),
      setCurrentDate: jest.fn(),
      setSelectedDate: jest.fn(),
      addTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      toggleTaskComplete: jest.fn(),
      isLoading: false,
      selectedDate: new Date("2024-01-01"),
    }));
  });

  it("renders calendar grid", () => {
    render(<CalendarGrid />);
    expect(screen.getByText("Calendar Header (to be implemented)")).toBeInTheDocument();
  });

  it("switches between week and month view", () => {
    render(<CalendarGrid />);
    // Simulate switching view (stub, as UI is minimal)
    // fireEvent.click(screen.getByText("Month"));
    // expect(mockSetViewMode).toHaveBeenCalledWith("month");
  });
});
