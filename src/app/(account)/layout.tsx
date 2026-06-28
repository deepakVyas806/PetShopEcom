import AuthGuard from "@/components/auth/AuthGuard";
import AccountSidebar from "@/components/layout/AccountSidebar";
import MobileAccountNav from "@/components/layout/MobileAccountNav";
import AccountPageTransition from "@/components/layout/AccountPageTransition";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex max-w-container-max mx-auto px-4 md:px-margin-desktop gap-5 py-5">
        {/* Persistent sidebar — desktop only */}
        <AccountSidebar />

        {/* Page content */}
        <div className="flex-1 min-w-0">
          {/* Mobile account nav — shows on all account pages, hidden on desktop */}
          <MobileAccountNav />
          <AccountPageTransition>
            {children}
          </AccountPageTransition>
        </div>
      </div>
    </AuthGuard>
  );
}
