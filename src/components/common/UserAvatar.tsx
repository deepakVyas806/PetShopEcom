"use client";

interface UserAvatarProps {
  avatar?: string | null;
  name?: string;
  size?: string;        // Tailwind size classes e.g. "w-9 h-9"
  textSize?: string;    // Tailwind text size e.g. "text-lg"
  className?: string;
}

export default function UserAvatar({
  avatar,
  name,
  size = "w-9 h-9",
  textSize = "text-lg",
  className = "",
}: UserAvatarProps) {
  const isUrl = avatar?.startsWith("http");

  const base = `${size} rounded-full flex items-center justify-center shrink-0 bg-primary/10 overflow-hidden ${className}`;

  if (isUrl) {
    return (
      <span className={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar!}
          alt={name ?? "User avatar"}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fall back to initial letter on broken image
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </span>
    );
  }

  return (
    <span className={`${base} ${textSize} leading-none select-none text-primary`}>
      {avatar || name?.[0]?.toUpperCase() || "👤"}
    </span>
  );
}
