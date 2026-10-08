import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api('/auth/me').then((data) => setUser(data.user)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const authenticate = async (path, values) => { const data = await api(path, { method: 'POST', body: values }); setUser(data.user); };
  const logout = async () => { await api('/auth/logout', { method: 'POST' }); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login: (v) => authenticate('/auth/login', v), register: (v) => authenticate('/auth/register', v), logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
