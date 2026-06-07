"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useStore } from "@/context/StoreContext";

export type UserRole = "customer" | "admin";

export interface AuthUser {
  name:   string;
  email:  string;
  avatar: string;
  role:   UserRole;
}

/** Emails that are treated as admin — replace with real backend role check */
const ADMIN_EMAILS = ["admin@artpetshop.in", "deepak.v@kansoftware.com"];

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
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "petshop_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login: storeLogin, logout: storeLogout } = useStore();
  const storeLoginRef = useRef(storeLogin);
  const storeLogoutRef = useRef(storeLogout);
  storeLoginRef.current = storeLogin;
  storeLogoutRef.current = storeLogout;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user,            setUser]            = useState<AuthUser | null>(null);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [hydrated,        setHydrated]        = useState(false);

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored) as { user: AuthUser };
        if (session.user?.email) {
          setIsAuthenticated(true);
          setUser(session.user);
          storeLoginRef.current("customer", session.user.email);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const finishLogin = (userData: AuthUser) => {
    setIsAuthenticated(true);
    setUser(userData);
    storeLoginRef.current(userData.role, userData.email);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user: userData }));
    // Set role cookie so middleware can read it (httpOnly not possible client-side,
    // but fine until real backend provides a signed cookie)
    document.cookie = `artpet_role=${userData.role}; path=/; SameSite=Lax`;
    setError(null);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      if (!email.trim() || !password.trim()) throw new Error("Please fill in all fields.");
      if (password.length < 6) throw new Error("Invalid credentials. Please try again.");
      const role: UserRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "customer";
      finishLogin({
        name: email
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        avatar: role === "admin" ? "👑" : "🐾",
        role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    _opts?: SignupOpts
  ) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      if (!name.trim() || !email.trim() || !password.trim())
        throw new Error("Please fill in all fields.");
      if (!/\S+@\S+\.\S+/.test(email))
        throw new Error("Please enter a valid email address.");
      if (password.length < 6)
        throw new Error("Password must be at least 6 characters.");
      finishLogin({ name, email, avatar: "🐾", role: "customer" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    document.cookie = "artpet_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    storeLogoutRef.current();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, error, hydrated, login, signup, logout, clearError }}
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
