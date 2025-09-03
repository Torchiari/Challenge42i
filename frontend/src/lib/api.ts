import { Task } from './types';


const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000') + '/api/tasks';


export async function getTasks(params?: {
page?: number;
pageSize?: number;
sort?: 'asc' | 'desc';
search?: string;
status?: 'all' | 'completed' | 'pending';
}) {
const q = new URLSearchParams();
if (params) {
if (params.page) q.set('page', String(params.page));
if (params.pageSize) q.set('pageSize', String(params.pageSize));
if (params.sort) q.set('sort', params.sort);
if (params.search) q.set('search', params.search);
if (params.status) q.set('status', params.status);
}
const res = await fetch(`${BASE}?${q.toString()}`);
if (!res.ok) throw new Error('Failed to fetch tasks');
return res.json(); 
}


export async function getTask(id: string): Promise<Task> {
const res = await fetch(`${BASE}/${id}`);
if (!res.ok) throw new Error('Failed to fetch task');
return res.json();
}


export async function createTask(payload: Partial<Task>) {
const res = await fetch(BASE, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
});
if (!res.ok) throw new Error('Failed to create task');
return res.json();
}


export async function updateTask(id: string, payload: Partial<Task>) {
const res = await fetch(`${BASE}/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
});
if (!res.ok) throw new Error('Failed to update task');
return res.json();
}


export async function deleteTask(id: string) {
const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
if (!res.ok) throw new Error('Failed to delete task');
return res.json();
}