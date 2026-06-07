import { memo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { RECENT_ACTIVITIES } from "../data";

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

export default memo(function RecentActivity() {
  return (
    <Card padding="lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-on-surface">Recent Activity</h3>
        <Link href="/admin/orders" className="text-[10px] text-primary font-semibold hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-1">
        {RECENT_ACTIVITIES.map((item) => (
          <ActivityRow key={item.title} {...item} />
        ))}
      </div>
    </Card>
  );
});
