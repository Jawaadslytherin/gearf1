import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken as persistToken, getUser, setUser, clearAuth } from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());

  useEffect(() => {
    if (token) {
      persistToken(token);
    } else {
      clearAuth();
    }
  }, [token]);

  function login(newToken, newUser) {
    setTokenState(newToken);
    setUserState(newUser);
    setUser(newUser);
  }

  function logout() {
    setTokenState(null);
    setUserState(null);
    clearAuth();
  }

  const value = { token, user, login, logout, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
