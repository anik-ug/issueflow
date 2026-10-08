import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Layout() {
  const { user, logout } = useAuth();
  return <div className="app-shell"><header><Link className="brand" to="/">IssueFlow</Link><nav><Link to="/">Dashboard</Link><Link to="/issues">Issues</Link><span>{user?.name}</span><button onClick={logout}>Log out</button></nav></header><main className="content"><Outlet /></main></div>;
}
