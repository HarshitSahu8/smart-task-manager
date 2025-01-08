import { Task } from "../utils/api";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  noHeading?: boolean;
}

export default function TaskList({ tasks, noHeading }: TaskListProps) {
  return (
    <div className="max-w-7xl mx-auto p-4">
      {noHeading ? null : (
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Task List</h2>
      )}
      {tasks.length ? (
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-800">No tasks available</p>
      )}
    </div>
  );
}
