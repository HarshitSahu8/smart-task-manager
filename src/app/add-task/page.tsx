"use client";
import TaskForm from "@/components/TaskForm";
import { Task, getTasks, createTask } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskList from "@/components/TaskList";
import useUserStore from "@/store/userStore";

const AddTask = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks from the API on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        try {
          const fetchedTasks = await getTasks(user.id);
          setTasks(fetchedTasks);
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      }
    };

    fetchTasks();
  }, [user]);

  // Handle adding a new task and refreshing the list
  const handleAddTask = async (task: Task) => {
    if (user) {
      try {
        await createTask(task);
        // Fetch updated tasks after adding the new task
        const updatedTasks = await getTasks(user.id);
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 mt-4">
      {/* Back Button */}
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

      {/* Two-column layout: TaskForm on the left, TaskList on the right */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* TaskForm Section (50% width, non-scrollable) */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Add New Task
          </h2>
          <TaskForm onSubmit={handleAddTask} />
        </div>

        {/* TaskList Section (50% width, scrollable) */}
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
