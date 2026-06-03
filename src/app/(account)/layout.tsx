import AuthGuard from "@/components/auth/AuthGuard";
import AccountSidebar from "@/components/layout/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex max-w-container-max mx-auto px-4 md:px-margin-desktop gap-5 py-5">
        {/* Persistent sidebar — hidden on mobile, sticky on desktop */}
        <AccountSidebar />

        {/* Page content — switches per route */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </AuthGuard>
  );
}
