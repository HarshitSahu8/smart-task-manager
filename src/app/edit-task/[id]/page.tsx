"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task, getTaskById, updateTaskById, getTasks } from "@/utils/api"; // Add getAllTasks to fetch task list
import useUserStore from "@/store/userStore";
import TaskForm from "@/components/TaskForm";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user } = useUserStore();
  const [initialData, setInitialData] = useState<Task | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]); // State to store all tasks
  const router = useRouter(); // For navigation

  // Fetch task by ID
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

  // Fetch all tasks for displaying on the right side
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const tasks = await getTasks(user.id);
      setAllTasks(tasks);
    };
    fetchTasks();
  }, [user]);

  // Handle update of the task
  const handleUpdate = async (task: Task) => {
    if (!user) {
      console.error("User not found");
      return;
    }
    await updateTaskById(user.id, id, task);
  };

  // UI Structure
  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="flex">
        {/* Left Column: Edit Task Form */}
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

        {/* Right Column: Task List */}
        <div className="w-1/3 pl-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            All Tasks
          </h3>
          <div className="space-y-3 overflow-auto max-h-[600px]">
            {allTasks.length > 0 ? (
              allTasks.map((task) => (
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
