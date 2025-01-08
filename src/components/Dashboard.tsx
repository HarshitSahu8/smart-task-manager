"use client";
import { useEffect, useState } from "react";
import { Task } from "@/utils/api";
import useTaskStore from "@/store/taskStore";
import useUserStore from "@/store/userStore";
import { signOut } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { fetchTasks, tasks: tasksState } = useTaskStore();
  const { user, setUser } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllTask = async () => {
      try {
        if (!user) {
          router.push("/login");
          return;
        }
        fetchTasks(user.id);
        setTasks(tasksState);
        setLoading(false);
      } catch (error: unknown) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTask();
  }, [user]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Total Tasks</h3>
          <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-green-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            Completed Tasks
          </h3>
          <p className="text-2xl font-bold text-green-800">{completedTasks}</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-yellow-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Pending Tasks</h3>
          <p className="text-2xl font-bold text-yellow-800">{pendingTasks}</p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            signOut().then(() => {
              setUser(null);
              router.push("/login");
            });
          }}
          className="w-48 py-3 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>

        <button
          onClick={() => router.push("/add-task")}
          className="w-48 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </div>
  );
}
