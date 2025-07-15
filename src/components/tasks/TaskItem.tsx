"use client";

import { useState } from "react";
import { Task } from "@/types";
import { useCalendarStore } from "@/store/calendar-store";
import { cn } from "@/lib/utils";
import { taskColors } from "@/lib/colors";
import { Pencil, Circle, CheckCircle2 } from "lucide-react";
import { TaskModal } from "./TaskModal";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskComplete } = useCalendarStore();
  const [showEditModal, setShowEditModal] = useState(false);
  
  const color = taskColors[task.color as keyof typeof taskColors] || taskColors.default;

  return (
    <>
      <div 
        className={cn(
          "group px-3 py-2 sm:py-2 rounded-lg transition-all",
          "hover:shadow-sm hover:translate-y-[-1px]",
          task.completed && "opacity-75"
        )}
        style={{ 
          backgroundColor: color.bg,
          borderLeft: `3px solid ${color.border}`
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTaskComplete(task.id);
            }}
            className="shrink-0 focus:outline-none min-w-[32px] min-h-[32px] sm:min-w-0 sm:min-h-0 flex items-center justify-center rounded"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 sm:w-5 sm:h-5 text-blue-500" />
            ) : (
              <Circle className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </button>

          {/* Task title */}
          <span
            onClick={(e) => {
              e.stopPropagation();
              setShowEditModal(true);
            }}
            className={cn(
              "flex-1 text-sm sm:text-sm transition-colors cursor-pointer py-2 sm:py-0",
              task.completed ? "line-through text-gray-500" : `text-${color.text}`
            )}
          >
            {task.title}
          </span>

          {/* Edit button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditModal(true);
            }}
            className="shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-2 sm:p-1 hover:bg-black/5 rounded min-w-[32px] min-h-[32px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
          >
            <Pencil className="w-4 h-4 sm:w-4 sm:h-4 text-gray-400" />
          </button>
        </div>

        {/* Description preview */}
        {task.description && (
          <div className="mt-1 text-xs sm:text-xs text-gray-500 pl-8 sm:pl-7">
            {task.description.length > 60
              ? task.description.slice(0, 60) + '...'
              : task.description}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedDate={new Date(task.date)}
        task={task}
        mode="edit"
      />
    </>
  );
}
