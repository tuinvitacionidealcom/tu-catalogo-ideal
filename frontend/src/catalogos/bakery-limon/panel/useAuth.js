import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://tucatalogoideal.com/backend';
const TOKEN_KEY = 'panel_token';
const USER_KEY  = 'panel_user';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Verificar token almacenado al montar
  const verify = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    // Sin token → mostrar login directamente
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

        // Validar que la respuesta tenga los campos esperados
        if (data.status === 'ok' && data.username && data.catalog_slug) {
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
      // Error de red o CORS: mantener usuario local si existe pero marcar no cargando
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    verify();
  }, [verify]);

  const login = useCallback(async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/?request=auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      if (!data.token || !data.username) {
        throw new Error('Respuesta del servidor inválida');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      setUser(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await fetch(`${API_BASE}/?request=auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        // ignorar error de red al hacer logout
      }
    }
    clearSession();
  }, [clearSession]);

  const getToken = useCallback(() => localStorage.getItem(TOKEN_KEY), []);

  return { user, loading, error, login, logout, getToken };
}

