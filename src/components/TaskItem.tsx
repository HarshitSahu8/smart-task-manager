"use client";
import { useRouter } from "next/navigation";
import useTaskStore from "../store/taskStore";
import { Task } from "../utils/api";
import useUserStore from "@/store/userStore";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: Readonly<TaskItemProps>) {
  const router = useRouter();
  const { user } = useUserStore();
  const { toggleTaskCompletion } = useTaskStore();
  const removeTask = useTaskStore((state) => state.removeTask);

  const handleDelete = () => {
    if (task.id) {
      removeTask(task.id);
    }
  };

  const handleTaskCompletion = (id: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    toggleTaskCompletion(id, user.id);
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg shadow-md bg-white text-gray-900 mb-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-blue-600">{task.title}</h3>
          <p className="text-gray-600 mb-3">{task.description}</p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Priority: </span>
            <span
              className={`${
                task.priority === "High"
                  ? "text-red-500"
                  : task.priority === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              } font-medium`}
            >
              {task.priority}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Due Date: </span>
            {new Date(task.due_date).toLocaleDateString()}
          </p>
        </div>
        <div
          className={`${
            task.completed ? "text-green-500" : "text-red-500"
          } font-bold text-sm`}
        >
          {task.completed ? "Completed" : "Pending"}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={() => router.push(`/edit-task/${task.id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md shadow"
        >
          Delete
        </button>
        <button
          onClick={() => handleTaskCompletion(task.id as string)}
          className={`${
            task.completed
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white font-semibold px-4 py-2 rounded-md shadow`}
        >
          {task.completed ? "Mark as Uncompleted" : "Mark as Completed"}
        </button>
      </div>
    </div>
  );
}
