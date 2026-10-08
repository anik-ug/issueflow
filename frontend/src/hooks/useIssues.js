import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export function useIssues() {
  const [data, setData] = useState({ items: [], pagination: {} });
  const [query, setQuery] = useState({ search: '', status: '', priority: '', sort: 'createdAt', order: 'desc' });
  const [state, setState] = useState({ loading: true, error: '' });
  const load = useCallback(async () => {
    setState({ loading: true, error: '' });
    const params = new URLSearchParams(Object.entries(query).filter(([, value]) => value));
    try { setData(await api(`/issues?${params}`)); setState({ loading: false, error: '' }); } catch (error) { setState({ loading: false, error: error.message }); }
  }, [query]);
  useEffect(() => { load(); }, [load]);
  const remove = async (id) => { await api(`/issues/${id}`, { method: 'DELETE' }); load(); };
  return { ...data, query, setQuery, ...state, reload: load, remove };
}
