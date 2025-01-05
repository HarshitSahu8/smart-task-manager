"use client";
import { useEffect, useCallback } from "react";
import useTaskStore from "../store/taskStore";
import TaskList from "../components/TaskList";
import Dashboard from "../components/Dashboard";
import { supabase } from "@/utils/supabase";
import TaskForm from "@/components/TaskForm";
import { Task } from "@/utils/api";

export default function Home() {
  const { tasks, fetchTasks: fetchAllTaskFromStore, addTask } = useTaskStore();
  // Fetch tasks when the component mounts
  const fetchTask = useCallback(async () => {
    const user = await supabase.auth.getUser();
    if (user.data.user) fetchAllTaskFromStore(user.data.user.id);
  }, [fetchAllTaskFromStore]);

  useEffect(() => {
    fetchTask();
  }, [fetchAllTaskFromStore, fetchTask]);

  const handleAddTask = async (task: Task) => {
    console.log("Task:", task);

    await addTask(task);
    fetchTask();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Dashboard />

        <TaskList tasks={tasks} />

        <div className="mt-12">
          <TaskForm onSubmit={handleAddTask} />
        </div>
      </div>
    </div>
  );
}
