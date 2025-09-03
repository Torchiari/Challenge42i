import Link from "next/link";
import { Task } from "@/lib/types";

interface Props {
  task: Task;
  onDelete: (id: string) => void;
}

export default function TaskRow({ task, onDelete }: Props) {
  return (
    <tr className="hover:bg-neutral-800 transition text-white">
      <td className="px-4 py-2 align-top text-sm text-neutral-400 break-words">
        {task.id}
      </td>
      <td className="px-4 py-2 align-top break-words">{task.title}</td>
      <td className="px-4 py-2 align-top">
        <span className="px-2 py-1 rounded-full bg-blue-600 text-xs font-medium">
          {task.status}
        </span>
      </td>
      <td className="px-4 py-2 align-top">
        <span className="px-2 py-1 rounded-full bg-purple-600 text-xs font-medium">
          {task.priority ?? "—"}
        </span>
      </td>
      <td className="px-4 py-2 align-top text-neutral-400">
        {task.estimate ?? 0}
      </td>
      <td className="px-4 py-2 align-top text-sm text-neutral-400 whitespace-nowrap">
        {new Date(task.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-2 align-top">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/tasks/${task.id}`}
            className="px-3 py-1 rounded-lg bg-neutral-800 text-sm font-medium hover:bg-neutral-700 transition"
          >
            Detalles
          </Link>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 rounded-lg bg-red-600 text-sm font-medium hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
