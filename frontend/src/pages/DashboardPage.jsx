import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
export function DashboardPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/dashboard/stats').then(setStats).catch(() => setStats({ total: 0, overdue: 0, byStatus: {}, byPriority: {} })); }, []);
  const status = stats?.byStatus || {};
  const priority = stats?.byPriority || {};
  return <section><div className="page-heading"><div><p className="eyebrow">Overview</p><h1>Dashboard</h1></div><Link className="primary button" to="/issues">View issues</Link></div><div className="stats"><div className="card"><span>Total issues</span><strong>{stats?.total ?? '—'}</strong></div><div className="card"><span>In progress</span><strong>{status['In Progress'] ?? '—'}</strong></div><div className="card"><span>High priority</span><strong>{priority.High ?? '—'}</strong></div><div className="card"><span>Overdue</span><strong>{stats?.overdue ?? '—'}</strong></div></div><div className="card empty"><h2>Work by status</h2><p>Todo: {status.Todo || 0} · In Progress: {status['In Progress'] || 0} · Done: {status.Done || 0}</p></div></section>;
}
