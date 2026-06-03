"use client";

import React from "react";
import { fmt } from "@/lib/currency";

export default function OrderSummary({
  cartCount,
  subtotal,
  shipping,
  tax,
  appliedCode,
  promoDiscount,
  grandTotal,
  rewardsPoints,
  promoInput,
  setPromoInput,
  applyPromoCode,
  removePromoCode,
  promoError,
  onProceedToCheckout
}) {
  return (
    <aside className="lg:col-span-4 sticky top-24 text-left select-none">
      <div className="bg-white dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl p-5 shadow-xs space-y-4">
        
        {/* Heading */}
        <h2 className="text-sm font-bold text-on-surface pb-2 border-b border-outline-variant/10">
          Order Summary
        </h2>

        {/* Subtotal metrics */}
        <div className="space-y-2.5 text-xs text-on-surface-variant">
          <div className="flex justify-between">
            <span>Subtotal ({cartCount} items)</span>
            <span className="font-semibold text-on-surface">{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            {shipping === 0 ? (
              <span className="text-green-600 font-bold">FREE</span>
            ) : (
              <span className="font-semibold text-on-surface">{fmt(shipping)}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span>Tax (8.5%)</span>
            <span className="font-semibold text-on-surface">{fmt(tax)}</span>
          </div>
          
          {appliedCode && (
            <div className="flex justify-between text-green-600 font-bold">
              <span className="flex items-center">
                Discount ({appliedCode})
                <button 
                  onClick={removePromoCode}
                  className="ml-1 cursor-pointer text-error hover:underline border-none bg-transparent p-0 text-[10px]"
                  type="button"
                >
                  [Remove]
                </button>
              </span>
              <span>-{fmt(promoDiscount)}</span>
            </div>
          )}
        </div>

        {/* Total Row */}
        <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-baseline">
          <span className="text-xs font-bold text-on-surface">Total</span>
          <span className="text-sm font-black text-primary">{fmt(grandTotal)}</span>
        </div>

        {/* Promo Code Input Box */}
        <div className="pt-2">
          <label className="block text-[11px] font-bold text-on-surface-variant mb-1.5">
            Promo Code (Try: NEWPET10)
          </label>
          <div className="flex gap-2">
            <input 
              className="flex-grow bg-surface border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface placeholder-on-surface-variant/40" 
              placeholder="Enter code" 
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              disabled={!!appliedCode}
            />
            <button 
              onClick={() => applyPromoCode(promoInput)}
              disabled={!!appliedCode}
              className="bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-secondary-container/85 disabled:opacity-40 transition-colors cursor-pointer border-none outline-none"
              type="button"
            >
              Apply
            </button>
          </div>
          {promoError && (
            <p className="text-[10px] text-error font-semibold mt-1">{promoError}</p>
          )}
          {appliedCode && (
            <p className="text-[10px] text-green-600 font-semibold mt-1">Promo code applied successfully!</p>
          )}
        </div>

        {/* Main Action Button */}
        <button 
          onClick={onProceedToCheckout}
          className="w-full h-9 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border-none outline-none flex items-center justify-center"
          type="button"
        >
          Proceed to Checkout
        </button>

        {/* Trust symbols list */}
        <div className="pt-2 border-t border-outline-variant/10 flex flex-col gap-2 text-[10px] text-on-surface-variant font-medium">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">local_shipping</span>
            <span>Fast, tracked delivery on all orders</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
            <span>Secure SSL encrypted checkout</span>
          </div>
        </div>

      </div>

      {/* Loyalty box */}
      {rewardsPoints > 0 && (
        <div className="mt-4 bg-tertiary-fixed border border-tertiary-fixed-dim rounded-xl p-3.5 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">loyalty</span>
          <div>
            <p className="text-[11px] text-on-tertiary-fixed font-bold leading-none">
              Earn {rewardsPoints} points
            </p>
            <p className="text-[10px] text-on-tertiary-fixed-variant mt-0.5">
              Join artPet Rewards to save on future orders!
            </p>
          </div>
        </div>
      )}

    </aside>
  );
}
