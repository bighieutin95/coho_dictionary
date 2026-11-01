import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { KdUser, UserRole } from '../types';
import { getStoredUsers } from '../services/api';

interface AuthContextType {
  user: KdUser | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<KdUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra session từ Supabase nếu đã cấu hình
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setToken(session.access_token);
          mapSupabaseUserToKdUser(session.user);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setToken(session.access_token);
          mapSupabaseUserToKdUser(session.user);
        } else {
          setUser(null);
          setToken(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Chế độ demo mặc định ban đầu: giả lập vai trò Admin để trải nghiệm đầy đủ
      const stored = localStorage.getItem('koho_active_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setDefaultDemoAdmin();
        }
      } else {
        setDefaultDemoAdmin();
      }
      setLoading(false);
    }
  }, []);

  const setDefaultDemoAdmin = () => {
    const adminUser: KdUser = {
      id: 'usr-admin-1',
      email: 'admin.koho@gmail.com',
      full_name: 'Quản trị viên Hệ thống (Demo)',
      avatar_url: null,
      role: 'ADMIN',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setUser(adminUser);
    localStorage.setItem('koho_active_user', JSON.stringify(adminUser));
  };

  const mapSupabaseUserToKdUser = (sbUser: any) => {
    const defaultRole: UserRole =
      sbUser.email?.toLowerCase() === (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase()
        ? 'ADMIN'
        : 'USER';

    const kdUser: KdUser = {
      id: sbUser.id,
      email: sbUser.email || '',
      full_name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Thành viên',
      avatar_url: sbUser.user_metadata?.avatar_url || null,
      role: defaultRole,
      is_active: true,
      created_at: sbUser.created_at || new Date().toISOString(),
    };
    setUser(kdUser);
  };

  const signInWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
    } else {
      alert('Ứng dụng đang ở chế độ Xem trước cục bộ. Bạn có thể dùng tính năng Chuyển đổi vai trò Demo bên dưới!');
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('koho_active_user');
  };

  const switchDemoRole = (role: UserRole) => {
    const all = getStoredUsers();
    const found = all.find((u) => u.role === role) || {
      id: `usr-${role.toLowerCase()}`,
      email: `${role.toLowerCase()}@koho.vn`,
      full_name: `Tài khoản ${role}`,
      avatar_url: null,
      role,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setUser(found);
    localStorage.setItem('koho_active_user', JSON.stringify(found));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signInWithGoogle,
        signOut,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
