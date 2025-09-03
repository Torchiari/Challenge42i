import React from 'react';
import { Task } from '@/lib/types';

interface Props { 
  tasks: Task[] 
}

export default function TaskTree({ tasks }: Props) {
  return (
    <ul className="list-disc list-inside space-y-2 text-sm">
      {tasks.map((task) => (
        <li key={task.id}>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="font-medium break-words">{task.title}</span>
            <span className="text-neutral-500 text-xs whitespace-nowrap">
              ({task.status}, {task.estimate ?? 0})
            </span>
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
