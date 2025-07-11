
import { useState } from "react";
import { useCalendarStore } from "@/store/calendar-store";
import { RecurringPattern, Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const COLORS = ["#60a5fa", "#f87171", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"];
const PRIORITIES = ["Low", "Medium", "High"];

export function TaskModal({ isOpen, onClose, selectedDate }: { isOpen: boolean; onClose: () => void; selectedDate: Date | null }) {
  const { addTask } = useCalendarStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [priority, setPriority] = useState(PRIORITIES[1]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<RecurringPattern["type"]>("daily");
  const [recurringInterval, setRecurringInterval] = useState(1);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, subtaskInput.trim()]);
      setSubtaskInput("");
    }
  };

  const handleRemoveSubtask = (idx: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedDate) return;
    const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      userId: "demo", // Replace with actual user
      title,
      description,
      date: selectedDate.toISOString(),
      completed: false,
      color,
      position: 0,
      parentTaskId: undefined,
      isRecurring,
      recurringPattern: isRecurring
        ? {
            type: recurringType,
            interval: recurringInterval,
          }
        : undefined,
      subtasks: subtasks.map((st) => ({
        id: "",
        userId: "demo",
        title: st,
        date: selectedDate.toISOString(),
        completed: false,
        color,
        position: 0,
        parentTaskId: undefined,
        isRecurring: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    };
    addTask(newTask);
    onClose();
    setTitle("");
    setDescription("");
    setColor(COLORS[0]);
    setPriority(PRIORITIES[1]);
    setIsRecurring(false);
    setRecurringType("daily");
    setRecurringInterval(1);
    setSubtasks([]);
    setSubtaskInput("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="text-lg font-bold mb-2">Add Task for {selectedDate?.toDateString() || "No date"}</div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <div className="flex gap-2 items-center">
            <span>Color:</span>
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={cn("w-5 h-5 rounded-full border", c === color && "ring-2 ring-blue-500")}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span>Priority:</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border rounded px-2 py-1">
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <Checkbox checked={isRecurring} onCheckedChange={() => setIsRecurring(!isRecurring)} />
            <span>Recurring</span>
            {isRecurring && (
              <>
                <select value={recurringType} onChange={(e) => setRecurringType(e.target.value as RecurringPattern["type"])} className="border rounded px-2 py-1">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input
                  type="number"
                  min={1}
                  value={recurringInterval}
                  onChange={(e) => setRecurringInterval(Number(e.target.value))}
                  className="border rounded px-2 py-1 w-16"
                />
              </>
            )}
          </div>
          <div>
            <div className="font-semibold mb-1">Subtasks</div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add subtask"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
          <Button size="sm" onClick={handleAddSubtask}>Add</Button>
            </div>
            <ul className="list-disc ml-5">
              {subtasks.map((st, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span>{st}</span>
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveSubtask(idx)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded bg-blue-600 text-white" type="submit">Add Task</button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
