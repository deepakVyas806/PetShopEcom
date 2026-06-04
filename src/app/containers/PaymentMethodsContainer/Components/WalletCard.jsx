"use client";

export default function WalletCard() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-outline-variant/50 p-5 flex flex-col items-center justify-center gap-3 text-center" style={{ minHeight: 200 }}>
      {/* Circular wallet icon */}
      <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
        <span className="material-symbols-outlined text-on-surface leading-none" style={{ fontSize: 22 }}>
          account_balance_wallet
        </span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-on-surface">Apple Pay Connected</h3>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-[180px]">
          Your Apple Wallet is synced for express checkout.
        </p>
      </div>
      <button className="text-xs text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none p-0">
        Manage Wallet Settings
      </button>
    </div>
  );
}
