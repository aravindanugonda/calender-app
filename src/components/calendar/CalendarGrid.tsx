"use client";

import { useState, useEffect, useCallback } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import { CustomView } from "./CustomView";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { CalendarHeader } from "./CalendarHeader";
import { TaskModal } from "../tasks/TaskModal";
import { Loading } from "@/components/ui/loading";
import { Toast } from "@/components/ui/toast";

interface ErrorResponse {
  error: string;
}

interface Session {
  user?: {
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export function CalendarGrid({ session }: { session?: Session }) {
  const { viewType, currentDate, setTasks, setLoading, isLoading } = useCalendarStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Add date range to the query
      const startDate = viewType === 'week'
        ? startOfWeek(currentDate, { weekStartsOn: 1 }).toISOString()
        : startOfMonth(currentDate).toISOString();
      
      const endDate = viewType === 'week'
        ? endOfWeek(currentDate, { weekStartsOn: 1 }).toISOString()
        : endOfMonth(currentDate).toISOString();

      const response = await fetch(`/api/tasks?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse;
        throw new Error(errorData.error || 'Failed to load tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error: unknown) {
      console.error("Error loading tasks:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  }, [currentDate, setTasks, viewType, setLoading]);

  useEffect(() => {
    if (session) {
      loadTasks();
    } else {
      setTasks([]);
      setError(null); 
    }
  }, [currentDate, viewType, loadTasks, session, setTasks]);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 text-lg font-semibold mb-4">You are not authorized. Please log in.</div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          onClick={() => {
            window.location.href = "/auth/login?returnTo=/dashboard";
          }}
        >
          Log in
        </button>
      </div>
    );
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {session && <CalendarHeader />}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden p-4">
          {viewType === "week" && (
            <WeekView onDateClick={handleDateClick} />
          )}
          {viewType === "month" && (
            <MonthView onDateClick={handleDateClick} />
          )}
          {viewType === "custom" && (
            <CustomView />
          )}
        </div>
      )}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedDate(null);
        }}
        selectedDate={selectedDate}
      />
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
