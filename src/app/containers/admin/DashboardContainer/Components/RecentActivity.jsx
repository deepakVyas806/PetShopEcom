import { memo } from "react";
import Link from "next/link";
import { Card, Sk } from "@/components/ui";
import { IconCart } from "@/lib/icons";
import { fmt } from "@/lib/currency";

const fmtTime = (d) => {
  if (!d) return "—";
  const diff = Math.floor((Date.now() - new Date(d)) / 60000);
  if (diff < 1)    return "Just now";
  if (diff < 60)   return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

function ordersToActivities(orders) {
  return (orders ?? []).map(o => ({
    icon:      IconCart,
    iconBg:    "bg-primary/10",
    iconColor: "text-primary",
    title:     `Order ${o.orderId ?? o._id}`,
    sub:       o.userId?.name ? `by ${o.userId.name}` : "New order placed",
    meta:      fmt(o.total ?? 0),
    time:      fmtTime(o.createdAt),
  }));
}

const ActivityRow = memo(function ActivityRow({ icon: Icon, iconBg, iconColor, title, sub, meta, time }) {
  return (
    <div className="flex items-center gap-3 p-2.5 hover:bg-primary/5 rounded-xl transition-colors">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={iconColor} weight="fill" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-on-surface truncate">{title}</p>
        <p className="text-[10px] text-on-surface-variant truncate">{sub}</p>
      </div>
      <div className="text-right flex-shrink-0">
        {meta && <p className="text-xs font-bold text-on-surface">{meta}</p>}
        <p className="text-[10px] text-on-surface-variant">{time}</p>
      </div>
    </div>
  );
});

export default memo(function RecentActivity({ orders, loading }) {
  const isInitial   = loading && !orders;
  const activities  = ordersToActivities(orders);

  return (
    <Card padding="lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-on-surface">Recent Activity</h3>
        <Link href="/admin/orders" className="text-[10px] text-primary font-semibold hover:underline">
          View All
        </Link>
      </div>

      {isInitial ? (
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-on-surface/8 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <Sk h="h-3" w="w-40" />
                <Sk h="h-2.5" w="w-28" />
              </div>
              <div className="space-y-1.5">
                <Sk h="h-3" w="w-14" />
                <Sk h="h-2.5" w="w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <IconCart size={18} className="text-primary/40" weight="duotone" />
          </div>
          <p className="text-xs font-semibold text-on-surface-variant">No recent orders</p>
          <p className="text-[10px] text-on-surface-variant/60">Orders will appear here as they come in</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((item, i) => (
            <ActivityRow key={item.title + i} {...item} />
          ))}
        </div>
      )}
    </Card>
  );
});
