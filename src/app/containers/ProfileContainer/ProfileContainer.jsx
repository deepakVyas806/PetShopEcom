"use client";

import useProfileContainer from "./ProfileContainer.hook";
import ProfileStatsRow  from "./Components/ProfileStatsRow";
import PersonalInfoCard from "./Components/PersonalInfoCard";
import RecentOrderCard  from "./Components/RecentOrderCard";
import AppointmentCard  from "./Components/AppointmentCard";

export default function ProfileContainer() {
  const { user, stats, recentOrder } = useProfileContainer();

  return (
    <div className="space-y-5 py-2">
      <ProfileStatsRow stats={stats} />
      <PersonalInfoCard user={user} />
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        <RecentOrderCard order={recentOrder} />
        <AppointmentCard />
      </section>
    </div>
  );
}
