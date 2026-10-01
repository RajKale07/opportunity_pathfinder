import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pathfinder_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pathfinder_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((res: any) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('pathfinder_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res: any = await authApi.login({ email, password });
    if (res.data?.token) {
      localStorage.setItem('pathfinder_token', res.data.token);
      localStorage.setItem('pathfinder_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    const res: any = await authApi.register({ fullName, email, password });
    if (res.data?.token) {
      localStorage.setItem('pathfinder_token', res.data.token);
      localStorage.setItem('pathfinder_user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('pathfinder_token');
    localStorage.removeItem('pathfinder_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
