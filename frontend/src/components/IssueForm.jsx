import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';

export function IssueForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [form, setForm] = useState({ title: '', description: '', status: 'Todo', priority: 'Medium', dueDate: '', assignee: null });
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [assigneeState, setAssigneeState] = useState({ loading: false, error: '' });
  const [assigneeFocused, setAssigneeFocused] = useState(false);
  const [state, setState] = useState({ loading: editing, saving: false, error: '' });
  const searchController = useRef(null);
  const navigate = useNavigate();
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  useEffect(() => {
    if (!editing) return;
    api(`/issues/${id}`)
      .then(({ issue }) => {
        setForm({
          title: issue.title,
          description: issue.description,
          status: issue.status,
          priority: issue.priority,
          dueDate: issue.dueDate ? issue.dueDate.slice(0, 10) : '',
          assignee: issue.assignee?._id || null
        });
      setAssigneeSearch(issue.assignee?.name || '');
      setUsers(issue.assignee ? [issue.assignee] : []);
      })
      .catch((error) => setState({ loading: false, saving: false, error: error.message }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, [editing, id]);

  useEffect(() => {
    const controller = new AbortController();
    searchController.current?.abort();
    searchController.current = controller;
    setAssigneeState({ loading: true, error: '' });
    api(`/users?search=${encodeURIComponent(assigneeSearch)}`, { signal: controller.signal })
      .then(({ users: results }) => {
        if (!controller.signal.aborted) setUsers(results);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setAssigneeState({ loading: false, error: error.message });
      })
      .finally(() => {
        if (!controller.signal.aborted) setAssigneeState((current) => ({ ...current, loading: false }));
      });
    return () => controller.abort();
  }, [assigneeSearch]);

  const changeAssigneeSearch = (event) => {
    const value = event.target.value;
    setAssigneeSearch(value);
    if (form.assignee && value !== users.find((user) => user._id === form.assignee)?.name) {
      setForm((current) => ({ ...current, assignee: null }));
    }
  };

  const selectAssignee = (user) => {
    setForm((current) => ({ ...current, assignee: user?._id || null }));
    setAssigneeSearch(user?.name || '');
    setAssigneeFocused(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setState((current) => ({ ...current, saving: true, error: '' }));
    try {
      await api(editing ? `/issues/${id}` : '/issues', {
        method: editing ? 'PATCH' : 'POST',
        body: { ...form, assignee: form.assignee || null, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null }
      });
      navigate('/issues');
    } catch (error) {
      setState((current) => ({ ...current, saving: false, error: error.message }));
    }
  };

  if (state.loading) return <div className="card empty">Loading issue...</div>;
  return <form className="card issue-form" onSubmit={submit}><h2>{editing ? 'Edit issue' : 'Create issue'}</h2><label>Title<input name="title" required maxLength="160" value={form.title} onChange={update} /></label><label>Description<textarea name="description" required rows="5" value={form.description} onChange={update} /></label><div className="form-grid"><label>Status<select name="status" value={form.status} onChange={update}><option>Todo</option><option>In Progress</option><option>Done</option></select></label><label>Priority<select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Due date<input name="dueDate" type="date" value={form.dueDate} onChange={update} /></label></div><label className="assignee-field">Assignee<div className="assignee-search"><input value={assigneeSearch} placeholder="Search by name or email" onChange={changeAssigneeSearch} onFocus={() => setAssigneeFocused(true)} aria-label="Assignee" />{assigneeFocused && <div className="assignee-options"><button type="button" onClick={() => selectAssignee(null)}>Unassigned</button>{assigneeState.loading ? <span>Searching users...</span> : assigneeState.error ? <span className="error">Unable to load users: {assigneeState.error}</span> : users.map((user) => <button type="button" key={user._id} onClick={() => selectAssignee(user)}>{user.name} <small>{user.email}</small></button>)}</div>}</div></label>{state.error && <p className="error">{state.error}</p>}<button className="primary" disabled={state.saving}>{state.saving ? 'Saving...' : editing ? 'Save changes' : 'Create issue'}</button></form>;
}
