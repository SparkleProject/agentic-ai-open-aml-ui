import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  user_id: string;
  email: string;
  full_name: string;
  roles: string[];
  tenant_id: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenantId: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'aml_access_token';
const REFRESH_KEY = 'aml_refresh_token';
const USER_KEY = 'aml_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, tenantId: string) => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_KEY, data.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
