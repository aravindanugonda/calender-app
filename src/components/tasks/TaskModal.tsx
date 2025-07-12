
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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="calendar-paper w-full max-w-md mx-4 relative">
        {/* Paper binding effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-red-200 to-red-300 rounded-l-lg border-r-2 border-red-400"></div>
        <div className="absolute left-2 top-6 bottom-6 w-1 bg-red-400 rounded-full"></div>
        
        {/* Modal content */}
        <div className="pl-12 pr-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isSomedayTask ? "✨ Someday Task" : "📝 New Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task title */}
            <div>
              <input
                type="text"
                placeholder={isSomedayTask ? "What do you want to do someday? ✨" : "What needs to be done? 📋"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div>
              <textarea
                placeholder="Add a description (optional) 📝"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🎨 Choose a color
              </label>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "w-10 h-10 rounded-full border-3 transition-all shadow-sm",
                      c === color ? "border-gray-600 scale-110 shadow-lg" : "border-gray-200 hover:border-gray-400 hover:scale-105"
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            {/* Date display */}
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
              <div className="text-sm font-medium text-gray-700">
                {isSomedayTask ? (
                  <span className="flex items-center gap-2">
                    <span className="text-lg">∞</span>
                    <span>Someday / Maybe</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>📅</span>
                    <span>
                      {selectedDate?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                ✅ Add Task
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
