"use client";

const glassCard = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid #F3E8FF",
  boxShadow: "0 10px 25px -5px rgba(124,58,237,0.10)",
};


function ProfileField({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold text-outline uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-3 text-on-background">
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>
          {icon}
        </span>
        <span className="text-xs">{value}</span>
      </div>
    </div>
  );
}

export default function PersonalInfoCard({ user }) {
  const fields = [
    { icon: "mail",         label: "Email Address", value: user?.email || "name@example.com"    },
    { icon: "phone_iphone", label: "Mobile Number",  value: "+1 (555) 123-4567"                  },
    { icon: "pets",         label: "Preferred Pet",  value: "Dogs (Golden Retriever)"             },
  ];

  return (
    <section className="rounded-xl overflow-hidden" style={glassCard}>

      {/* Cover banner with dot pattern */}
      <div className="h-32 bg-primary/10 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #7c3aed 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Body */}
      <div className="px-8 pb-8 -mt-16 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          {/* Avatar + name */}
          <div className="flex items-end gap-5">
            {/* Avatar circle */}
            <div className="relative group flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl border-4 border-surface-container-lowest bg-primary/10 flex items-center justify-center shadow-lg text-5xl select-none">
                {user?.avatar || "🐾"}
              </div>
              <button
                className="absolute bottom-2 right-2 bg-primary text-on-primary p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-none cursor-pointer flex items-center justify-center"
                style={{ fontSize: 0 }}
                aria-label="Edit photo"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
              </button>
            </div>

            {/* Name + badge */}
            <div className="mb-2">
              <h1 className="text-sm font-bold text-on-background leading-tight">
                {user?.name || "User"}
              </h1>
              <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>verified</span>
                Premium Member since 2024
              </p>
            </div>
          </div>

          {/* Edit profile button */}
          <button
            className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:shadow-lg transition-all duration-200 active:scale-95 border-none cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
            Edit Profile
          </button>
        </div>

        {/* Profile detail fields */}
        <div className="mt-6 border-t border-outline-variant/30 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((f) => <ProfileField key={f.label} {...f} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
