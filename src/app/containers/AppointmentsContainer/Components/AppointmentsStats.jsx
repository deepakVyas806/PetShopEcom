"use client";

const glass = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid #F3E8FF",
  boxShadow: "0 4px 20px -4px rgba(124,58,237,0.08)",
};

function StatCard({ icon, iconBg, iconClr, label, value }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl" style={glass}>
      {/* Circular icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <span
          className={`material-symbols-outlined leading-none ${iconClr}`}
          style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-on-surface-variant font-medium leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-on-surface truncate">{value}</p>
      </div>
    </div>
  );
}

export default function AppointmentsStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
      {stats.map((s) => <StatCard key={s.label} {...s} />)}
    </div>
  );
}
