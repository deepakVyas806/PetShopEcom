"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useProfileContainer from "./ProfileContainer.hook";
import PageHeader       from "@/components/common/PageHeader";
import ProfileStatsRow  from "./Components/ProfileStatsRow";
import PersonalInfoCard from "./Components/PersonalInfoCard";
import RecentOrderCard  from "./Components/RecentOrderCard";
import AppointmentCard  from "./Components/AppointmentCard";

const MOBILE_NAV = [
  { icon: "receipt_long",   label: "Orders",    href: "/orders"        },
  { icon: "favorite",       label: "Wishlist",   href: "/wishlist"      },
  { icon: "local_shipping", label: "Track",      href: "/track-order"   },
  { icon: "notifications",  label: "Alerts",     href: "/notifications" },
];

export default function ProfileContainer() {
  const { user, stats, recentOrder } = useProfileContainer();
  const pathname = usePathname();

  return (
    <div className="space-y-4">

      {/* Consistent page header — same as every other account page */}
      <PageHeader
        breadcrumbs={[
          { label: "Home",       href: "/"        },
          { label: "My Account", href: "/profile" },
        ]}
        title="My Profile"
        subtitle="Manage your account details and preferences."
      />

      {/* Mobile-only quick nav (sidebar is hidden on mobile) */}
      <nav className="md:hidden flex overflow-x-auto gap-2 pb-1 no-scrollbar">
        {MOBILE_NAV.map(({ icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                active
                  ? "bg-primary text-on-primary"
                  : "bg-white/80 border border-[#F3E8FF] text-on-surface-variant hover:border-primary/40"
              }`}
            >
              <span className="material-symbols-outlined leading-none" style={{ fontSize: 13 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <ProfileStatsRow stats={stats} />
      <PersonalInfoCard user={user} />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <RecentOrderCard order={recentOrder} />
        <AppointmentCard />
      </section>
    </div>
  );
}
