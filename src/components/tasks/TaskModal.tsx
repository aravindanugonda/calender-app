
import { useState } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const COLORS = ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"];

export function TaskModal({ isOpen, onClose, selectedDate }: { isOpen: boolean; onClose: () => void; selectedDate: Date | null }) {
  const { addTask } = useCalendarStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  if (!isOpen) return null;

  const isSomedayTask = selectedDate && selectedDate.getTime() === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedDate) return;
    
    const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      userId: "demo", // Replace with actual user
      title: title.trim(),
      description,
      date: selectedDate.toISOString(),
      completed: false,
      color,
      position: Date.now(), // Simple position based on creation time
      parentTaskId: undefined,
      isRecurring: false,
      recurringPattern: undefined,
      subtasks: [],
    };
    
    addTask(newTask);
    onClose();
    setTitle("");
    setDescription("");
    setColor(COLORS[0]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">
            {isSomedayTask ? "Add Someday Task" : "Add Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Task title */}
            <div>
              <input
                type="text"
                placeholder={isSomedayTask ? "What do you want to do someday?" : "What needs to be done?"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div>
              <textarea
                placeholder="Add a description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      c === color ? "border-gray-400 scale-110" : "border-gray-200 hover:border-gray-300"
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            {/* Date display */}
            <div className="text-sm text-gray-500">
              {isSomedayTask ? (
                <span className="flex items-center gap-1">
                  <span>∞</span>
                  Someday
                </span>
              ) : (
                selectedDate?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
