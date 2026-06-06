"use client";

import { useState } from "react";
import { Field, SubmitButton } from "./SharedUI";
import { IconMail, IconArrowLeft } from "@/lib/icons";

export default function ForgotForm({ onBack }) {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <IconMail size={28} className="text-primary" weight="duotone" />
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface">Check your inbox</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Reset link sent to <strong className="text-on-surface">{email}</strong>
          </p>
        </div>
        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-xl border border-outline-variant text-sm text-on-surface font-medium hover:bg-surface-container-low transition-colors cursor-pointer bg-transparent"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-on-surface-variant">
        Enter your email and we'll send a reset link.
      </p>

      <Field id="reset-email" label="Email address" type="email"
        placeholder="name@example.com" value={email} onChange={setEmail}>
        <IconMail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" weight="regular" />
      </Field>

      <SubmitButton loading={loading} label="Send Reset Link" loadingLabel="Sending…" />

      <button type="button" onClick={onBack}
        className="w-full py-2 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border-none flex items-center justify-center gap-1">
        <IconArrowLeft size={14} weight="bold" />
        Back to Sign In
      </button>
    </form>
  );
}
