'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Typ uzytkownika
interface User {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'user';
}

// Zarejestrowany uzytkownik (z haslem)
interface RegisteredUser extends User {
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  // Admin login (stary)
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  // User login/register (nowy)
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials (stare)
const ADMIN_USERNAME = 'waterlife';
const ADMIN_PASSWORD = 'admin';

// Storage keys
const AUTH_SESSION_KEY = 'waterlife_session';
const USERS_STORAGE_KEY = 'waterlife_users';

// Helper do generowania ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Helper do pobierania zarejestrowanych userow
function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Helper do zapisywania userow
function saveRegisteredUsers(users: RegisteredUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.type === 'admin';

  // Check existing session on mount
  useEffect(() => {
    const session = localStorage.getItem(AUTH_SESSION_KEY);
    if (session) {
      try {
        const data = JSON.parse(session);
        if (data.id && data.type) {
          setIsAuthenticated(true);
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            type: data.type,
          });
        }
      } catch {
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Admin login (stara logika)
  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin',
        name: 'Administrator',
        email: 'admin@waterlife.net.pl',
        type: 'admin',
      };
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(adminUser));
      setIsAuthenticated(true);
      setUser(adminUser);
      return true;
    }
    return false;
  };

  // User login
  const loginUser = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getRegisteredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, error: 'Nie znaleziono konta z tym adresem email' };
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Nieprawidlowe haslo' };
    }

    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      type: 'user',
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
    setIsAuthenticated(true);
    setUser(sessionUser);

    return { success: true };
  };

  // User registration
  const registerUser = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getRegisteredUsers();

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Konto z tym adresem email juz istnieje' };
    }

    const newUser: RegisteredUser = {
      id: generateId(),
      name,
      email,
      password,
      type: 'user',
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    // Auto-login after registration
    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      type: 'user',
    };

    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
    setIsAuthenticated(true);
    setUser(sessionUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isAdmin,
      loading,
      loginAdmin,
      loginUser,
      registerUser,
      logout,
    }}>
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
