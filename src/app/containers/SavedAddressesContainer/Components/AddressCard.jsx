"use client";

import { IconStar, IconEdit, IconDelete, IconCheck, IconPhone, IconLocation, IconHome } from "@/lib/icons";

const ADDRESS_ICON_MAP = {
  location_on: IconLocation,
  home:        IconHome,
  business:    IconLocation,
};

const glass = {
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid #F3E8FF",
  boxShadow: "0 4px 20px -4px rgba(124,58,237,0.07)",
};

export default function AddressCard({ address, onSetDefault, onDelete }) {
  const id = address._id ?? address.id;
  const { name, type, label, icon, line1, line2, city, state, country, pincode, phone, isDefault } = address;

  const IC = ADDRESS_ICON_MAP[icon] ?? IconLocation;

  // Full address string
  const addressLines = [line1, line2, city && state ? `${city}, ${state}` : city || state, pincode, country]
    .filter(Boolean);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group"
      style={glass}
    >
      {/* Decorative bg blob on default card */}
      {isDefault && (
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-primary/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      )}

      {/* Top row: badge + action buttons */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        {isDefault ? (
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
            <IconStar size={12} weight="fill" />
            Default
          </span>
        ) : (
          <span className="text-xs font-medium bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full">
            {type || "Other"}
          </span>
        )}

        {/* Circular action buttons */}
        <div className="flex gap-1.5">
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all cursor-pointer bg-transparent border-none"
            title="Edit"
          >
            <IconEdit size={16} weight="bold" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-all cursor-pointer bg-transparent border-none"
            title="Delete"
          >
            <IconDelete size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* Name + label */}
      <p className="text-sm font-bold text-on-surface mb-0.5">{name}</p>
      {label && <p className="text-xs text-on-surface-variant mb-4">{label}</p>}

      {/* Address details */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <IC size={13} className="text-primary" weight="regular" />
          </span>
          <p className="text-xs text-on-surface leading-relaxed">
            {addressLines.join(", ")}
          </p>
        </div>

        {phone && (
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <IconPhone size={13} className="text-primary" weight="regular" />
            </span>
            <p className="text-xs text-on-surface">{phone}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3.5 border-t border-outline-variant/20 flex items-center justify-between">
        <span className="text-xs font-semibold text-outline uppercase tracking-wider">{type || "Other"}</span>
        {isDefault ? (
          <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
            <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <IconCheck size={11} weight="fill" />
            </span>
            Active default
          </span>
        ) : (
          <button
            onClick={() => onSetDefault(id)}
            className="text-xs text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Set as default
          </button>
        )}
      </div>
    </div>
  );
}
