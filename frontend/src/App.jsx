import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { IssuesPage } from './pages/IssuesPage.jsx';
import { IssueForm } from './components/IssueForm.jsx';

export function App() {
  return <BrowserRouter><AuthProvider><Routes><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route element={<ProtectedRoute />}><Route element={<Layout />}><Route index element={<DashboardPage />} />  <Route path="/issues" element={<IssuesPage />} /><Route path="/issues/new" element={<IssueForm />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider></BrowserRouter>;
}
