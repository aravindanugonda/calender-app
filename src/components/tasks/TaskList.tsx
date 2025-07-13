import { Task } from "@/types";
import { TaskItem } from "./TaskItem";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {tasks
        .sort((a, b) => a.position - b.position)
        .map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
    </div>
  );
}
