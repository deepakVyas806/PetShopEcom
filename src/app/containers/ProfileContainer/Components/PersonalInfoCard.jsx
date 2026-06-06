"use client";

import { IconMail, IconPhone, IconPaw, IconLocation, IconEdit, IconShield } from "@/lib/icons";

const GLASS = "bg-white/80 backdrop-blur-xl border border-[#F3E8FF] rounded-xl shadow-sm overflow-hidden";

function Field({ Icon, label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-0.5">{label}</p>
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-on-surface-variant leading-none" weight="regular" />
        <span className="text-xs text-on-surface truncate">{value}</span>
      </div>
    </div>
  );
}

export default function PersonalInfoCard({ user }) {
  const fields = [
    { Icon: IconMail,     label: "Email",     value: user?.email || "name@example.com" },
    { Icon: IconPhone,    label: "Mobile",    value: "+1 (555) 123-4567"               },
    { Icon: IconPaw,      label: "Pet Type",  value: "Dogs · Golden Retriever"          },
    { Icon: IconLocation, label: "Location",  value: "San Francisco, CA"               },
  ];

  return (
    <section className={GLASS}>
      {/* Cover */}
      <div className="h-16 bg-primary/10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #7c3aed 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
      </div>

      {/* Body */}
      <div className="px-4 pb-4 -mt-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

          {/* Avatar + name */}
          <div className="flex items-end gap-3">
            <div className="relative group flex-shrink-0">
              <div className="w-16 h-16 rounded-xl border-2 border-white bg-primary/10 flex items-center justify-center shadow-md text-2xl select-none">
                {user?.avatar || "🐾"}
              </div>
              <button
                className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer flex items-center justify-center"
                aria-label="Edit photo"
              >
                <IconEdit size={12} weight="regular" />
              </button>
            </div>
            <div className="mb-1">
              <h1 className="text-xs font-bold text-on-surface leading-tight">{user?.name || "User"}</h1>
              <p className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                <IconShield size={12} className="text-primary leading-none" weight="fill" />
                Premium Member · 2024
              </p>
            </div>
          </div>

          {/* Edit button */}
          <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:shadow-md transition-all active:scale-95 border-none cursor-pointer self-start sm:self-auto">
            <IconEdit size={14} className="leading-none" weight="regular" />
            Edit Profile
          </button>
        </div>

        {/* Fields */}
        <div className="mt-4 pt-3 border-t border-outline-variant/20 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fields.map((f) => <Field key={f.label} Icon={f.Icon} label={f.label} value={f.value} />)}
        </div>
      </div>
    </section>
  );
}
