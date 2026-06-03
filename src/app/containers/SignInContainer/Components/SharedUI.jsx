"use client";

import { cn } from "@/lib/utils";

export function Field({
  id, label, type = "text", placeholder, value, onChange,
  labelRight, children, required = true,
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-xs font-medium text-on-surface-variant ml-0.5">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-1 focus:border-primary outline-none transition-all text-xs text-on-surface placeholder:text-on-surface-variant/50"
        />
        {children}
      </div>
    </div>
  );
}

export function ErrorBanner({ message }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-error-container/50 border border-error/20">
      <span className="material-symbols-outlined text-error flex-shrink-0" style={{ fontSize: 16 }}>
        error
      </span>
      <p className="text-xs text-on-error-container font-medium">{message}</p>
    </div>
  );
}

export function SubmitButton({ loading, label, loadingLabel, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none cursor-pointer"
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingLabel}
        </>
      ) : label}
    </button>
  );
}
