"use client";

import { useState, useEffect, useCallback } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { TaskModal } from "../tasks/TaskModal";
import { Loading } from "@/components/ui/loading";
import { Toast } from "@/components/ui/toast";
import { Task } from "@/types";

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
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
    if (session?.user) {
      loadTasks();
    } else {
      setTasks([]);
      setError(null); 
    }
  }, [currentDate, viewType, loadTasks, session, setTasks]);

  // Listen for custom events to open task modal
  useEffect(() => {
    const handleOpenTaskModal = (event: CustomEvent) => {
      const { task, mode } = event.detail;
      setSelectedTask(task);
      setSelectedDate(new Date(task.date));
      setModalMode(mode);
      setIsTaskModalOpen(true);
    };

    window.addEventListener('openTaskModal', handleOpenTaskModal as EventListener);
    return () => {
      window.removeEventListener('openTaskModal', handleOpenTaskModal as EventListener);
    };
  }, []);

  if (!session?.user) {
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
    setSelectedTask(null);
    setModalMode('create');
    setIsTaskModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white">
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
        </div>
      )}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedDate(null);
          setSelectedTask(null);
          setModalMode('create');
        }}
        selectedDate={selectedDate}
        task={selectedTask || undefined}
        mode={modalMode}
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
