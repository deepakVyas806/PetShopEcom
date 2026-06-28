"use client";

/** Base shimmer block */
export function Sk({ w = "w-full", h = "h-4", rounded = "rounded-lg", className = "" }) {
  return (
    <div className={`animate-shimmer ${w} ${h} ${rounded} ${className}`} />
  );
}

/** Matches a single stat card (stripe | icon | label + value + sub) */
export function SkStatCard() {
  return (
    <div className="relative bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-3.5 flex items-center gap-3 overflow-hidden">
      <div className="absolute left-0 inset-y-0 w-[3px] rounded-r-full animate-shimmer" />
      <div className="w-8 h-8 rounded-xl animate-shimmer shrink-0 ml-1" />
      <div className="flex-1 space-y-2 min-w-0">
        <Sk h="h-2" w="w-16" />
        <Sk h="h-4" w="w-24" />
        <Sk h="h-2" w="w-20" />
      </div>
    </div>
  );
}

/** One skeleton table row — cols controls number of shimmer cells */
export function SkTableRow({ cols = 5, hasCheckbox = true, hasAvatar = false }) {
  return (
    <tr>
      {hasCheckbox && (
        <td className="px-4 py-3.5">
          <div className="w-4 h-4 rounded animate-shimmer" />
        </td>
      )}
      {hasAvatar && (
        <td className="px-4 py-3.5">
          <div className="w-8 h-8 rounded-xl animate-shimmer" />
        </td>
      )}
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-3 rounded-lg animate-shimmer"
            style={{ width: `${50 + ((i * 37) % 40)}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

/** Full skeleton table block */
export function SkTable({ rows = 8, cols = 5, hasCheckbox = true, hasAvatar = false }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-outline-variant/20">
          {hasCheckbox && <th className="px-4 py-3 w-8"><div className="w-4 h-4 rounded animate-shimmer" /></th>}
          {hasAvatar   && <th className="px-4 py-3 w-12" />}
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="px-4 py-3 text-left">
              <div className="h-2.5 w-16 rounded animate-shimmer" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant/10">
        {Array.from({ length: rows }).map((_, i) => (
          <SkTableRow key={i} cols={cols} hasCheckbox={hasCheckbox} hasAvatar={hasAvatar} />
        ))}
      </tbody>
    </table>
  );
}

/** 2-line text block (e.g. inside a card) */
export function SkText({ lines = 2 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Sk key={i} h="h-3" w={i % 2 === 0 ? "w-full" : "w-3/4"} />
      ))}
    </div>
  );
}
