"use client";
import { useRouter } from "next/navigation";
import useTaskStore from "../store/taskStore";
import { Task } from "../utils/api";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const removeTask = useTaskStore((state) => state.removeTask);

  const handleDelete = () => {
    if (task.id) {
      removeTask(task.id);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow">
      <h3 className="text-xl">{task.title}</h3>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Due: {task.due_date}</p>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => router.push(`/edit-task/${task.id}`)}
          className="btn btn-primary"
        >
          Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
}
