import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';

export function IssueForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '' });
  const [state, setState] = useState({ loading: editing, saving: false, error: '' });
  const navigate = useNavigate();
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  useEffect(() => {
    if (!editing) return;
    api(`/issues/${id}`)
      .then(({ issue }) => setForm({
        title: issue.title,
        description: issue.description,
        status: issue.status,
        priority: issue.priority,
        dueDate: issue.dueDate ? issue.dueDate.slice(0, 10) : ''
      }))
      .catch((error) => setState({ loading: false, saving: false, error: error.message }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, [editing, id]);

  const submit = async (event) => {
    event.preventDefault();
    setState((current) => ({ ...current, saving: true, error: '' }));
    try {
      await api(editing ? `/issues/${id}` : '/issues', {
        method: editing ? 'PATCH' : 'POST',
        body: { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null }
      });
      navigate('/issues');
    } catch (error) {
      setState((current) => ({ ...current, saving: false, error: error.message }));
    }
  };

  if (state.loading) return <div className="card empty">Loading issue...</div>;
  return <form className="card issue-form" onSubmit={submit}><h2>{editing ? 'Edit issue' : 'Create issue'}</h2><label>Title<input name="title" required maxLength="160" value={form.title} onChange={update} /></label><label>Description<textarea name="description" required rows="5" value={form.description} onChange={update} /></label><div className="form-grid"><label>Status<select name="status" value={form.status} onChange={update}><option>Todo</option><option>In Progress</option><option>Done</option></select></label><label>Priority<select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Due date<input name="dueDate" type="date" value={form.dueDate} onChange={update} /></label></div>{state.error && <p className="error">{state.error}</p>}<button className="primary" disabled={state.saving}>{state.saving ? 'Saving...' : editing ? 'Save changes' : 'Create issue'}</button></form>;
}
