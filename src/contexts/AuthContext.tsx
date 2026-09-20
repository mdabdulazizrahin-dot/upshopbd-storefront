import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { getToken, setToken, removeToken } from '@/lib/api';

export interface UserProfile {
  id: string | number;
  user_id?: string | number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role?: string;
  permissions?: string[];
  created_at?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  session: { token: string } | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isStaff: boolean;
  loading: boolean;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkIsStaff = (role?: string) => ['admin', 'moderator', 'editor', 'viewer'].includes(role || '');

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      if (saved) return checkIsStaff(JSON.parse(saved).role);
      return false;
    } catch { return false; }
  });
  const [loading, setLoading] = useState(false);

  const isSuperAdmin = user?.role === 'admin';
  const isStaff = checkIsStaff(user?.role);

  const hasRole = (roles: string | string[]): boolean => {
    if (!user?.role) return false;
    if (user.role === 'admin') return true;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.role) return false;
    if (user.role === 'admin') return true;
    if (user.permissions && Array.isArray(user.permissions)) {
      if (user.permissions.includes('all') || user.permissions.includes(permission)) return true;
    }
    const roleDefaults: Record<string, string[]> = {
      moderator: ['dashboard', 'orders', 'abandoned_checkouts', 'customers', 'courier', 'delivery', 'analytics'],
      editor: ['dashboard', 'products', 'categories', 'banners', 'home_sections', 'pages'],
      viewer: ['dashboard', 'products', 'categories', 'orders', 'analytics'],
    };
    const defaults = roleDefaults[user.role] || [];
    return defaults.includes(permission);
  };

  const fetchProfile = async (): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) return false;
      const data = await api.get<any>('/auth/me');
      const userData = data.user ? data.user : data;
      if (!userData || !userData.id) return false;
      setUser(userData);
      const staffStatus = checkIsStaff(userData.role);
      setIsAdmin(staffStatus);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return staffStatus;
    } catch {
      return false;
    }
  };

  const refreshProfile = async (): Promise<boolean> => {
    return await fetchProfile();
  };

  const signIn = async (emailOrPhone: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: UserProfile & { role?: string } }>('/auth/login', { 
        email_or_phone: emailOrPhone, 
        email: emailOrPhone, 
        password 
      });
      setToken(response.token);
      setUser(response.user);
      const staffStatus = checkIsStaff(response.user.role);
      setIsAdmin(staffStatus);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (emailOrPhone: string, password: string, name: string, phone?: string) => {
    try {
      const identifier = emailOrPhone || phone || '';
      const isEmail = identifier.includes('@');
      const response = await api.post<{ token: string; user: UserProfile }>('/auth/register', {
        name, 
        email_or_phone: identifier,
        email: isEmail ? identifier : (emailOrPhone || ''), 
        password, 
        phone: !isEmail ? identifier : (phone || ''),
      });
      setToken(response.token);
      setUser(response.user);
      setIsAdmin(false);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signInWithGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}/auth/google`;
    return { error: null };
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch { }
    removeToken();
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('auth_user');
  };

  const session = getToken() ? { token: getToken()! } : null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile: user, 
      isAdmin, 
      isSuperAdmin, 
      isStaff, 
      loading, 
      hasRole, 
      hasPermission, 
      signIn, 
      signUp, 
      signInWithGoogle, 
      signOut, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};