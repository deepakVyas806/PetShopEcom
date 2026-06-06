"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Field, ErrorBanner, SubmitButton } from "./SharedUI";
import { IconUser, IconEye, IconEyeOff, IconPaw, IconCheck } from "@/lib/icons";

function calcStrength(pw) {
  let s = 0;
  if (pw.length > 5) s++;
  if (pw.length > 8 && /[A-Z]/.test(pw)) s++;
  if (pw.length > 10 && /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH_META = [
  { label: "Weak",      color: "#ba1a1a" },
  { label: "Fair",      color: "#f59e0b" },
  { label: "Strong",    color: "#732ee4" },
  { label: "Excellent", color: "#10b981" },
];

const PET_OPTIONS = [
  { value: "dogs",  label: "Dogs",  Icon: IconPaw },
  { value: "cats",  label: "Cats",  Icon: IconPaw },
  { value: "birds", label: "Birds", Icon: IconPaw },
  { value: "fish",  label: "Fish",  Icon: IconPaw },
];

export default function SignupForm({ onLogin }) {
  const { signup, loading, error, clearError } = useAuth();

  const [name,       setName]       = useState("");
  const [email,      setEmail]      = useState("");
  const [mobile,     setMobile]     = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [petPrefs,   setPetPrefs]   = useState([]);
  const [agreed,     setAgreed]     = useState(false);
  const [confirmErr, setConfirmErr] = useState("");

  const strength     = calcStrength(password);
  const strengthMeta = password ? (STRENGTH_META[strength - 1] ?? STRENGTH_META[0]) : null;

  const togglePet = (val) =>
    setPetPrefs((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmErr("");
    if (password !== confirm) { setConfirmErr("Passwords do not match."); return; }
    await signup(name, email, password, { mobile, petPrefs });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <ErrorBanner message={error} />}

      {/* Full name */}
      <Field id="s-name" label="Full Name" placeholder="Your full name"
        value={name} onChange={(v) => { setName(v); clearError(); }}>
        <IconUser size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" weight="regular" />
      </Field>

      {/* Email + mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field id="s-email" label="Email" type="email" placeholder="name@example.com"
          value={email} onChange={(v) => { setEmail(v); clearError(); }} />
        <Field id="s-mobile" label="Mobile" type="tel" placeholder="+1 (555) 000-0000"
          value={mobile} onChange={setMobile} required={false} />
      </div>

      {/* Password + strength */}
      <div className="space-y-1">
        <label htmlFor="s-pw" className="block text-xs font-medium text-on-surface-variant ml-0.5">
          Password
        </label>
        <div className="relative">
          <input id="s-pw" type={showPw ? "text" : "password"} placeholder="••••••••" required
            value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }}
            className="w-full px-3 py-2 pr-10 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-1 focus:border-primary outline-none text-xs text-on-surface placeholder:text-on-surface-variant/50 transition-all"
          />
          <button type="button" tabIndex={-1} onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary bg-transparent border-none cursor-pointer p-0">
            {showPw ? <IconEyeOff size={18} weight="regular" /> : <IconEye size={18} weight="regular" />}
          </button>
        </div>
        {/* Strength bars */}
        <div className="flex gap-1 mt-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 rounded-full transition-colors duration-300"
              style={{ height: 3, backgroundColor: password && i <= strength && strengthMeta ? strengthMeta.color : "#ccc3d8" }}
            />
          ))}
        </div>
        {password && strengthMeta && (
          <span className="text-xs font-medium" style={{ color: strengthMeta.color }}>
            {strengthMeta.label}
          </span>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1">
        <label htmlFor="s-confirm" className="block text-xs font-medium text-on-surface-variant ml-0.5">
          Confirm Password
        </label>
        <input id="s-confirm" type="password" placeholder="••••••••" required
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setConfirmErr(""); }}
          className={cn(
            "w-full px-3 py-2 bg-surface-container-low border rounded-lg focus:ring-1 outline-none text-xs text-on-surface placeholder:text-on-surface-variant/50 transition-all",
            confirmErr ? "border-error focus:border-error" : "border-outline-variant focus:border-primary"
          )}
        />
        {confirmErr && <p className="text-xs ml-0.5" style={{ color: "#ba1a1a" }}>{confirmErr}</p>}
      </div>

      {/* Pet preferences */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-on-surface-variant ml-0.5">
          Pets <span className="font-normal text-on-surface-variant/60">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PET_OPTIONS.map(({ value, label, Icon }) => {
            const active = petPrefs.includes(value);
            return (
              <button key={value} type="button" onClick={() => togglePet(value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium transition-all cursor-pointer",
                  active ? "bg-primary text-on-primary border-primary"
                         : "border-outline-variant bg-transparent hover:bg-primary/5 text-on-surface"
                )}>
                <Icon size={14} weight="regular" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2">
        <button type="button" onClick={() => setAgreed(!agreed)}
          className="flex-shrink-0 mt-0.5 bg-transparent border-none cursor-pointer p-0">
          <div className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
            agreed ? "bg-primary border-primary" : "border-outline-variant bg-surface"
          )}>
            {agreed && (
              <IconCheck size={10} weight="bold" className="text-on-primary" />
            )}
          </div>
        </button>
        <span className="text-xs text-on-surface-variant leading-snug">
          I agree to the{" "}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
        </span>
      </div>

      <SubmitButton loading={loading} label="Create Account" loadingLabel="Creating account…" disabled={!agreed} />

      {/* Sign in link */}
      <p className="text-center text-xs text-on-surface-variant pt-1">
        Already have an account?{" "}
        <button type="button" onClick={onLogin} className="text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer p-0">
          Sign in
        </button>
      </p>
    </form>
  );
}
