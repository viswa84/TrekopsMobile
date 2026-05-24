import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { storage, setCachedToken } from '../lib/storage';
import { apolloClient } from '../graphql/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await Promise.all([storage.getToken(), storage.getUser()]);
        if (t) {
          setCachedToken(t);
          setToken(t);
        }
        if (u) setUser(u);
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  const login = useCallback(async (newToken, userData) => {
    await storage.setToken(newToken);
    await storage.setUser(userData);
    setCachedToken(newToken);
    setToken(newToken);
    setUser(userData);
  }, []);

  const updateUser = useCallback(async (updates) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...updates };
      storage.setUser(updated).catch(() => {});
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    await storage.clearAll();
    setCachedToken(null);
    setToken(null);
    setUser(null);
    try {
      await apolloClient.clearStore();
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      bootstrapping,
      isAdmin: user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'staff',
      isCustomer: user?.role === 'customer',
      login,
      logout,
      updateUser,
    }),
    [user, token, bootstrapping, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
