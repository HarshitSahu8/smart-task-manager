"use client";
import { useEffect, useCallback } from "react";
import useTaskStore from "../store/taskStore";
import TaskList from "../components/TaskList";
import Dashboard from "../components/Dashboard";
import { supabase } from "@/utils/supabase";

export default function Home() {
  const { tasks, fetchTasks: fetchAllTaskFromStore } = useTaskStore();
  const fetchTask = useCallback(async () => {
    const user = await supabase.auth.getUser();
    if (user.data.user) fetchAllTaskFromStore(user.data.user.id);
  }, [fetchAllTaskFromStore]);

  useEffect(() => {
    fetchTask();
  }, [fetchAllTaskFromStore, fetchTask]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Dashboard />
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
