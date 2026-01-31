'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USERNAME = 'waterlife';
const ADMIN_PASSWORD = 'admin';
const AUTH_STORAGE_KEY = 'waterlife_admin_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data.username) {
          setIsAuthenticated(true);
          setUser({ username: data.username });
        }
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const userData = { username };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
