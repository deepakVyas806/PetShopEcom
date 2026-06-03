import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function useSignInContainer() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const redirectTo   = searchParams.get("redirect") || "/";
  const initialView  = searchParams.get("view") === "signup" ? "signup" : "login";

  const { isAuthenticated, hydrated } = useAuth();
  const [view, setView] = useState(initialView);

  // Redirect away once the user is authenticated
  useEffect(() => {
    if (isAuthenticated && hydrated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, hydrated, router, redirectTo]);

  return { view, setView };
}
