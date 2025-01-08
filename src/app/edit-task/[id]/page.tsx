"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task, getTaskById, updateTaskById } from "@/utils/api";
import useUserStore from "@/store/userStore";
import TaskForm from "@/components/TaskForm";
import useTaskStore from "@/store/taskStore";

export default function Page({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;
  const { user } = useUserStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [initialData, setInitialData] = useState<Task | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      if (!user) {
        console.error("User not found");
        return;
      }
      const task = await getTaskById(user.id, id);
      setInitialData(task);
    };
    fetchTask();
  }, [id, user]);

  useEffect(() => {
    if (!user) {
      console.error("User not found");
      return;
    }
    fetchTasks(user.id);
  }, [fetchTasks, user]);

  const handleUpdate = async (task: Task) => {
    if (!user) {
      console.error("User not found");
      return;
    }
    await updateTaskById(user.id, id, task);
    fetchTasks(user.id);
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="flex">
        <div className="w-2/3 p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back
            </button>
          </div>
          {initialData ? (
            <TaskForm initialData={initialData} onSubmit={handleUpdate} />
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="w-1/3 pl-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            All Tasks
          </h3>
          <div className="space-y-3 overflow-auto max-h-[600px]">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg shadow ${
                    task.completed ? "bg-green-100" : "bg-white"
                  }`}
                >
                  <h4 className="text-md font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <button
                    onClick={() => router.push(`/edit-task/${task.id}`)}
                    className="text-blue-500 text-sm hover:underline mt-2"
                  >
                    Edit Task
                  </button>
                </div>
              ))
            ) : (
              <p>No tasks available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
