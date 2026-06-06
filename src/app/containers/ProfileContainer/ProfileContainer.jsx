"use client";

import useProfileContainer from "./ProfileContainer.hook";
import PageHeader       from "@/components/common/PageHeader";
import ProfileStatsRow  from "./Components/ProfileStatsRow";
import PersonalInfoCard from "./Components/PersonalInfoCard";
import RecentOrderCard  from "./Components/RecentOrderCard";
import AppointmentCard  from "./Components/AppointmentCard";

export default function ProfileContainer() {
  const { user, stats, recentOrder } = useProfileContainer();

  return (
    <div className="space-y-4">

      <PageHeader
        breadcrumbs={[
          { label: "Home",       href: "/"        },
          { label: "My Account", href: "/profile" },
        ]}
        title="My Profile"
        subtitle="Manage your account details and preferences."
      />

      <ProfileStatsRow stats={stats} />
      <PersonalInfoCard user={user} />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <RecentOrderCard order={recentOrder} />
        <AppointmentCard />
      </section>
    </div>
  );
}
