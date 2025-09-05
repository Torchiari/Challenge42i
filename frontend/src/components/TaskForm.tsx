"use client";
import { useEffect, useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/lib/types";
import Modal from "./Modal";
import SubtaskForm from "./SubtaskForm";

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

  const [subtasks, setSubtasks] = useState<Task[]>(task?.subtasks || []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setStatus(task?.status || "Backlog");
    setPriority(task?.priority || "");
    setEstimate(task?.estimate ?? 0);
    setSubtasks(task?.subtasks || []);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      status,
      priority: priority || undefined,
      estimate,
      subtasks,
    });
  };

  const handleDeleteSubtask = (index: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta subtarea?");
    if (!confirmDelete) return;
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-xl space-y-4"
      >
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full sm:w-1/2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
          >
            <option value="">-- Prioridad --</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-white font-medium">Tiempo estimado</label>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={estimate}
            onChange={(e) => setEstimate(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
          />
        </div>

        {/* Lista de subtareas */}
        <div className="space-y-2">
          <h3 className="text-white font-semibold">Subtareas</h3>
          {subtasks.length === 0 && (
            <p className="text-neutral-400 text-sm">No hay subtareas aún</p>
          )}
          {subtasks.map((subtask, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-neutral-800 px-3 py-2 rounded-lg"
            >
              <span className="text-white">{subtask.title}</span>
              <div className="flex gap-2">
                {/* Botón Editar */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingIndex(index);
                    setIsModalOpen(true);
                  }}
                  className="px-2 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 transition"
                >
                  ✏️
                </button>

                {/* Botón Eliminar con confirmación */}
                <button
                  type="button"
                  onClick={() => handleDeleteSubtask(index)}
                  className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-700 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setEditingIndex(null);
              setIsModalOpen(true);
            }}
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

      {/* Modal de subtarea */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold text-white mb-4">
          {editingIndex !== null ? "Editar Subtarea" : "Nueva Subtarea"}
        </h2>
        <SubtaskForm
          subtask={editingIndex !== null ? subtasks[editingIndex] : undefined}
          onSubmit={(subtask) => {
            if (editingIndex !== null) {
              // editar
              const updated = [...subtasks];
              updated[editingIndex] = subtask as any;
              setSubtasks(updated);
            } else {
              // nueva
              setSubtasks([...subtasks, subtask as any]);
            }
            setIsModalOpen(false);
            setEditingIndex(null);
          }}
        />
      </Modal>
    </>
  );
}
