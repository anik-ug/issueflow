import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useIssues } from '../hooks/useIssues.js';
export function IssuesPage() {
  const { items, query, setQuery, loading, error, remove } = useIssues();
  const [issueToDelete, setIssueToDelete] = useState(null);
  const confirmDelete = async () => {
    if (!issueToDelete) return;
    await remove(issueToDelete._id);
    setIssueToDelete(null);
  };
  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Workspace</p><h1>Issues</h1></div>
        <Link className="primary button" to="/issues/new">New issue</Link>
      </div>
      <div className="filters">
        <input placeholder="Search issues..." value={query.search} onChange={(e) => setQuery({ ...query, search: e.target.value })} />
        <select value={query.status} onChange={(e) => setQuery({ ...query, status: e.target.value })}><option value="">All statuses</option><option>Todo</option><option>In Progress</option><option>Done</option></select>
        <select value={query.priority} onChange={(e) => setQuery({ ...query, priority: e.target.value })}><option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option></select>
      </div>
      {loading ? <div className="card empty">Loading issues...</div> : error ? <div className="card empty error">{error}</div> : items.length === 0 ? <div className="card empty"><h2>No issues found</h2><p>Create an issue or adjust your filters.</p></div> : <div className="issue-list">{items.map((issue) => <article className="card issue" key={issue._id}><div><span className={`badge ${issue.priority.toLowerCase()}`}>{issue.priority}</span><h2>{issue.title}</h2><p>{issue.description}</p><small>{issue.status} · {issue.assignee?.name || 'Unassigned'}</small></div><div className="issue-actions"><Link className="button" to={`/issues/${issue._id}/edit`} state={{ issue }}>Edit</Link><button onClick={() => setIssueToDelete(issue)}>Delete</button></div></article>)}</div>}
      {issueToDelete && <div className="dialog-backdrop" role="presentation"><div className="card confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title"><h2 id="delete-dialog-title">Delete issue?</h2><p>Are you sure you want to delete “{issueToDelete.title}”?</p><div className="dialog-actions"><button onClick={() => setIssueToDelete(null)}>Cancel</button><button className="danger" onClick={confirmDelete}>Delete</button></div></div></div>}
    </section>
  );
}
