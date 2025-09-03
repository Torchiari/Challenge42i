"use client";
import { useEffect, useRef, useState } from 'react';


type Props = {
open: boolean;
title?: string;
description?: React.ReactNode;
confirmText?: string;
cancelText?: string;
onConfirm: () => void | Promise<void>;
onCancel: () => void;
busyText?: string;
};


export default function ConfirmModal({
open,
title = 'Confirmar',
description,
confirmText = 'Confirmar',
cancelText = 'Cancelar',
busyText = 'Procesando...',
onConfirm,
onCancel,
}: Props) {
const dialogRef = useRef<HTMLDivElement | null>(null);
const [loading, setLoading] = useState(false);


useEffect(() => {
function onKey(e: KeyboardEvent) {
if (e.key === 'Escape' && open && !loading) onCancel();
}
document.addEventListener('keydown', onKey);
return () => document.removeEventListener('keydown', onKey);
}, [open, loading, onCancel]);


useEffect(() => {
if (open) document.body.style.overflow = 'hidden';
else document.body.style.overflow = '';
}, [open]);


if (!open) return null;


return (
<div
className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
onMouseDown={(e) => {
if (dialogRef.current && e.target === dialogRef.current && !loading) {
onCancel();
}
}}
>
<div ref={dialogRef} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
{description && <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{description}</div>}
<div className="mt-6 flex items-center justify-end gap-3">
<button
type="button"
className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
onClick={onCancel}
disabled={loading}
>
{cancelText}
</button>
<button
type="button"
className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
onClick={async () => {
try {
setLoading(true);
await onConfirm();
} finally {
setLoading(false);
}
}}
disabled={loading}
>
{loading ? busyText : confirmText}
</button>
</div>
</div>
</div>
);
}