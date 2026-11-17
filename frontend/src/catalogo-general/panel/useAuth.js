import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';

export function useAuth(slug = 'default') {
  const TOKEN_KEY = `panel_token_${slug}`;
  const USER_KEY  = `panel_user_${slug}`;

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, [TOKEN_KEY, USER_KEY]);

  const getToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, [TOKEN_KEY]);

  // Verificar token almacenado al montar
  const verify = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/?request=auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok' && data.username) {
          const userData = { token, ...data };
          setUser(userData);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } else {
          clearSession();
        }
      } else {
        clearSession();
      }
    } catch {
      // Error de red
    } finally {
      setLoading(false);
    }
  }, [TOKEN_KEY, USER_KEY, clearSession]);

  useEffect(() => {
    verify();
  }, [verify]);

  // Login
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/?request=auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'ok') {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      const userData = {
        token: data.token,
        catalog_id: data.catalog_id,
        catalog_slug: data.catalog_slug,
        username: data.username,
        expires_at: data.expires_at
      };

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/?request=auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {}
    }
    clearSession();
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    getToken,
    verify
  };
}
