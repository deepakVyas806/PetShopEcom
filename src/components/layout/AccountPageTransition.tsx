"use client";

import { usePathname } from "next/navigation";

export default function AccountPageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-account-enter">
      {children}
    </div>
  );
}
