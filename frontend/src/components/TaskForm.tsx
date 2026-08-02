import { useState, type FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { api, getErrorMessage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Member, Task, TaskStatus } from '../types';

const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'Todo' }, { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' }, { value: 'DONE', label: 'Done' },
];
const dateValue = (date?: string | null) => date ? new Date(date).toISOString().slice(0, 10) : '';

type Props = { projectId: string; members: Member[]; task?: Task; initialStatus?: TaskStatus; onClose: () => void; onSaved: (task: Task) => void; onDeleted?: (id: string) => void };
export function TaskForm({ projectId, members, task, initialStatus = 'TODO', onClose, onSaved, onDeleted }: Props) {
  const { user } = useAuth(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState(''); const [comments, setComments] = useState(task?.comments ?? []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const due = String(f.get('dueDate')); setBusy(true); setError('');
    try {
      const body = { title: String(f.get('title')), description: String(f.get('description')) || null, priority: String(f.get('priority')), status: String(f.get('status')), dueDate: due ? new Date(`${due}T00:00:00.000Z`).toISOString() : null, assignedUserId: String(f.get('assignedUserId')) || null };
      const response = task ? await api.patch(`/tasks/${task.id}`, body) : await api.post(`/projects/${projectId}/tasks`, body);
      onSaved(response.data.task); if (!task) onClose();
    } catch (err) { setError(getErrorMessage(err)); } finally { setBusy(false); }
  }
  async function addComment(e: FormEvent) { e.preventDefault(); if (!task || !comment.trim()) return; try { const r = await api.post(`/tasks/${task.id}/comments`, { content: comment.trim() }); setComments([...comments, r.data.comment]); setComment(''); } catch (err) { setError(getErrorMessage(err)); } }
  async function removeComment(id: string) { try { await api.delete(`/comments/${id}`); setComments(comments.filter(c => c.id !== id)); } catch (err) { setError(getErrorMessage(err)); } }
  async function deleteTask() { if (!task || !window.confirm('Delete this task permanently?')) return; try { await api.delete(`/tasks/${task.id}`); onDeleted?.(task.id); onClose(); } catch (err) { setError(getErrorMessage(err)); } }
  return <Modal title={task ? 'Task details' : 'Create task'} onClose={onClose}>
    <form onSubmit={submit} className="space-y-4">
      <label><span className="label">Title</span><input name="title" required minLength={2} defaultValue={task?.title} placeholder="Write a clear task title"/></label>
      <label><span className="label">Description</span><textarea name="description" rows={3} defaultValue={task?.description ?? ''} placeholder="Add helpful context…"/></label>
      <div className="grid grid-cols-2 gap-3">
        <label><span className="label">Status</span><select name="status" defaultValue={task?.status ?? initialStatus}>{statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label>
        <label><span className="label">Priority</span><select name="priority" defaultValue={task?.priority ?? 'MEDIUM'}>{['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => <option key={p} value={p}>{p[0] + p.slice(1).toLowerCase()}</option>)}</select></label>
        <label><span className="label">Assignee</span><select name="assignedUserId" defaultValue={task?.assignedUserId ?? ''}><option value="">Unassigned</option>{members.map(m => <option key={m.user.id} value={m.user.id}>{m.user.name}</option>)}</select></label>
        <label><span className="label">Due date</span><input name="dueDate" type="date" defaultValue={dateValue(task?.dueDate)}/></label>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">{task ? <button type="button" onClick={deleteTask} className="btn text-rose-600 hover:bg-rose-50"><Trash2 size={16}/>Delete</button> : <span/>}<div className="flex gap-3"><button type="button" onClick={onClose} className="btn-secondary">Close</button><button disabled={busy} className="btn-primary">{busy ? 'Saving…' : task ? 'Save task' : 'Create task'}</button></div></div>
    </form>
    {task && <section className="mt-6 border-t border-slate-200 pt-5"><h3 className="font-medium text-ink">Comments</h3><div className="mt-3 space-y-3">{comments.map(c => <div key={c.id} className="rounded-lg bg-slate-50 p-3"><div className="flex justify-between text-xs"><span className="font-medium text-ink">{c.author.name}</span>{c.authorId === user?.id && <button onClick={() => removeComment(c.id)} className="text-rose-600">Delete</button>}</div><p className="mt-1 text-sm text-slate-600">{c.content}</p></div>)}</div><form onSubmit={addComment} className="mt-3 flex gap-2"><input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment…"/><button className="btn-primary">Add</button></form></section>}
  </Modal>;
}
