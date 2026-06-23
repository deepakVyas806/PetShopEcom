"use client";

import Link from "next/link";
import useShoppingCart from "./ShoppingCartContainer.hook";
import CartItemRow from "./Components/CartItemRow";
import { fmt } from "@/lib/currency";
import PageHeader from "@/components/common/PageHeader";
import {
  IconArrowLeft,
  IconTag,
  IconCalendar,
  IconLock,
  IconShipping,
  IconArrowRight,
  IconStar,
  IconBag,
  IconPaw,
  IconCheckCircle,
  IconWarning,
} from "@/lib/icons";

export default function ShoppingCartContainer() {
  const {
    cart,
    cartCount,
    loading,
    availableCoupons,
    selectedIds,
    selectedItems,
    selectedCount,
    isAllSelected,
    toggleSelectItem,
    toggleSelectAll,
    subtotal,
    shipping,
    tax,
    taxRate,
    freeShipThreshold,
    promoDiscount,
    grandTotal,
    rewardsPoints,
    totalSavings,
    promoInput,
    setPromoInput,
    appliedCode,
    promoError,
    applyPromoCode,
    removePromoCode,
    handleUpdateQuantity,
    handleRemoveItem,
    handleProceedToCheckout,
  } = useShoppingCart();

  const noneSelected    = selectedItems.length === 0;
  const partialSelected = selectedItems.length > 0 && selectedItems.length < cart.length;

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 min-h-[calc(100vh-128px)]">

        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shopping Cart" }]}
          title="Shopping Cart"
          subtitle={
            loading
              ? "Loading your cart…"
              : cartCount > 0
              ? `${cartCount} item${cartCount > 1 ? "s" : ""} in your cart`
              : "Your cart is empty"
          }
        />

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-2.5 mt-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-surface-container-low animate-pulse" />
            ))}
          </div>
        )}

        {!loading && cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

            {/* ── Left: cart items ───────────────────────────────────────── */}
            <div className="lg:col-span-8 space-y-2.5">

              {/* Select-all bar */}
              <div className="flex items-center justify-between bg-white/80 dark:bg-surface-container-lowest border border-outline-variant/15 rounded-xl px-4 py-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 relative ${
                      isAllSelected
                        ? "bg-primary border-primary"
                        : partialSelected
                        ? "bg-primary/20 border-primary"
                        : "bg-white border-outline-variant/50 hover:border-primary/50"
                    }`}
                    aria-label="Select all items"
                  >
                    {isAllSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {partialSelected && !isAllSelected && (
                      <span className="w-2 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                  <span className="text-xs font-semibold text-on-surface">
                    {isAllSelected ? "All items selected" : `Select all (${cart.length})`}
                  </span>
                </label>

                {selectedItems.length > 0 && (
                  <span className="text-[11px] font-bold text-primary">
                    {selectedItems.length} of {cart.length} selected
                  </span>
                )}
              </div>

              {/* No items selected warning */}
              {noneSelected && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <IconWarning size={14} className="text-amber-500 shrink-0" weight="fill" />
                  <p className="text-xs text-amber-700 font-medium">
                    Select at least one item to proceed to checkout.
                  </p>
                </div>
              )}

              {/* Cart item rows */}
              {cart.map((item) => {
                const productId = item.product._id ?? item.product.id;
                return (
                  <CartItemRow
                    key={productId}
                    item={item}
                    isSelected={selectedIds.has(productId)}
                    onToggleSelect={toggleSelectItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                );
              })}

              <div className="pt-1">
                <Link href="/marketplace" className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                  <IconArrowLeft size={16} weight="bold" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── Right: Order Summary ────────────────────────────────────── */}
            <aside className="lg:col-span-4 sticky top-24 space-y-3">
              <div className="bg-white/80 dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl shadow-sm overflow-hidden">

                {/* Header */}
                <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-on-surface">Order Summary</h2>
                  <span className="text-[10px] text-on-surface-variant">
                    {selectedCount > 0
                      ? `${selectedCount} item${selectedCount > 1 ? "s" : ""} selected`
                      : "No items selected"}
                  </span>
                </div>

                {/* Mini previews of selected items */}
                {selectedItems.length > 0 && (
                  <div className="px-4 py-3 flex gap-1.5 overflow-x-auto border-b border-outline-variant/10">
                    {selectedItems.slice(0, 5).map((item) => {
                      const id = item.product._id ?? item.product.id;
                      return (
                        <div key={id} className="relative shrink-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/20">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          {item.quantity > 1 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {selectedItems.length > 5 && (
                      <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center text-[9px] font-bold text-on-surface-variant shrink-0">
                        +{selectedItems.length - 5}
                      </div>
                    )}
                  </div>
                )}

                <div className="px-4 py-3 space-y-3">

                  {/* Price breakdown */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Subtotal ({selectedCount} item{selectedCount !== 1 ? "s" : ""})</span>
                      <span className="font-semibold text-on-surface">{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Shipping</span>
                      {shipping === 0
                        ? <span className="font-bold text-green-600">FREE</span>
                        : <span className="font-semibold text-on-surface">{fmt(shipping)}</span>
                      }
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Tax ({taxRate ?? 18}% GST)</span>
                      <span className="font-semibold text-on-surface">{fmt(tax)}</span>
                    </div>
                    {appliedCode && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span className="flex items-center gap-1">
                          <IconTag size={11} weight="regular" />
                          {appliedCode}
                          <button
                            onClick={removePromoCode}
                            className="text-error text-[9px] hover:underline border-none bg-transparent cursor-pointer p-0"
                          >
                            ✕
                          </button>
                        </span>
                        <span>−{fmt(promoDiscount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-2 border-t border-outline-variant/10 flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface">Total</span>
                    <span className="text-sm font-black text-primary">{fmt(grandTotal)}</span>
                  </div>

                  {/* Savings */}
                  {totalSavings > 0 && (
                    <div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-green-700">You&apos;re saving</span>
                      <span className="text-xs font-black text-green-700">{fmt(totalSavings)} 🎉</span>
                    </div>
                  )}

                  {/* Promo code */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-on-surface-variant">Promo Code</label>
                    <div className="flex gap-1.5">
                      <input
                        className="flex-grow bg-surface-container-low border border-outline-variant/30 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface placeholder:text-on-surface-variant/40"
                        placeholder="e.g. NEWPET10"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        disabled={!!appliedCode}
                      />
                      <button
                        onClick={() => applyPromoCode(promoInput)}
                        disabled={!!appliedCode}
                        className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-secondary-container/80 disabled:opacity-40 transition-colors cursor-pointer border-none outline-none"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError  && <p className="text-[10px] text-error font-semibold">{promoError}</p>}
                    {appliedCode && <p className="text-[10px] text-green-600 font-semibold">Promo applied!</p>}
                    {!appliedCode && availableCoupons.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <p className="text-[10px] text-on-surface-variant font-semibold">Available coupons</p>
                        {availableCoupons.slice(0, 4).map((c) => (
                          <button
                            key={c.code}
                            onClick={() => { setPromoInput(c.code); applyPromoCode(c.code); }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 border border-dashed border-primary/40 rounded-lg bg-primary/3 hover:bg-primary/8 text-left transition-colors cursor-pointer outline-none"
                          >
                            <span className="text-[10px] text-on-surface-variant">
                              {c.description ||
                                (c.discountType === "percent"
                                  ? `${c.value}% off${c.minOrder > 0 ? ` on ₹${c.minOrder}+` : ""}`
                                  : `₹${c.value} off${c.minOrder > 0 ? ` on ₹${c.minOrder}+` : ""}`)}
                            </span>
                            <span className="text-[10px] font-black text-primary border border-primary/30 px-1.5 py-0.5 rounded bg-white">
                              {c.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Estimated delivery */}
                  <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg px-3 py-2">
                    <IconCalendar size={16} className="text-primary" weight="regular" />
                    <span className="text-[10px] text-on-surface font-medium">
                      Estimated delivery: <strong>3–5 business days</strong>
                    </span>
                  </div>

                  {/* Checkout button */}
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={noneSelected}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border-none outline-none ${
                      noneSelected
                        ? "bg-outline-variant/30 text-on-surface-variant cursor-not-allowed"
                        : "bg-primary text-on-primary hover:shadow-lg hover:brightness-105 active:scale-[0.99] cursor-pointer"
                    }`}
                  >
                    <IconLock size={16} weight="bold" />
                    {noneSelected
                      ? "Select items to checkout"
                      : `Checkout ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}`}
                    {!noneSelected && <IconArrowRight size={16} weight="bold" />}
                  </button>

                  {/* Trust signals */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { Icon: IconLock,        label: "SSL Secure"    },
                      { Icon: IconShipping,    label: "Free Ship"     },
                      { Icon: IconCheckCircle, label: "Easy Returns"  },
                    ].map(({ Icon, label }) => (
                      <div key={label} className="flex flex-col items-center gap-0.5 text-center">
                        <Icon size={18} className="text-primary" weight="regular" />
                        <span className="text-[9px] text-on-surface-variant font-medium">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loyalty box */}
              {rewardsPoints > 0 && (
                <div className="bg-tertiary-fixed border border-tertiary-fixed-dim rounded-xl p-3 flex items-center gap-2.5">
                  <IconStar size={20} className="text-primary shrink-0" weight="fill" />
                  <div>
                    <p className="text-[10px] font-bold text-on-tertiary-fixed">
                      Earn {rewardsPoints} reward points
                    </p>
                    <p className="text-[9px] text-on-tertiary-fixed-variant mt-0.5">
                      Join artPet Rewards to save on future orders!
                    </p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* Empty state */}
        {!loading && cart.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto space-y-4">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
              <div className="relative w-full h-full flex items-center justify-center">
                <IconBag size={64} className="text-primary/20" weight="duotone" />
                <IconPaw size={24} className="absolute -bottom-1 -right-1 text-primary animate-bounce" weight="fill" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-on-surface">Your cart is empty</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Find something special for your companion!
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-block px-6 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:shadow-md active:scale-95 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
