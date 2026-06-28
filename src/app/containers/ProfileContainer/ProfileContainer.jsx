"use client";

import useProfileContainer from "./ProfileContainer.hook";
import PersonalInfoCard from "./Components/PersonalInfoCard";

export default function ProfileContainer() {
  const { user, loading } = useProfileContainer();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 rounded-2xl animate-shimmer" />
        <div className="h-28 rounded-2xl animate-shimmer" />
      </div>
    );
  }

  return <PersonalInfoCard user={user} />;
}
