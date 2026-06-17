"use client";

import Link from "next/link";
import useShoppingCart from "./ShoppingCartContainer.hook";
import CartItemRow from "./Components/CartItemRow";
import { fmt } from "@/lib/currency";
import PageHeader from "@/components/common/PageHeader";
import { IconCheckCircle, IconArrowLeft, IconTag, IconCalendar, IconLock, IconShipping, IconArrowRight, IconStar, IconBag, IconPaw } from "@/lib/icons";

const COUPON_SUGGESTIONS = [
  { code: "PETS20",   desc: "20% off your first order" },
  { code: "HDFC15",   desc: "15% off with HDFC card"   },
  { code: "ARTPET10", desc: "Flat ₹100 off on ₹999+"   },
];

export default function ShoppingCartContainer() {
  const {
    cart,
    cartCount,
    subtotal,
    shipping,
    tax,
    promoDiscount,
    grandTotal,
    rewardsPoints,
    promoInput,
    setPromoInput,
    appliedCode,
    promoError,
    applyPromoCode,
    removePromoCode,
    handleUpdateQuantity,
    handleRemoveItem,
    handleProceedToCheckout,
    checkoutSuccess,
  } = useShoppingCart();

  const itemSavings = cart.reduce((acc, item) => {
    const mrp = item.product.mrp ?? item.product.price;
    return acc + Math.max(0, (mrp - item.product.price) * item.quantity);
  }, 0);
  const totalSavings = itemSavings + promoDiscount;

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300 relative">

      {/* Success modal */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-2xl max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <IconCheckCircle size={36} weight="fill" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">Order Placed!</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your order is being processed. Tracking details will be sent to your email.
            </p>
            <Link href="/marketplace" className="block w-full bg-primary text-on-primary py-2 rounded-lg font-bold text-xs hover:brightness-105 active:scale-95 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 min-h-[calc(100vh-128px)]">

        {/* Page header */}
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Shopping Cart" },
          ]}
          title="Shopping Cart"
          subtitle={cartCount > 0 ? `${cartCount} item${cartCount > 1 ? "s" : ""} in your cart` : "Your cart is empty"}
        />

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

            {/* Cart items */}
            <div className="lg:col-span-8 space-y-2.5">
              {cart.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              ))}

              {/* Continue shopping link */}
              <div className="pt-1">
                <Link href="/marketplace" className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline transition-all">
                  <IconArrowLeft size={16} weight="bold" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary sidebar */}
            <aside className="lg:col-span-4 sticky top-24 space-y-3">
              <div className="bg-white/80 dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl shadow-sm overflow-hidden">

                {/* Header */}
                <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-on-surface">Order Summary</h2>
                  <span className="text-[10px] text-on-surface-variant">{cartCount} item{cartCount > 1 ? "s" : ""}</span>
                </div>

                {/* Mini item previews */}
                <div className="px-4 py-3 flex gap-1.5 overflow-x-auto border-b border-outline-variant/10">
                  {cart.slice(0, 5).map((item) => (
                    <div key={item.product.id} className="relative shrink-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container border border-outline-variant/20">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      {item.quantity > 1 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                  {cart.length > 5 && (
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center text-[9px] font-bold text-on-surface-variant shrink-0">
                      +{cart.length - 5}
                    </div>
                  )}
                </div>

                <div className="px-4 py-3 space-y-3">

                  {/* Price breakdown */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Subtotal</span>
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
                      <span>Tax (8.5%)</span>
                      <span className="font-semibold text-on-surface">{fmt(tax)}</span>
                    </div>
                    {appliedCode && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span className="flex items-center gap-1">
                          <IconTag size={11} weight="regular" />
                          {appliedCode}
                          <button onClick={removePromoCode} className="text-error text-[9px] hover:underline border-none bg-transparent cursor-pointer p-0">✕</button>
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

                  {/* Savings summary */}
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
                    {promoError && <p className="text-[10px] text-error font-semibold">{promoError}</p>}
                    {appliedCode && <p className="text-[10px] text-green-600 font-semibold">Promo applied!</p>}
                    {!appliedCode && (
                      <div className="space-y-1 pt-1">
                        <p className="text-[10px] text-on-surface-variant font-semibold">Available coupons</p>
                        {COUPON_SUGGESTIONS.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => { setPromoInput(c.code); applyPromoCode(c.code); }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 border border-dashed border-primary/40 rounded-lg bg-primary/3 hover:bg-primary/8 text-left transition-colors cursor-pointer outline-none"
                          >
                            <span className="text-[10px] text-on-surface-variant">{c.desc}</span>
                            <span className="text-[10px] font-black text-primary border border-primary/30 px-1.5 py-0.5 rounded bg-white">
                              {c.code}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Estimated delivery note */}
                  <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg px-3 py-2">
                    <IconCalendar size={16} className="text-primary" weight="regular" />
                    <span className="text-[10px] text-on-surface font-medium">Estimated delivery: <strong>3–5 business days</strong></span>
                  </div>

                  {/* Checkout button */}
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer border-none outline-none flex items-center justify-center gap-2"
                  >
                    <IconLock size={16} weight="bold" />
                    Proceed to Checkout
                    <IconArrowRight size={16} weight="bold" />
                  </button>

                  {/* Trust signals */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { Icon: IconLock,      label: "SSL Secure" },
                      { Icon: IconShipping,  label: "Free Ship" },
                      { Icon: IconArrowLeft, label: "Easy Returns" },
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
                    <p className="text-[10px] font-bold text-on-tertiary-fixed">Earn {rewardsPoints} reward points</p>
                    <p className="text-[9px] text-on-tertiary-fixed-variant mt-0.5">Join artPet Rewards to save on future orders!</p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        ) : (
          /* Empty state */
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
            <Link href="/marketplace" className="inline-block px-6 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:shadow-md active:scale-95 transition-all">
              Start Shopping
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
