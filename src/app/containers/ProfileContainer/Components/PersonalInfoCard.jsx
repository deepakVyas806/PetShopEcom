"use client";

const GLASS = "bg-white/80 backdrop-blur-xl border border-[#F3E8FF] rounded-xl shadow-sm overflow-hidden";

function Field({ icon, label, value }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-0.5">{label}</p>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-on-surface-variant leading-none" style={{ fontSize: 14 }}>{icon}</span>
        <span className="text-xs text-on-surface truncate">{value}</span>
      </div>
    </div>
  );
}

export default function PersonalInfoCard({ user }) {
  const fields = [
    { icon: "mail",         label: "Email",     value: user?.email || "name@example.com" },
    { icon: "phone_iphone", label: "Mobile",    value: "+1 (555) 123-4567"               },
    { icon: "pets",         label: "Pet Type",  value: "Dogs · Golden Retriever"          },
    { icon: "location_on",  label: "Location",  value: "San Francisco, CA"               },
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
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>edit</span>
              </button>
            </div>
            <div className="mb-1">
              <h1 className="text-xs font-bold text-on-surface leading-tight">{user?.name || "User"}</h1>
              <p className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-primary leading-none" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>verified</span>
                Premium Member · 2024
              </p>
            </div>
          </div>

          {/* Edit button */}
          <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:shadow-md transition-all active:scale-95 border-none cursor-pointer self-start sm:self-auto">
            <span className="material-symbols-outlined leading-none" style={{ fontSize: 14 }}>edit</span>
            Edit Profile
          </button>
        </div>

        {/* Fields */}
        <div className="mt-4 pt-3 border-t border-outline-variant/20 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fields.map((f) => <Field key={f.label} {...f} />)}
        </div>
      </div>
    </section>
  );
}
