import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

export function IssueForm() {
  const [form, setForm] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); setError(''); try { await api('/issues', { method: 'POST', body: { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null } }); navigate('/issues'); } catch (err) { setError(err.message); } };
  return <form className="card issue-form" onSubmit={submit}><h2>Create issue</h2><label>Title<input name="title" required maxLength="160" value={form.title} onChange={update} /></label><label>Description<textarea name="description" required rows="5" value={form.description} onChange={update} /></label><div className="form-grid"><label>Status<select name="status" value={form.status} onChange={update}><option>Todo</option><option>In Progress</option><option>Done</option></select></label><label>Priority<select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Due date<input name="dueDate" type="date" value={form.dueDate} onChange={update} /></label></div>{error && <p className="error">{error}</p>}<button className="primary">Create issue</button></form>;
}
