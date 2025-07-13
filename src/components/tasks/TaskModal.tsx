"use client";

import { useState } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { taskColors, type TaskColorKey } from "@/lib/colors";
import { X, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useUser } from "@auth0/nextjs-auth0";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  task?: Task;
  mode?: 'create' | 'edit';
}

export function TaskModal({ isOpen, onClose, selectedDate, task, mode = 'create' }: TaskModalProps) {
  const { addTask, updateTask, deleteTask } = useCalendarStore();
  const { user, isLoading: isLoadingUser } = useUser();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [colorKey, setColorKey] = useState<TaskColorKey>(task?.color as TaskColorKey || 'default');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSomedayTask = selectedDate?.getTime() === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedDate) return;

    setIsSubmitting(true);
    setError(null);

    if (!user?.sub) {
      setError('User not authenticated');
      return;
    }

    const taskData = {
      userId: task?.userId || user.sub, // Keep existing userId for updates, use user.sub for new tasks
      title: title.trim(),
      description,
      date: selectedDate.toISOString(),
      completed: task?.completed ?? false,
      color: colorKey,
      position: task?.position ?? Date.now(),
      parentTaskId: task?.parentTaskId,
      isRecurring: task?.isRecurring ?? false,
      recurringPattern: task?.recurringPattern,
      subtasks: task?.subtasks ?? [],
    };

    try {
      if (mode === 'edit' && task) {
        await updateTask(task.id, taskData);
      } else {
        await addTask(taskData);
      }
      onClose();
    } catch (err) {
      setError('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await deleteTask(task.id);
      onClose();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50 backdrop-blur-[2px]">
      <div 
        className="w-full max-w-lg mx-4 bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            {/* Quick title input */}
            <div>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-lg bg-transparent border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors"
                autoFocus
                required
              />
            </div>

            {/* Date display */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                {isSomedayTask ? "Someday" : format(selectedDate!, 'EEEE, MMMM d, yyyy')}
              </span>
            </div>

            {/* Color picker */}
            <div className="border-t border-b border-gray-100 py-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(taskColors).map(([key, color]) => (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded transition-all",
                      colorKey === key ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"
                    )}
                    style={{ 
                      backgroundColor: color.bg,
                      borderColor: color.border,
                      borderWidth: '2px'
                    }}
                    onClick={() => setColorKey(key as TaskColorKey)}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <textarea
                placeholder="Add details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500/10 min-h-[100px] text-sm"
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {error && (
              <div className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-end gap-3">
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>

        {/* Delete confirmation */}
        {showConfirmDelete && (
          <div className="absolute inset-0 bg-white p-6 flex flex-col items-center justify-center text-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h3 className="text-lg font-semibold">Delete Task?</h3>
            <p className="text-gray-500 max-w-sm">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
