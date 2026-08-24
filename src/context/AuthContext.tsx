import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "@/services/auth";

export type UserRole = "reader" | "writer" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// 1. أضفنا دالة التسجيل (register) هنا وأصلحنا دالة الدخول (login)
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>; 
  register: (data: any) => Promise<void>; 
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // 🚀 تحسين: جرب تحميل بيانات المستخدم من الكاش أولاً فوراً
        const cachedUser = localStorage.getItem('cached_user');
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser) as User);
          } catch {}
        }

        // ثم تحقق من السيرفر في الخلفية لتحديث البيانات
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser as User);
          localStorage.setItem('cached_user', JSON.stringify(currentUser));
        } else {
          // التوكن منتهي أو غير صالح
          localStorage.removeItem('cached_user');
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser, token } = await authService.login(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("cached_user", JSON.stringify(loggedInUser));
      setUser(loggedInUser as User);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const { user: newUser, token } = await authService.register(data);
      localStorage.setItem("token", token);
      localStorage.setItem("cached_user", JSON.stringify(newUser));
      setUser(newUser as User);
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("cached_user");
    setUser(null);
  };

  return (
    // 4. توفير دالة التسجيل (register) لكل أجزاء الموقع
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};