import { supabase } from "./supabase";

export interface Task {
  id: string | null;
  user_id: string;
  title: string;
  description: string;
  due_date: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
}

// Fetch all tasks for the current user
export const getTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true });
  if (error) {
    throw error;
  }
  return data;
};

// Create a new task
export const createTask = async (task: Omit<Task, "id">) => {
  const { data, error } = await supabase.from("tasks").insert([task]);
  if (error) {
    throw error;
  }
  return data;
};

// Update an existing task
export const updateTask = async (id: string, task: Partial<Task>) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

// Delete a task
export const deleteTask = async (id: string) => {
  const { data, error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const getTaskById = async (userId: string, taskId: string) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data[0];
};

export const updateTaskById = async (
  userId: string,
  taskId: string,
  task: Partial<Task>
) => {
  const { data, error } = await supabase
    .from("tasks")
    .update(task)
    .eq("id", taskId)
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data;
};
