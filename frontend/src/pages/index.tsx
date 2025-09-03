"use client";
import { useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Pagination from "@/components/Pagination";
import ConfirmModal from "@/components/ConfirmModal";
import { getTasks, createTask, deleteTask } from "@/lib/api";
import { Task } from "@/lib/types";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState({ search: "", status: "all" as const });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await getTasks({
        page,
        pageSize,
        sort,
        search: filters.search,
        status: filters.status,
      });
      setTasks(res.data);
      setTotal(res.total);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Error cargando tareas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, pageSize, sort, filters.search, filters.status]);

  async function handleAdd(task: Partial<Task>) {
    await createTask(task);
    setPage(1);
    await load();
  }

  async function handleDelete(id: string) {
    setDeleteId(id);
  }

  return (
    <main className="bg-black min-h-screen max-w-6xl mx-auto p-8 space-y-8 text-white">

      <section className="rounded-2xl bg-neutral-900 border border-neutral-700 shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Crear tarea</h2>
        <TaskForm onSubmit={handleAdd} submitText="Agregar" />
      </section>

      <section className="rounded-2xl bg-neutral-900 border border-neutral-700 shadow p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tareas</h2>
          {loading && <span className="text-sm text-neutral-400">Cargando…</span>}
        </div>
        <section className="rounded-2xl bg-neutral-900 border border-neutral-700 shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              value={filters.search}
              onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))}
              placeholder="Buscar por título…"
              className="md:col-span-2 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filters.status}
              onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value as any }))}
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completados</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Orden: A → Z</option>
              <option value="desc">Orden: Z → A</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 hover:bg-neutral-700 transition"
                onClick={() => load()}
              >
                Refrescar
              </button>
            </div>
          </div>
        </section>
        <TaskList
          tasks={tasks}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          sort={sort}
          onSortChange={(s) => { }}
          filters={filters}
          onFiltersChange={() => { }}
          onDelete={handleDelete}
        />

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </section>

      <ConfirmModal
        open={!!deleteId}
        title="Eliminar tarea"
        description="¿Seguro que deseas eliminar esta tarea?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteTask(deleteId);
          setDeleteId(null);
          await load();
        }}
      />

      {error && <div className="text-red-500">{error}</div>}
    </main>
  );
}
