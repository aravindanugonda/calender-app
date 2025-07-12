"use client";

import { format, isSameDay, eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isToday } from "date-fns";
import { useCalendarStore } from "@/store/calendar-store";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  date: Date | null;
  completed: boolean;
}

export const CalendarGrid = () => {
  const { currentDate, viewType } = useCalendarStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Get weekday tasks (Monday-Friday)
  const weekdayTasks = tasks.filter(task => {
    if (!task.date) return false;
    const day = task.date.getDay();
    return day >= 1 && day <= 5;
  });

  // Get weekend tasks (Saturday-Sunday)
  const weekendTasks = tasks.filter(task => {
    if (!task.date) return false;
    const day = task.date.getDay();
    return day === 0 || day === 6;
  });

  // Get someday tasks (no date)
  const somedayTasks = tasks.filter(task => !task.date);

  const handleAddTask = (date: Date | null) => {
    if (!newTask.trim()) return;

    const task: Task = {
      id: Math.random().toString(),
      title: newTask,
      date,
      completed: false
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  if (viewType === 'week') {
    return (
      <div className="h-full grid grid-cols-1 gap-6">
        {/* Weekday Section (Monday-Friday) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">This Week</h2>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => {
              const date = new Date(currentDate);
              date.setDate(date.getDate() - date.getDay() + index + 1);
              
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-24 pt-2 ${isToday(date) ? 'text-blue-600 font-semibold' : ''}`}>
                    <div className="text-sm">{format(date, "EEEE")}</div>
                    <div className="text-sm text-gray-400">{format(date, "MMM d")}</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {weekdayTasks
                        .filter(task => task.date && isSameDay(task.date, date))
                        .map(task => (
                          <div key={task.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTaskCompletion(task.id)}
                              className="rounded border-gray-300"
                            />
                            <span className={task.completed ? "line-through text-gray-400" : ""}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTask(date)}
                      className="mt-2 w-full p-2 text-sm border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekend Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Weekend</h2>
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, index) => {
              const date = new Date(currentDate);
              date.setDate(date.getDate() - date.getDay() + index + 6);
              
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-24 pt-2 ${isToday(date) ? 'text-blue-600 font-semibold' : ''}`}>
                    <div className="text-sm">{format(date, "EEEE")}</div>
                    <div className="text-sm text-gray-400">{format(date, "MMM d")}</div>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      {weekendTasks
                        .filter(task => task.date && isSameDay(task.date, date))
                        .map(task => (
                          <div key={task.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTaskCompletion(task.id)}
                              className="rounded border-gray-300"
                            />
                            <span className={task.completed ? "line-through text-gray-400" : ""}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTask(date)}
                      className="mt-2 w-full p-2 text-sm border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Someday Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Someday</h2>
          <div className="space-y-2">
            {somedayTasks.map(task => (
              <div key={task.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="rounded border-gray-300"
                />
                <span className={task.completed ? "line-through text-gray-400" : ""}>
                  {task.title}
                </span>
              </div>
            ))}
            <input
              type="text"
              placeholder="Add a task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTask(null)}
              className="mt-2 w-full p-2 text-sm border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0"
            />
          </div>
        </div>
      </div>
    );
  }

  // Month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="h-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px mb-px">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="p-2 text-sm text-gray-500 text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map(date => {
          const dayTasks = tasks.filter(task => task.date && isSameDay(task.date, date));
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          
          return (
            <div 
              key={date.toString()} 
              className={`min-h-[100px] p-2 bg-white ${
                !isCurrentMonth ? 'text-gray-400' : ''
              } ${isToday(date) ? 'bg-blue-50' : ''}`}
            >
              <div className="text-sm mb-1">
                {format(date, "d")}
              </div>
              <div className="space-y-1">
                {dayTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="w-3 h-3 rounded border-gray-300"
                    />
                    <span className={task.completed ? "line-through text-gray-400" : ""}>
                      {task.title}
                    </span>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="+"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTask(date)}
                  className="w-full text-sm border-0 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-0"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
