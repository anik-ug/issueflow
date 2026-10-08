import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function AuthPage({ mode }) {
  const register = mode === 'register';
  const [form, setForm] = useState(register ? { name: '', email: '', password: '' } : { email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register: signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const submit = async (event) => { event.preventDefault(); setError(''); try { await (register ? signUp(form) : login(form)); navigate(location.state?.from || '/'); } catch (err) { setError(err.message); } };
  return <main className="auth-page"><form className="card auth-card" onSubmit={submit}><h1>{register ? 'Create your account' : 'Welcome back'}</h1>{register && <label>Name<input required minLength="2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>}<label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Password<input required minLength="8" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>{error && <p className="error">{error}</p>}<button className="primary">{register ? 'Register' : 'Log in'}</button><p>{register ? 'Already have an account?' : 'Need an account?'} <Link to={register ? '/login' : '/register'}>{register ? 'Log in' : 'Register'}</Link></p></form></main>;
}
