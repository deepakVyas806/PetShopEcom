"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Field, ErrorBanner, SubmitButton } from "./SharedUI";

export default function LoginForm({ onForgot }) {
  const router = useRouter();
  const { login, loading, error, clearError } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <ErrorBanner message={error} />}

      <Field
        id="email"
        label="Email or Mobile"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(v) => { setEmail(v); clearError(); }}
      >
        <span
          className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          style={{ fontSize: 18 }}
        >
          mail
        </span>
      </Field>

      <Field
        id="password"
        label="Password"
        type={showPw ? "text" : "password"}
        placeholder="••••••••"
        value={password}
        onChange={(v) => { setPassword(v); clearError(); }}
        labelRight={
          <button
            type="button"
            onClick={onForgot}
            className="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Forgot password?
          </button>
        }
      >
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPw(!showPw)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary bg-transparent border-none cursor-pointer p-0"
        >
          <span className="material-symbols-outlined leading-none" style={{ fontSize: 18 }}>
            {showPw ? "visibility_off" : "visibility"}
          </span>
        </button>
      </Field>

      {/* Remember me */}
      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          className="w-3.5 h-3.5 rounded accent-primary"
        />
        <label htmlFor="remember" className="text-xs text-on-surface-variant cursor-pointer">
          Remember me
        </label>
      </div>

      <SubmitButton loading={loading} label="Sign In" loadingLabel="Signing in…" />

      {/* Guest */}
      <button
        type="button"
        onClick={() => router.push("/")}
        className="w-full py-2 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
      >
        Continue as guest
      </button>

      {/* Sign up link */}
      <p className="text-center text-xs text-on-surface-variant pt-1">
        Don't have an account?{" "}
        <Link href="/signin?view=signup" className="text-primary font-semibold hover:underline">
          Create one free
        </Link>
      </p>
    </form>
  );
}
