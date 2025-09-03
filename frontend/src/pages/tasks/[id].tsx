"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getTask, updateTask, deleteTask } from "@/lib/api";
import TaskForm from "@/components/TaskForm";
import TaskTree from "@/components/TaskTree";
import ConfirmModal from "@/components/ConfirmModal";
import { Task } from "@/lib/types";
import { aggregateEstimates } from "@/lib/utils";

export default function TaskDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  async function loadTask(taskId: string) {
    setLoading(true);
    try {
      const data = await getTask(taskId);
      setTask(data as Task);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(updated: Partial<Task>) {
    if (!id || typeof id !== "string") return;
    await updateTask(id, updated);
    await loadTask(id);
  }

  useEffect(() => {
    if (typeof id === "string") loadTask(id);
  }, [id]);

  async function handleDelete() {
    if (!id || typeof id !== "string") return;
    await deleteTask(id);
    router.push("/");
  }

  if (!task) return <p className="p-8 text-white">Cargando…</p>;

  const est = aggregateEstimates(task);

  return (
    <main className="bg-black min-h-screen max-w-4xl mx-auto p-8 space-y-8 text-white">
      <section className="rounded-2xl bg-neutral-900 border border-neutral-700 shadow p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded-lg bg-blue-600 text-xs font-medium">
              {task.status}
            </span>
            {task.priority && (
              <span className="px-2 py-1 rounded-lg bg-purple-600 text-xs font-medium">
                {task.priority}
              </span>
            )}
          </div>
        </div>

        <p className="text-neutral-400 mt-2">
          {task.description || "Sin descripción"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
          <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-4">
            <p>
              <b>ID:</b> {task.id}
            </p>
            <p>
              <b>Estimado:</b> {task.estimate ?? 0}
            </p>
            <p>
              <b>Creación:</b>{" "}
              {new Date(task.createdAt).toLocaleString()}
            </p>
            <p>
              <b>Actualizado:</b>{" "}
              {new Date(task.updatedAt).toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-4">
            <p>
              <b>Pendientes:</b> {est.pending}
            </p>
            <p>
              <b>En progreso:</b> {est.inProgress}
            </p>
            <p>
              <b>Total:</b> {est.total}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-3">Subtareas</h3>
          {task.subtasks && task.subtasks.length ? (
            <TaskTree tasks={task.subtasks} />
          ) : (
            <p className="text-neutral-500">Sin subtareas</p>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-neutral-600 hover:bg-neutral-800 transition"
            onClick={() => router.push("/")}
          >
            Volver
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
            onClick={() => setOpenConfirm(true)}
          >
            Eliminar
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-neutral-900 border border-neutral-700 shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Editar tarea</h2>
        <TaskForm
          task={task}
          onSubmit={handleUpdate}
          submitText="Guardar cambios"
        />
      </section>

      <ConfirmModal
        open={openConfirm}
        title="Eliminar tarea"
        description="¿Seguro que deseas eliminar esta tarea?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
