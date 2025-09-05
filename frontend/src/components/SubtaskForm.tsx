"use client";
import { useState, useEffect } from "react";
import { TaskStatus } from "@/lib/types";

interface SubtaskFormProps {
  subtask?: {
    title: string;
    status: TaskStatus;
    estimate?: number;
  };
  onSubmit: (subtask: { title: string; status: TaskStatus; estimate?: number }) => void;
}

export default function SubtaskForm({ subtask, onSubmit }: SubtaskFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Backlog");
  const [estimate, setEstimate] = useState<number>(0);

  useEffect(() => {
    if (subtask) {
      setTitle(subtask.title || "");
      setStatus(subtask.status || "Backlog");
      setEstimate(subtask.estimate ?? 0);
    }
  }, [subtask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, status, estimate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Título de la subtarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full sm:w-1/2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
        >
          <option value="Backlog">Backlog</option>
          <option value="Unstarted">Unstarted</option>
          <option value="Started">Started</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>

        <input
          type="number"
          min={0}
          placeholder="Tiempo estimado"
          value={estimate}
          onChange={(e) => setEstimate(Number(e.target.value))}
          className="w-full sm:w-1/2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        Guardar Subtarea
      </button>
    </form>
  );
}
