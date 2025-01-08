import { useState, ChangeEvent, FormEvent } from "react";
import { Task } from "../utils/api";
import useUserStore from "@/store/userStore";

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (task: Task) => void;
  heading?: boolean;
  buttonLabel?: string;
}

export default function TaskForm({
  initialData = {},
  onSubmit,
  heading = false,
  buttonLabel = "Submit",
}: Readonly<TaskFormProps>) {
  const [task, setTask] = useState<Task>({
    id: initialData.id ?? null,
    title: initialData.title ?? "",
    description: initialData.description ?? "",
    due_date: initialData.due_date ?? "",
    priority: initialData.priority ?? "Low",
    completed: initialData.completed || false,
    user_id: initialData.user_id ?? "",
  });

  const user = useUserStore((state) => state.user);

  const resetAllFields = () => {
    setTask({
      id: null,
      title: "",
      description: "",
      due_date: "",
      priority: "Low",
      completed: false,
      user_id: "",
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!user) {
      alert("User not found");
      return;
    }

    setTask({ ...task, user_id: user.id, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // remove id from the task object
    if (!task.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...refineTask } = task;
      onSubmit(refineTask as Task);
      resetAllFields();
      return;
    }
    onSubmit(task);
    resetAllFields();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      {heading && (
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Create Task
        </h2>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-lg font-medium text-gray-700"
        >
          Task Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
          className="text-gray-800 w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-lg font-medium text-gray-700"
        >
          Task Description
        </label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Task Description"
          required
          className="text-gray-800 w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="due_date"
          className="block text-lg font-medium text-gray-700"
        >
          Due Date
        </label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          value={task.due_date}
          onChange={handleChange}
          required
          className="text-gray-800 w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="priority"
          className="block text-lg font-medium text-gray-700"
        >
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="text-gray-800 w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button
        type="submit"
        className="text-gray-800 w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
