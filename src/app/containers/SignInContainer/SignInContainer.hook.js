import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function useSignInContainer() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const redirectTo  = searchParams.get("redirect") || null;
  const initialView = searchParams.get("view") === "signup" ? "signup" : "login";

  const { isAuthenticated, hydrated, user } = useAuth();
  const [view, setView] = useState(initialView);

  // Redirect away once the user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !hydrated) return;

    if (user?.role === "admin") {
      // Admin always goes to the admin panel
      router.replace("/admin");
    } else {
      // Customer goes to the requested redirect or homepage
      router.replace(redirectTo || "/");
    }
  }, [isAuthenticated, hydrated, user, router, redirectTo]);

  return { view, setView };
}
