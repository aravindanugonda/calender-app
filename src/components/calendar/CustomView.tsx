"use client";

import { useState, useEffect } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { format, parseISO } from "date-fns";
import { TaskItem } from "../tasks/TaskItem";
import { Search, Calendar as CalendarIcon } from "lucide-react";

export function CustomView() {
  const { setSearchQuery, getFilteredTasks, searchQuery } = useCalendarStore();
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(debouncedQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedQuery, setSearchQuery]);

  const filteredTasks = getFilteredTasks();
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = format(parseISO(task.date), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, typeof filteredTasks>);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Search header */}
      <div className="p-4 bg-white border-b shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={debouncedQuery}
            onChange={(e) => setDebouncedQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groupedTasks).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {debouncedQuery ? "No tasks found" : "Start typing to search tasks"}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTasks)
              .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
              .map(([date, tasks]) => (
                <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 border-b flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium text-gray-700">
                      {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                    </h3>
                    <span className="text-sm text-gray-500 ml-2">
                      ({tasks.length} {tasks.length === 1 ? "task" : "tasks"})
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {tasks.map((task) => (
                      <div key={task.id} className="p-2">
                        <TaskItem task={task} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
