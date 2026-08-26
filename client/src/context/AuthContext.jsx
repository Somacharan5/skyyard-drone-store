import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import client, { apiErrorMessage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dd_token');
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('dd_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await client.post('/auth/login', { email, password });
      localStorage.setItem('dd_token', res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: apiErrorMessage(err, 'Could not sign in') };
    }
  }, []);

  const register = useCallback(async (payload) => {
    try {
      const res = await client.post('/auth/register', payload);
      localStorage.setItem('dd_token', res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: apiErrorMessage(err, 'Could not create your account') };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dd_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
