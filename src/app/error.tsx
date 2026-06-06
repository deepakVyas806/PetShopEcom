"use client";

import { IconCancel } from "@/lib/icons";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white/80 backdrop-blur border border-[#F3E8FF] rounded-2xl shadow-lg p-8 max-w-sm w-full text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center">
            <IconCancel size={32} className="text-error" weight="fill" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-sm font-extrabold text-on-surface leading-tight">
          Something went wrong
        </h1>

        {/* Error message */}
        {error?.message && (
          <p className="text-[10px] text-on-surface-variant bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2 font-mono break-words">
            {error.message}
          </p>
        )}

        <p className="text-xs text-on-surface-variant leading-relaxed">
          An unexpected error occurred. You can try again or return home.
        </p>

        {/* Actions */}
        <div className="flex gap-2 justify-center pt-1">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:shadow-md active:scale-95 transition-all border-none cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    </main>
  );
}
