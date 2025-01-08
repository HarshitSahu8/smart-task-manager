"use client";
import TaskForm from "@/components/TaskForm";
import { Task } from "@/utils/api";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskList from "@/components/TaskList";
import useUserStore from "@/store/userStore";
import useTaskStore from "@/store/taskStore";

const AddTask = () => {
  const { user } = useUserStore();
  const { tasks, fetchTasks, addTask } = useTaskStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchTasks(user.id);
  }, [fetchTasks, router, user]);

  const handleAddTask = async (task: Task) => {
    if (user) {
      try {
        await addTask(task);
        fetchTasks(user.id);
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 mt-4">
      <div className="flex justify-start mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Add New Task
          </h2>
          <TaskForm onSubmit={handleAddTask} />
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Task List</h2>
          <div className="max-h-[500px] overflow-y-scroll">
            <TaskList tasks={tasks} noHeading />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
