import { Task } from './types';


export function aggregateEstimates(task: Task) {
let pending = 0, inProgress = 0, total = 0;
function dfs(t: Task) {
const val = t.estimate ?? 0;
total += val;
if (t.status === 'Backlog' || t.status === 'Unstarted') pending += val;
if (t.status === 'Started') inProgress += val;
t.subtasks?.forEach(dfs);
}
dfs(task);
return { pending, inProgress, total };
}