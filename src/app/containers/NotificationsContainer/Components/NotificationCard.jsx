"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

function ActionButton({ action }) {
  const cls =
    action.variant === "primary"
      ? "px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-medium hover:shadow-md transition-all border-none cursor-pointer"
      : "px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-lg text-xs font-medium hover:bg-surface-container transition-all bg-transparent cursor-pointer";

  if (action.href && action.href !== "#") {
    return <Link href={action.href} className={cls}>{action.label}</Link>;
  }
  return <button className={cls}>{action.label}</button>;
}

/* Replaces the promo code text with a highlighted span */
function Body({ text, highlight }) {
  if (!highlight) return <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{text}</p>;
  const parts = text.split(highlight);
  return (
    <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
      {parts[0]}
      <span className="font-bold text-primary">{highlight}</span>
      {parts[1]}
    </p>
  );
}

export default function NotificationCard({ notification, onMarkRead }) {
  const { id, icon, iconBg, iconColor, title, body, highlight, time, read, actions } = notification;

  const handleClick = () => {
    if (!read) onMarkRead(id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer",
        read
          ? "bg-surface-container-low/40 border border-outline-variant/30 hover:bg-white"
          : "border border-[#F3E8FF] hover:shadow-lg hover:-translate-y-0.5",
        !read && "bg-white/80"
      )}
      style={!read ? { backdropFilter: "blur(12px)" } : {}}
    >
      {/* Left unread accent bar */}
      {!read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
      )}

      {/* Icon */}
      <div className={cn("w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center", iconBg, iconColor)}>
        <span className="material-symbols-outlined leading-none" style={{ fontSize: 18 }}>{icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className={cn("text-xs font-bold leading-snug", read ? "text-on-surface-variant" : "text-on-surface")}>
            {title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] text-on-surface-variant">{time}</span>
            {!read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
          </div>
        </div>

        {/* Body */}
        <Body text={body} highlight={highlight} />

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {actions.map((a) => <ActionButton key={a.label} action={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
