
import { useState } from "react";
import { Task } from "@/types";
import { TaskItem } from "./TaskItem";
import { useCalendarStore } from "@/store/calendar-store";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { updateTask, deleteTask, setTasks } = useCalendarStore();
  const [selected, setSelected] = useState<string[]>([]);

  // Batch actions
  const handleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    setSelected(tasks.map((t) => t.id));
  };
  const handleClearSelection = () => {
    setSelected([]);
  };
  const handleBulkComplete = () => {
    selected.forEach((id) => updateTask(id, { completed: true }));
    setSelected([]);
  };
  const handleBulkDelete = () => {
    selected.forEach((id) => deleteTask(id));
    setSelected([]);
  };

  // Drag & drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over?.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  return (
    <div>
      {tasks.length > 0 && (
        <div className="flex gap-2 mb-2">
          <Button size="sm" onClick={handleSelectAll}>Select All</Button>
          <Button size="sm" onClick={handleClearSelection}>Clear</Button>
          <button
            className={`px-2 py-1 rounded text-sm border bg-white ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'} text-blue-700`}
            onClick={handleBulkComplete}
            disabled={selected.length === 0}
            type="button"
          >
            Complete
          </button>
          <button
            className={`px-2 py-1 rounded text-sm border bg-white ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'} text-red-700`}
            onClick={handleBulkDelete}
            disabled={selected.length === 0}
            type="button"
          >
            Delete
          </button>
          <span className="text-xs">{selected.length} selected</span>
        </div>
      )}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(task.id)}
                onChange={() => handleSelect(task.id)}
                className="accent-blue-500"
              />
              <TaskItem task={task} />
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
