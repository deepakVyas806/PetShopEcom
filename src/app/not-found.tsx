'use client'
import Link from "next/link";
import { IconPaw } from "@/lib/icons";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white/80 backdrop-blur border border-[#F3E8FF] rounded-2xl shadow-lg p-8 max-w-sm w-full text-center space-y-4">
        {/* Paw print icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <IconPaw size={32} className="text-primary" weight="fill" />
          </div>
        </div>

        {/* 404 label */}
        <p className="text-[10px] font-black tracking-widest text-primary/50 uppercase">
          Error 404
        </p>

        {/* Heading */}
        <h1 className="text-sm font-extrabold text-on-surface leading-tight">
          Page not found
        </h1>

        {/* Message */}
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Looks like this page wandered off. The URL may have changed or the
          content no longer exists.
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 justify-center pt-1">
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:shadow-md active:scale-95 transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/marketplace"
            className="px-4 py-2 rounded-full border-2 border-primary text-primary bg-white text-xs font-bold hover:bg-primary/5 active:scale-95 transition-all"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  );
}
