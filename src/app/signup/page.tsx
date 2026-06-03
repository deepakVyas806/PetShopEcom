"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Signup now lives inside /signin — redirect immediately
export default function SignupPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/signin?view=signup");
  }, [router]);
  return null;
}
