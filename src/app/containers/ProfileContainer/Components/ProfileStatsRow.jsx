"use client";

const glassCard = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid #F3E8FF",
  boxShadow: "0 10px 25px -5px rgba(124,58,237,0.10)",
};

function StatCard({ icon, value, label, sub, fill = false }) {
  return (
    <div
      className="p-6 rounded-xl hover:border-primary/30 transition-all duration-300 group"
      style={glassCard}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="material-symbols-outlined bg-primary/10 text-primary p-2 rounded-lg text-[22px]"
          style={fill ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {icon}
        </span>
        <span className="text-primary font-bold text-base">{value}</span>
      </div>
      <h3 className="text-xs font-medium text-on-surface-variant">{label}</h3>
      <p className="text-xs text-outline mt-1">{sub}</p>
    </div>
  );
}

export default function ProfileStatsRow({ stats }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
      <StatCard
        icon="package_2"
        value={stats.totalOrders}
        label="Total Orders"
        sub={`${stats.pendingOrders} pending delivery`}
      />
      <StatCard
        icon="favorite"
        value={stats.wishlistItems}
        label="Wishlist Items"
        sub={`In stock: ${stats.wishlistInStock}`}
        fill
      />
      <StatCard
        icon="stars"
        value={stats.rewardPoints}
        label="Reward Points"
        sub={`$${stats.rewardValue} value`}
      />
    </section>
  );
}
