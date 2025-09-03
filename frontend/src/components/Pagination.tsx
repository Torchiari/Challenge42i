"use client";
import { useMemo } from 'react';


type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
};


function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}


export default function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 20, 50], }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));


  const pages = useMemo(() => {
    if (totalPages <= 7) return range(1, totalPages);
    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages] as (number | string)[];
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages] as (number | string)[];
    return [1, '...', page - 1, page, page + 1, '...', totalPages] as (number | string)[];
  }, [page, totalPages]);


  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages}</span> — {total} resultados
      </div>


      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <select className="rounded-xl border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}/pág.</option>
            ))}
          </select>
        )}


        <div className="flex items-center gap-1">
          <button className="rounded-lg border px-2 py-1 text-sm disabled:opacity-50 dark:border-neutral-700" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} aria-label="Anterior">←</button>
          {pages.map((p, i) => typeof p === 'string' ? (
            <span key={`${p}-${i}`} className="px-2 py-1 text-sm text-neutral-400">{p}</span>
          ) : (
            <button key={p} className={`rounded-lg px-3 py-1 text-sm ${p === page ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border dark:border-neutral-700'}`} onClick={() => onPageChange(p as number)}>{p}</button>
          ))}
          <button className="rounded-lg border px-2 py-1 text-sm disabled:opacity-50 dark:border-neutral-700" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} aria-label="Siguiente">→</button>
        </div>
      </div>
    </div>
  );
}