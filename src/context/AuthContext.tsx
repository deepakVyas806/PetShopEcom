"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";

export type UserRole = "customer" | "admin";

export interface AuthUser {
  name:       string;
  email:      string;
  avatar:     string;
  role:       UserRole;
  mobile?:    string;
  petPrefs?:  string[];
  createdAt?: string;
}

interface SignupOpts {
  mobile?: string;
  petPrefs?: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, opts?: SignupOpts) => Promise<void>;
  googleLogin: (accessToken: string) => Promise<void>;
  updateUser: (updates: Partial<Pick<AuthUser, "name" | "avatar" | "mobile" | "petPrefs">>) => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "petshop_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { login: storeLogin, logout: storeLogout } = useStore();
  const storeLoginRef  = useRef(storeLogin);
  const storeLogoutRef = useRef(storeLogout);
  storeLoginRef.current  = storeLogin;
  storeLogoutRef.current = storeLogout;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user,            setUser]            = useState<AuthUser | null>(null);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [hydrated,        setHydrated]        = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw) as { user: AuthUser; token?: string };
        if (session.user?.email) {
          setIsAuthenticated(true);
          setUser(session.user);
          storeLoginRef.current(session.user.role ?? "customer", session.user.email);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const finishLogin = (userData: AuthUser, token: string) => {
    setIsAuthenticated(true);
    setUser(userData);
    storeLoginRef.current(userData.role, userData.email);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: userData, token }));
    document.cookie = `artpet_role=${userData.role}; path=/; SameSite=Lax`;
    setError(null);
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (userData.role === "admin") {
      router.push("/admin");
    } else {
      router.push(redirect ?? "/profile");
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ user: any; token: string }>("/auth/login", { email, password });
      const u: AuthUser = {
        name:     res.user.name,
        email:    res.user.email,
        avatar:   res.user.avatar ?? (res.user.role === "admin" ? "👑" : "🐾"),
        role:     res.user.role,
        mobile:   res.user.mobile,
        petPrefs: res.user.petPrefs,
      };
      finishLogin(u, res.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, opts?: SignupOpts) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ user: any; token: string }>("/auth/signup", {
        name, email, password,
        mobile:   opts?.mobile,
        petPrefs: opts?.petPrefs,
      });
      const u: AuthUser = {
        name:     res.user.name,
        email:    res.user.email,
        avatar:   res.user.avatar ?? "🐾",
        role:     res.user.role,
        mobile:   res.user.mobile,
        petPrefs: res.user.petPrefs,
      };
      finishLogin(u, res.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (accessToken: string) => {
    setLoading(true);
    try {
      const res = await api.post<{ user: any; token: string }>("/auth/google", { access_token: accessToken });
      const u: AuthUser = {
        name:     res.user.name,
        email:    res.user.email,
        avatar:   res.user.avatar ?? "🐾",
        role:     res.user.role,
        mobile:   res.user.mobile,
        petPrefs: res.user.petPrefs,
      };
      finishLogin(u, res.token);
    } finally {
      setLoading(false);
      // Errors bubble up to the caller — keeps shared error state for form errors only
    }
  };

  const updateUser = useCallback((updates: Partial<Pick<AuthUser, "name" | "avatar" | "mobile" | "petPrefs">>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, user: updated }));
        }
      } catch {}
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    document.cookie = "artpet_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogoutRef.current();
    router.push("/signin");
  }, [router]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, error, hydrated, login, signup, googleLogin, updateUser, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
