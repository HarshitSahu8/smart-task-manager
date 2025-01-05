import { Task } from "../utils/api";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Task List</h2>
      {tasks.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500">No tasks available</p>
      )}
    </div>
  );
}
