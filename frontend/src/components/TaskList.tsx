"use client";
import React from "react";
import { Task } from "@/lib/types";
import TaskRow from "./TaskRow";

interface Filters {
  search: string;
  status: "all" | "completed" | "pending";
}

interface Props {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sort: string;
  onSortChange: (sort: "asc" | "desc") => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({
  tasks,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sort,
  onSortChange,
  filters,
  onFiltersChange,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-700 shadow-lg">
      <table className="min-w-full table-auto bg-neutral-900 text-white">
        <thead className="bg-neutral-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Título</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Prioridad</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Estimado</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Creación</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-700">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
