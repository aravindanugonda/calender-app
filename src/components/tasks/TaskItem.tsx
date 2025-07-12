"use client";

import { useState } from "react";
import { Task } from "@/types";
import { useCalendarStore } from "@/store/calendar-store";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskComplete, updateTask, deleteTask } = useCalendarStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleComplete = () => {
    toggleTaskComplete(task.id);
  };

  const handleEdit = () => {
    if (isEditing) {
      if (editTitle.trim() === "") {
        deleteTask(task.id);
      } else {
        updateTask(task.id, { title: editTitle.trim() });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    }
    if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  // Extract emoji/sticker from the beginning of title
  const getTaskDisplay = (title: string) => {
    const emojiRegex = /^(\p{Emoji}|\p{Extended_Pictographic})\s*/u;
    const match = title.match(emojiRegex);
    
    if (match) {
      return {
        sticker: match[0].trim(),
        text: title.replace(emojiRegex, "").trim()
      };
    }
    
    return { sticker: null, text: title };
  };

  const { sticker, text } = getTaskDisplay(task.title);

  return (
    <div
      className={cn(
        "group tweek-task rounded-md p-2 mb-1 cursor-pointer transition-all duration-200",
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
        >
          <GripVertical className="w-3 h-3 text-gray-400" />
        </button>

        {/* Checkbox */}
        <button
          onClick={handleComplete}
          className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200",
            task.completed
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300 hover:border-blue-400"
          )}
        >
          {task.completed && (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 flex items-center gap-2">
          {/* Color indicator */}
          {task.color && (
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: task.color }}
            />
          )}

          {/* Sticker/emoji */}
          {sticker && (
            <span className="tweek-sticker text-sm">{sticker}</span>
          )}

          {/* Task text */}
          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className="flex-1 px-1 py-0.5 text-sm bg-transparent border-none outline-none focus:ring-0"
              autoFocus
              placeholder="What needs to be done?"
            />
          ) : (
            <span
              className={cn(
                "flex-1 text-sm cursor-text select-none",
                task.completed && "line-through text-gray-500"
              )}
              onClick={() => setIsEditing(true)}
            >
              {text || "What needs to be done?"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
