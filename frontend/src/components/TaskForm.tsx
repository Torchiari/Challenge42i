"use client";
import { useEffect, useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/lib/types";

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Partial<Task>) => void;
  submitText?: string;
}

export default function TaskForm({
  task,
  onSubmit,
  submitText = "Guardar",
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "Backlog");
  const [priority, setPriority] = useState<TaskPriority | "">(task?.priority || "");
  const [estimate, setEstimate] = useState<number>(task?.estimate ?? 0);

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setStatus(task?.status || "Backlog");
    setPriority(task?.priority || "");
    setEstimate(task?.estimate ?? 0);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, status, priority: priority || undefined, estimate });
  };

  const [subtasks, setSubtasks] = useState<{ title: string }[]>(task?.subtasks || []);

  useEffect(() => {
    setSubtasks(task?.subtasks || []);
  }, [task]);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-xl space-y-4"
    >
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="Backlog">Backlog</option>
        <option value="Unstarted">Unstarted</option>
        <option value="Started">Started</option>
        <option value="Completed">Completed</option>
        <option value="Canceled">Canceled</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Prioridad --</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      <input
        type="number"
        min={0}
        placeholder="Estimado"
        value={estimate}
        onChange={(e) => setEstimate(Number(e.target.value))}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
      />
      <div className="space-y-2">

        <h3 className="text-white font-semibold">Subtareas</h3>
        {subtasks.map((subtask, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Título subtarea"
              value={subtask.title}
              onChange={(e) => {
                const updated = [...subtasks];
                updated[index].title = e.target.value;
                setSubtasks(updated);
              }}
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
            />
            <button
              type="button"
              onClick={() => setSubtasks(subtasks.filter((_, i) => i !== index))}
              className="px-3 py-2 bg-red-600 rounded-lg text-white"
            >
              X
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setSubtasks([...subtasks, { title: "" }])}
          className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700 transition"
        >
          + Agregar Subtarea
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        {submitText}
      </button>
    </form>
  );
}
