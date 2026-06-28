"use client";

import { useState, useEffect } from "react";
import { IconSearch, IconClose } from "@/lib/icons";

export default function SearchInput({
  value       = "",
  onChange,
  placeholder = "Search…",
  debounce    = 0,
  className   = "",
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    if (!debounce) return;
    const t = setTimeout(() => onChange?.(local), debounce);
    return () => clearTimeout(t);
  }, [local, debounce, onChange]);

  const handleChange = (e) => {
    setLocal(e.target.value);
    if (!debounce) onChange?.(e.target.value);
  };

  const clear = () => {
    setLocal("");
    onChange?.("");
  };

  return (
    <div className={`relative ${className}`}>
      <IconSearch
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
        weight="regular"
      />
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-8 pr-8 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant/50"
      />
      {local && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-on-surface-variant hover:text-on-surface p-0"
        >
          <IconClose size={12} weight="bold" />
        </button>
      )}
    </div>
  );
}
