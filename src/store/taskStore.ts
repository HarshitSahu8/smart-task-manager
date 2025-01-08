import { create } from "zustand";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  Task,
  getTaskById,
} from "../utils/api";

interface TaskStoreState {
  tasks: Task[];
  fetchTasks: (userId: string) => Promise<void>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  editTask: (id: string, task: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string, user_id: string) => Promise<void>;
}

const useTaskStore = create<TaskStoreState>((set) => ({
  tasks: [],
  fetchTasks: async (userId) => {
    const data = await getTasks(userId);
    set({ tasks: data });
  },
  addTask: async (task) => {
    const newTask = await createTask(task);
    if (newTask) {
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    }
  },
  editTask: async (id, task) => {
    await updateTask(id, task);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
    }));
  },
  removeTask: async (id) => {
    await deleteTask(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
  toggleTaskCompletion: async (id: string, user_id: string) => {
    const task = await getTaskById(user_id, id);
    const updatedTask = { ...task, completed: !task.completed };
    await updateTask(id, updatedTask);
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updatedTask } : t
      ),
    }));
  },
}));

export default useTaskStore;
