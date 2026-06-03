"use client";

import React from "react";
import useCheckoutContainer from "./CheckoutContainer.hook";

function StepNav({ activeStep }) {
  const steps = ["Shipping", "Delivery", "Payment"];

  return (
    <nav className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {steps.map((label, index) => {
        const step = index + 1;
        const isDone = step < activeStep;
        const isActive = step === activeStep;

        return (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-3 min-w-fit ${isActive || isDone ? "" : "opacity-50"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDone
                    ? "bg-tertiary text-on-tertiary"
                    : isActive
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {isDone ? <span className="material-symbols-outlined text-sm">check</span> : step}
              </div>
              <span className={`text-xs whitespace-nowrap ${isActive ? "font-bold text-primary" : isDone ? "font-bold text-tertiary" : "font-medium text-on-surface-variant"}`}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && <div className="h-px flex-grow bg-outline-variant/50 mx-4 min-w-5" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function CheckoutInput({ label, placeholder, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-on-surface-variant ml-1">{label}</label>
      <input
        className="w-full bg-surface-container-low border border-transparent rounded-xl focus:border-primary focus:ring-0 text-sm py-3 px-3 text-on-surface placeholder:text-on-surface-variant/50"
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}

function ShippingStep({ goToStep }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-on-surface">Where should we send your treats?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="relative cursor-pointer group">
          <input checked readOnly className="peer sr-only" name="address" type="radio" />
          <div className="p-4 rounded-xl border border-primary bg-primary/5 shadow-sm transition-all group-hover:border-primary/60">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Home</span>
              <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
            </div>
            <p className="font-bold text-on-surface text-sm">Alex Riverton</p>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              124 Golden Retriever Lane,<br />
              West Hills, CA 90210
            </p>
            <p className="text-xs text-on-surface-variant mt-2 font-medium">+1 (555) 012-3456</p>
          </div>
        </label>

        <button className="p-4 rounded-xl border-2 border-dashed border-outline-variant bg-transparent hover:bg-surface-container-low transition-all flex flex-col items-center justify-center gap-2 group">
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-2xl">add_location_alt</span>
          <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary">Add New Address</span>
        </button>
      </div>

      <div className="mt-8 p-4 bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CheckoutInput label="First Name" placeholder="e.g. Alex" />
          <CheckoutInput label="Last Name" placeholder="e.g. Riverton" />
        </div>
        <CheckoutInput label="Street Address" placeholder="Apartment, suite, unit, etc." />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => goToStep(2)}
          className="bg-primary text-on-primary px-8 py-3 rounded-full text-xs font-medium hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
        >
          Continue to Delivery
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

function DeliveryStep({ goToStep }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-on-surface">Choose delivery speed</h2>
      <div className="space-y-4">
        {[
          ["Standard Shipping", "Arrives in 3-5 business days. Best for non-urgent supplies.", "FREE", true],
          ["Express Delivery", "Arrives in 1-2 business days. Guaranteed fast service.", "$12.99", false],
        ].map(([title, text, price, checked]) => (
          <label key={title} className="flex items-center p-4 rounded-xl border border-outline-variant bg-surface cursor-pointer hover:border-primary/50 transition-all">
            <input defaultChecked={checked} className="accent-primary w-5 h-5" name="delivery" type="radio" />
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-center gap-3">
                <span className="font-bold text-on-surface text-sm">{title}</span>
                <span className="font-bold text-primary text-sm">{price}</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{text}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={() => goToStep(1)} className="text-on-surface-variant px-6 py-3 text-xs font-medium flex items-center gap-2 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
        <button onClick={() => goToStep(3)} className="bg-primary text-on-primary px-8 py-3 rounded-full text-xs font-medium hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
          Continue to Payment
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

function PaymentStep({ goToStep, handlePay }) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-on-surface">Secure Payment</h2>
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-outline-variant bg-surface transition-all">
          <label className="flex items-center gap-3 cursor-pointer">
            <input className="accent-primary w-5 h-5" name="payment" type="radio" />
            <span className="font-bold text-on-surface text-sm">UPI / QR Scan</span>
          </label>
        </div>
        <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 transition-all">
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input defaultChecked className="accent-primary w-5 h-5" name="payment" type="radio" />
              <span className="font-bold text-on-surface text-sm">Credit / Debit Card</span>
            </label>
            <span className="material-symbols-outlined text-outline">credit_card</span>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-on-surface-variant ml-1">Card Number</label>
              <div className="relative">
                <input className="w-full bg-white dark:bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:border-primary focus:ring-0 text-sm py-3 px-3 pr-12 text-on-surface" placeholder="0000 0000 0000 0000" type="text" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 font-bold italic text-xs">VISA</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CheckoutInput label="Expiry Date" placeholder="MM/YY" />
              <CheckoutInput label="CVV" placeholder="***" type="password" />
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-outline-variant bg-surface transition-all">
          <label className="flex items-center gap-3 cursor-pointer">
            <input className="accent-primary w-5 h-5" name="payment" type="radio" />
            <span className="font-bold text-on-surface text-sm">Other Online Wallets (Razorpay)</span>
          </label>
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={() => goToStep(2)} className="text-on-surface-variant px-6 py-3 text-xs font-medium flex items-center gap-2 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
        <button onClick={handlePay} className="bg-primary text-on-primary px-10 py-4 rounded-full text-sm font-semibold hover:shadow-xl transition-all active:scale-95 flex items-center gap-3 shadow-lg">
          <span className="material-symbols-outlined text-sm">lock</span>
          Pay $84.45
        </button>
      </div>
    </section>
  );
}

function OrderSummary({ items, subtotal, shipping, tax, total, couponCode, setCouponCode }) {
  return (
    <aside className="lg:col-span-4 space-y-4">
      <div className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-2xl p-4 sticky top-24 shadow-sm">
        <h3 className="text-sm font-semibold text-on-surface mb-4 border-b border-outline-variant/20 pb-2">Order Summary</h3>
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div className="flex gap-3" key={item.product.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-surface-container-low" src={item.product.image} />
              <div className="flex-grow min-w-0">
                <h4 className="text-xs font-bold text-on-surface truncate">{item.product.name}</h4>
                <p className="text-[10px] text-on-surface-variant">Qty: {item.quantity}</p>
                <p className="text-xs font-bold text-primary mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3 border-t border-outline-variant/20 pt-4 mb-8">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Shipping</span>
            <span className="text-primary font-bold">{shipping === null ? "Calculated at next step" : "FREE"}</span>
          </div>
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-on-surface pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="relative group">
          <input className="w-full bg-surface-container-low border border-transparent rounded-xl focus:border-primary focus:ring-0 text-xs py-3 pl-4 pr-16 transition-all text-on-surface" placeholder="Coupon Code" type="text" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-bold text-xs hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all">Apply</button>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span className="material-symbols-outlined text-sm">payments</span>
          <span className="material-symbols-outlined text-sm">shield</span>
        </div>
      </div>
    </aside>
  );
}

export default function CheckoutContainer() {
  const checkout = useCheckoutContainer();

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full flex-grow">
        <div className="lg:col-span-8 space-y-8">
          <StepNav activeStep={checkout.activeStep} />
          {checkout.activeStep === 1 && <ShippingStep goToStep={checkout.goToStep} />}
          {checkout.activeStep === 2 && <DeliveryStep goToStep={checkout.goToStep} />}
          {checkout.activeStep === 3 && <PaymentStep goToStep={checkout.goToStep} handlePay={checkout.handlePay} />}
        </div>

        <OrderSummary
          items={checkout.checkoutItems}
          subtotal={checkout.subtotal}
          shipping={checkout.shipping}
          tax={checkout.tax}
          total={checkout.total}
          couponCode={checkout.couponCode}
          setCouponCode={checkout.setCouponCode}
        />
      </main>

    </div>
  );
}
