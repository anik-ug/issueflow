import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <main className="center">Loading IssueFlow...</main>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
