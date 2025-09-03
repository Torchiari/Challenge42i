import React from 'react';
import { Task } from '@/lib/types';

interface Props { tasks: Task[] }
export default function TaskTree({ tasks }: Props) {
  return (
    <ul className="list-disc list-inside space-y-1 text-sm">
      {tasks.map((task) => (
        <li key={task.id}>
          <div className="flex items-baseline gap-2">
            <span className="font-medium">{task.title}</span>
            <span className="text-neutral-500 text-xs">({task.status},
              {task.estimate ?? 0})</span>
          </div>
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="ml-4 mt-1">
              <TaskTree tasks={task.subtasks} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}