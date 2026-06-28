"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  IconShipping, IconTag, IconUser, IconBell, IconCheckCircle,
  IconInfo, IconWarning, IconGift, IconStar, IconPaw, IconDelete,
} from "@/lib/icons";

const ICON_MAP = {
  local_shipping: IconShipping,
  sell:           IconTag,
  account_circle: IconUser,
  notifications:  IconBell,
  check_circle:   IconCheckCircle,
  info:           IconInfo,
  warning:        IconWarning,
  gift:           IconGift,
  star:           IconStar,
  pets:           IconPaw,
};

function ActionButton({ action }) {
  const cls =
    action.variant === "primary"
      ? "px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-medium hover:shadow-brand-sm transition-all border-none cursor-pointer"
      : "px-3 py-1.5 border border-outline-variant text-on-surface-variant rounded-xl text-xs font-medium hover:bg-surface-container transition-all bg-transparent cursor-pointer";

  if (action.href && action.href !== "#") {
    return <Link href={action.href} className={cls}>{action.label}</Link>;
  }
  return <button className={cls}>{action.label}</button>;
}

function Body({ text, highlight }) {
  if (!highlight || !text.includes(highlight)) {
    return <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{text}</p>;
  }
  const idx = text.indexOf(highlight);
  return (
    <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
      {text.slice(0, idx)}
      <span className="font-bold text-primary">{highlight}</span>
      {text.slice(idx + highlight.length)}
    </p>
  );
}

export default function NotificationCard({ notification, onMarkRead, onDelete }) {
  const router = useRouter();
  const { id, icon, iconBg, iconColor, title, body, highlight, time, read, actions = [] } = notification;

  const handleClick = (e) => {
    if (e.defaultPrevented) return;
    if (!read) onMarkRead(id);
    // Navigate to first primary action href if exists
    const primary = actions.find(a => a.variant === "primary" && a.href && a.href !== "#");
    if (primary) router.push(primary.href);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  const Icon = ICON_MAP[icon] ?? IconBell;

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer group",
        read
          ? "bg-surface-container-low/40 border border-outline-variant/30 hover:bg-surface-container-lowest"
          : "bg-surface-container-lowest border border-outline-variant/20 hover:shadow-card-md hover:-translate-y-0.5",
      )}
    >
      {/* Unread accent bar */}
      {!read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />}

      {/* Icon */}
      <div className={cn("w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center", iconBg || "bg-primary/10", iconColor || "text-primary")}>
        <Icon size={18} weight="regular" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className={cn("text-xs font-bold leading-snug", read ? "text-on-surface-variant" : "text-on-surface")}>
            {title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] text-on-surface-variant">{time}</span>
            {!read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
          </div>
        </div>

        <Body text={body || ""} highlight={highlight} />

        {actions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
            {actions.map((a) => <ActionButton key={a.label} action={a} />)}
          </div>
        )}
      </div>

      {/* Delete button — visible on hover */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-all border-none bg-transparent cursor-pointer"
        title="Delete notification"
      >
        <IconDelete size={13} weight="regular" />
      </button>
    </div>
  );
}
