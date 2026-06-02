"use client";

import React from "react";
import Link from "next/link";
import useShoppingCart from "./ShoppingCartContainer.hook";

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
    checkoutSuccess
  } = useShoppingCart();

  return (
    <div className="w-full bg-background text-on-background transition-colors duration-300 relative">
      
      {/* Order Success Modal Overlay */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in p-4">
          <div className="bg-white dark:bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-2xl max-w-sm w-full text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600">
              <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
            </div>
            <h3 className="text-sm font-bold text-on-surface">Order Placed Successfully!</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Thank you for shopping with artPetShop! Your order is being processed and tracking details have been generated.
            </p>
            <div className="pt-2">
              <Link 
                href="/marketplace" 
                className="inline-block w-full bg-primary text-on-primary py-2 rounded-lg font-bold text-xs hover:brightness-105 active:scale-95 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg min-h-[calc(100vh-128px)]">
        
        {/* Page title - Restricted to text-base */}
        <h1 className="text-base font-extrabold mb-6 text-on-surface select-none tracking-tight">
          Your Shopping Cart
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-3">
              {cart.map((item) => (
                <div 
                  key={item.product.id} 
                  className="bg-white dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-[0_4px_12px_rgba(124,58,237,0.05)] transition-all duration-300 group text-left"
                >
                  
                  {/* Thumbnail Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 self-center">
                    <img 
                      alt={item.product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={item.product.image} 
                    />
                  </div>

                  {/* Item Description Info */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xs font-bold text-on-surface leading-tight hover:text-primary transition-colors">
                          <Link href={`/marketplace/${item.product.id}`}>
                            {item.product.name}
                          </Link>
                        </h3>
                        <span className="text-xs font-bold text-primary flex-shrink-0">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="text-on-surface-variant text-[11px] mt-1 select-none">
                        Category: <span className="capitalize">{item.product.category}</span> | Brand: {item.product.brand || "Premium Choice"}
                      </p>

                      {/* Stock Status indicator */}
                      <div className="flex items-center mt-1 text-green-600 text-[10px] font-bold select-none">
                        <span className="material-symbols-outlined text-xs mr-0.5">check_circle</span>
                        In Stock
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-between mt-3 gap-3 pt-2 border-t border-outline-variant/5">
                      
                      {/* Unified Height Minimal Qty Box */}
                      <div className="flex items-center bg-surface-container-low rounded-full px-1.5 py-0.5 border border-outline-variant/30 h-7 select-none">
                        <button 
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5.5 h-5.5 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-on-surface">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5.5 h-5.5 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-4 select-none">
                        <button 
                          className="flex items-center text-primary hover:underline text-[10px] font-bold cursor-pointer transition-all border-none outline-none"
                        >
                          <span className="material-symbols-outlined text-xs mr-0.5">bookmark</span>
                          Save for later
                        </button>
                        <button 
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="flex items-center text-error hover:opacity-85 text-[10px] font-bold cursor-pointer transition-all border-none outline-none"
                        >
                          <span className="material-symbols-outlined text-xs mr-0.5">delete</span>
                          Remove
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Right Column: Order Summary Card */}
            <aside className="lg:col-span-4 sticky top-24 text-left">
              <div className="bg-white dark:bg-surface-container-lowest border border-[#F3E8FF] dark:border-outline-variant/10 rounded-xl p-5 shadow-xs space-y-4">
                
                {/* Heading - Restricted to text-sm */}
                <h2 className="text-sm font-bold text-on-surface pb-2 border-b border-outline-variant/10">
                  Order Summary
                </h2>

                {/* Subtotal metrics */}
                <div className="space-y-2.5 text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      <span className="font-semibold text-on-surface">${shipping.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8.5%)</span>
                    <span className="font-semibold text-on-surface">${tax.toFixed(2)}</span>
                  </div>
                  
                  {appliedCode && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span className="flex items-center">
                        Discount ({appliedCode})
                        <button 
                          onClick={removePromoCode}
                          className="ml-1 cursor-pointer text-error hover:underline border-none bg-transparent p-0 text-[10px]"
                        >
                          [Remove]
                        </button>
                      </span>
                      <span>-${promoDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total Row */}
                <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-on-surface">Total</span>
                  <span className="text-sm font-black text-primary">${grandTotal.toFixed(2)}</span>
                </div>

                {/* Promo Code Input Box */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-on-surface-variant mb-1.5 select-none">
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

                {/* Main Action Button - Restricted to text-sm */}
                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full h-9 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-xs shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border-none outline-none flex items-center justify-center"
                >
                  Proceed to Checkout
                </button>

                {/* Trust symbols list */}
                <div className="pt-2 border-t border-outline-variant/10 flex flex-col gap-2 text-[10px] text-on-surface-variant font-medium select-none">
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
                <div className="mt-4 bg-tertiary-fixed border border-tertiary-fixed-dim rounded-xl p-3.5 flex items-center gap-3 select-none">
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
          </div>
        ) : (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto space-y-4" id="empty-cart-state">
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="relative select-none">
                  <span className="material-symbols-outlined text-[72px] text-primary/20">shopping_basket</span>
                  <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-3xl text-primary animate-bounce">pets</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-on-surface">Your cart is empty</h2>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                It looks like you haven't added any premium pet supplies yet. Let's find something special for your companion!
              </p>
            </div>

            <div className="pt-2">
              <Link 
                href="/marketplace" 
                className="inline-block px-6 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:shadow-md active:scale-95 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
