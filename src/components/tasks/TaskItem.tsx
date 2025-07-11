"use client";

import { useState } from "react";
import { Task } from "@/types";
import { useCalendarStore } from "@/store/calendar-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  level?: number;
}

export function TaskItem({ task, level = 0 }: TaskItemProps) {
  const { toggleTaskComplete, updateTask } = useCalendarStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);


  const [subtaskInput, setSubtaskInput] = useState("");

  const handleComplete = () => {
    toggleTaskComplete(task.id);
  };

  const handleEdit = () => {
    if (isEditing) {
      updateTask(task.id, { title: editTitle });
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

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      const newSubtask = {
        ...task,
        id: crypto.randomUUID(),
        title: subtaskInput.trim(),
        parentTaskId: task.id,
        subtasks: [],
      };
      updateTask(task.id, {
        subtasks: [...(task.subtasks || []), newSubtask],
      });
      setSubtaskInput("");
    }
  };

  return (
    <div className={cn("group", level > 0 && "ml-6")}> 
      <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleComplete}
          className="shrink-0"
        />
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: task.color }}
        />
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={handleKeyPress}
            className="flex-1 px-1 py-0.5 text-sm border rounded"
            autoFocus
          />
        ) : (
          <span
            className={cn(
              "flex-1 text-sm cursor-pointer",
              task.completed && "line-through text-gray-500"
            )}
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </span>
        )}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <input
            type="text"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            placeholder="Add subtask"
            className="border rounded px-1 py-0.5 text-xs w-24"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubtask();
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddSubtask}
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* More options */}}
          >
            <MoreHorizontal className="w-3 h-3" />
          </Button>
        </div>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-1">
          {task.subtasks.map((subtask) => (
            <TaskItem key={subtask.id} task={subtask} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
