"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Initial sync with localStorage/system preference
    const stored = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (stored === "dark" || (!stored && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl border border-brand-foreground/10 hover:border-brand-primary bg-brand-card/50 hover:bg-brand-primary/10 text-brand-foreground hover:text-brand-primary transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 animate-spin-slow" />
      ) : (
        <Moon className="w-5 h-5 animate-pulse" />
      )}
    </button>
  );
}
