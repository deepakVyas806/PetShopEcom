"use client";

import React, { useState } from "react";
import useCheckoutContainer from "./CheckoutContainer.hook";
import { fmt } from "@/lib/currency";

function StepNav({ steps, activeStep }) {
  return (
    <nav className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {steps.map((label, index) => {
        const step = index + 1;
        const isDone = step < activeStep;
        const isActive = step === activeStep;
        return (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-3 min-w-fit ${isActive || isDone ? "" : "opacity-50"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isDone ? "bg-tertiary text-on-tertiary" : isActive ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
              }`}>
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
      <input className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 text-on-surface placeholder:text-on-surface-variant/50" placeholder={placeholder} type={type} />
    </div>
  );
}

/* ── Service mode: Contact step ── */
function ContactStep({ goToStep }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-base">person</span>
        <h2 className="text-sm font-semibold text-on-surface">Your contact details</h2>
      </div>

      <div className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CheckoutInput label="First Name" placeholder="e.g. Alex" />
          <CheckoutInput label="Last Name" placeholder="e.g. Riverton" />
        </div>
        <CheckoutInput label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
        <CheckoutInput label="Email Address" placeholder="you@example.com" type="email" />
        <div className="space-y-1">
          <label className="text-[10px] text-on-surface-variant ml-1">Special Instructions (optional)</label>
          <textarea
            rows={2}
            placeholder="Any special needs for your pet..."
            className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 text-on-surface placeholder:text-on-surface-variant/50 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button onClick={() => goToStep(2)} className="bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-semibold hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5">
          Continue to Payment
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

/* ── Cart mode: Shipping step ── */
function ShippingStep({ goToStep }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
        <h2 className="text-sm font-semibold text-on-surface">Delivery address</h2>
      </div>

      {/* Saved address cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="cursor-pointer">
          <input checked readOnly className="sr-only peer" name="address" type="radio" />
          <div className="p-3 rounded-xl border border-primary bg-primary/5 shadow-sm peer-checked:shadow-md transition-all">
            <div className="flex justify-between items-start mb-1.5">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Home</span>
              <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
            </div>
            <p className="font-bold text-on-surface text-xs">Alex Riverton</p>
            <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">124 Golden Retriever Lane,<br />West Hills, CA 90210</p>
            <p className="text-[10px] text-on-surface-variant mt-1 font-medium">+1 (555) 012-3456</p>
          </div>
        </label>
        <button className="p-3 rounded-xl border-2 border-dashed border-outline-variant hover:bg-surface-container-low transition-all flex flex-col items-center justify-center gap-1.5 group min-h-[96px]">
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-xl">add_location_alt</span>
          <span className="text-[10px] font-medium text-on-surface-variant group-hover:text-primary">Add New Address</span>
        </button>
      </div>

      {/* New address form */}
      <div className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] rounded-xl p-4 space-y-3">
        <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Or fill in manually</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CheckoutInput label="First Name" placeholder="e.g. Alex" />
          <CheckoutInput label="Last Name" placeholder="e.g. Riverton" />
        </div>
        <CheckoutInput label="Street Address" placeholder="Street, apartment, suite…" />
        <div className="grid grid-cols-2 gap-3">
          <CheckoutInput label="City" placeholder="e.g. West Hills" />
          <CheckoutInput label="ZIP / Post Code" placeholder="e.g. 90210" />
        </div>
        <CheckoutInput label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
      </div>

      <div className="flex justify-end pt-1">
        <button onClick={() => goToStep(2)} className="bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-semibold hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5">
          Continue to Delivery
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

const DELIVERY_OPTIONS = [
  { icon: "local_shipping",  title: "Standard Shipping", sub: "3–5 business days", price: "FREE",   checked: true  },
  { icon: "rocket_launch",   title: "Express Delivery",  sub: "1–2 business days", price: fmt(12.99), checked: false },
  { icon: "schedule",        title: "Same Day",          sub: "Order before 12 PM", price: fmt(19.99), checked: false },
];

function DeliveryStep({ goToStep }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-base">speed</span>
        <h2 className="text-sm font-semibold text-on-surface">Choose delivery speed</h2>
      </div>

      <div className="space-y-2">
        {DELIVERY_OPTIONS.map(({ icon, title, sub, price, checked }) => (
          <label key={title} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface cursor-pointer hover:border-primary/50 transition-all">
            <input defaultChecked={checked} className="accent-primary w-4 h-4 shrink-0" name="delivery" type="radio" />
            <span className="material-symbols-outlined text-on-surface-variant text-base shrink-0">{icon}</span>
            <div className="flex-grow min-w-0">
              <span className="font-bold text-on-surface text-xs">{title}</span>
              <p className="text-[10px] text-on-surface-variant">{sub}</p>
            </div>
            <span className="font-bold text-primary text-xs shrink-0">{price}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-1">
        <button onClick={() => goToStep(1)} className="text-on-surface-variant px-4 py-2 text-xs font-medium flex items-center gap-1.5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <button onClick={() => goToStep(3)} className="bg-primary text-on-primary px-5 py-2 rounded-full text-xs font-semibold hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5">
          Continue to Payment <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

const PAYMENT_METHODS = [
  { id: "card",  label: "Card",        icon: "credit_card",    sub: "Credit / Debit" },
  { id: "upi",   label: "UPI",         icon: "qr_code_scanner", sub: "Any UPI app"    },
  { id: "wallet",label: "Wallets",     icon: "account_balance_wallet", sub: "Razorpay / Paytm" },
  { id: "cod",   label: "Cash",        icon: "payments",       sub: "Pay on delivery" },
];

function PaymentStep({ goToStep, handlePay, total, isService }) {
  const backStep = isService ? 1 : 2;
  const [method, setMethod] = useState("card");

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-base">lock</span>
        <h2 className="text-sm font-semibold text-on-surface">Secure Payment</h2>
      </div>

      {/* Method selector chips */}
      <div className="grid grid-cols-4 gap-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all cursor-pointer outline-none ${
              method === m.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-outline-variant bg-surface hover:border-primary/40"
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${method === m.id ? "text-primary" : "text-on-surface-variant"}`}>
              {m.icon}
            </span>
            <span className={`text-[10px] font-bold leading-tight ${method === m.id ? "text-primary" : "text-on-surface"}`}>{m.label}</span>
            <span className="text-[9px] text-on-surface-variant leading-tight hidden sm:block">{m.sub}</span>
          </button>
        ))}
      </div>

      {/* Card fields */}
      {method === "card" && (
        <div className="bg-white/80 dark:bg-surface-container-lowest/80 border border-[#F3E8FF] rounded-xl p-4 space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant ml-1">Card Number</label>
            <div className="relative">
              <input className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 pr-12 text-on-surface" placeholder="0000 0000 0000 0000" type="text" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-bold italic text-[10px]">VISA</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-on-surface-variant ml-1">Expiry</label>
              <input className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 text-on-surface" placeholder="MM / YY" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-on-surface-variant ml-1">CVV</label>
              <input className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 text-on-surface" placeholder="•••" type="password" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant ml-1">Name on Card</label>
            <input className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 text-on-surface" placeholder="As printed on card" />
          </div>
        </div>
      )}

      {/* UPI */}
      {method === "upi" && (
        <div className="bg-white/80 border border-[#F3E8FF] rounded-xl p-4 space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant ml-1">UPI ID</label>
            <input className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 text-on-surface" placeholder="yourname@upi" />
          </div>
          <p className="text-[10px] text-on-surface-variant">You'll receive a payment request on your UPI app.</p>
        </div>
      )}

      {/* Wallets */}
      {method === "wallet" && (
        <div className="bg-white/80 border border-[#F3E8FF] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {["Paytm", "PhonePe", "Razorpay"].map((w) => (
              <label key={w} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-outline-variant cursor-pointer hover:border-primary transition-all">
                <input type="radio" name="wallet" className="accent-primary w-3 h-3" />
                <span className="text-[10px] font-semibold text-on-surface">{w}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Cash on Delivery */}
      {method === "cod" && (
        <div className="bg-white/80 border border-[#F3E8FF] rounded-xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-xl mt-0.5">payments</span>
          <div>
            <p className="text-xs font-bold text-on-surface">Cash on Delivery</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">Pay in cash when your order is delivered. No online transaction needed.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <button onClick={() => goToStep(backStep)} className="text-on-surface-variant px-4 py-2 text-xs font-medium flex items-center gap-1.5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back
        </button>
        <button onClick={handlePay} className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 shadow-md">
          <span className="material-symbols-outlined text-sm">lock</span>
          {method === "cod" ? "Place Order" : `Pay ${fmt(total)}`}
        </button>
      </div>
    </section>
  );
}

/* ── Order Summary sidebar ── */
function OrderSummary({ isService, service, bookingDate, bookingTime, cartItems, subtotal, shipping, tax, total, couponCode, setCouponCode }) {
  return (
    <aside className="lg:col-span-4 space-y-4">
      <div className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl border border-[#F3E8FF] dark:border-outline-variant/20 rounded-2xl p-4 sticky top-24 shadow-sm">
        <h3 className="text-sm font-semibold text-on-surface mb-4 border-b border-outline-variant/20 pb-2">
          {isService ? "Appointment Summary" : "Order Summary"}
        </h3>

        {isService ? (
          /* Service booking summary */
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <img src={service.image} alt={service.title} className="w-16 h-16 rounded-xl object-cover bg-surface-container-low flex-shrink-0" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-on-surface">{service.title}</h4>
                <span className="inline-block mt-0.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{service.category}</span>
                <p className="text-xs text-primary font-bold mt-1">{service.duration}</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{service.description}</p>
            <div className="bg-surface-container rounded-xl p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] text-on-surface-variant">Date</span>
                <span className="text-[10px] font-semibold text-on-surface">{bookingDate || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-on-surface-variant">Time</span>
                <span className="text-[10px] font-semibold text-on-surface">{bookingTime || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-on-surface-variant">Location</span>
                <span className="text-[10px] font-semibold text-on-surface">artPetShop Studio</span>
              </div>
            </div>
          </div>
        ) : (
          /* Cart items */
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div className="flex gap-3" key={item.product.id}>
                <img alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-surface-container-low" src={item.product.image} />
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-bold text-on-surface truncate">{item.product.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">Qty: {item.quantity}</p>
                  <p className="text-xs font-bold text-primary mt-1">{fmt(item.product.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        <div className="space-y-3 border-t border-outline-variant/20 pt-4 mb-6">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          {!isService && (
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>Shipping</span>
              <span className="text-primary font-bold">{shipping === null ? "Calculated next" : "FREE"}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Tax (6%)</span><span>{fmt(tax)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-on-surface pt-2">
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </div>

        {/* Coupon */}
        <div className="relative">
          <input className="w-full bg-surface-container-low border border-transparent rounded-xl focus:border-primary focus:ring-0 text-xs py-3 pl-4 pr-16 text-on-surface" placeholder="Coupon Code" type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-bold text-xs hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all">Apply</button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span className="material-symbols-outlined text-sm">payments</span>
          <span className="material-symbols-outlined text-sm">shield</span>
        </div>
      </div>
    </aside>
  );
}

export default function CheckoutContainer() {
  const c = useCheckoutContainer();
  const paymentStep = c.steps.length; // last step is always Payment

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full flex-grow">
        <div className="lg:col-span-8 space-y-8">
          <StepNav steps={c.steps} activeStep={c.activeStep} />

          {/* Service flow: Contact → Payment */}
          {c.isService && c.activeStep === 1 && <ContactStep goToStep={c.goToStep} />}
          {c.isService && c.activeStep === 2 && <PaymentStep goToStep={c.goToStep} handlePay={c.handlePay} total={c.total} isService={c.isService} />}

          {/* Cart flow: Shipping → Delivery → Payment */}
          {!c.isService && c.activeStep === 1 && <ShippingStep goToStep={c.goToStep} />}
          {!c.isService && c.activeStep === 2 && <DeliveryStep goToStep={c.goToStep} />}
          {!c.isService && c.activeStep === 3 && <PaymentStep goToStep={c.goToStep} handlePay={c.handlePay} total={c.total} isService={c.isService} />}
        </div>

        <OrderSummary
          isService={c.isService}
          service={c.service}
          bookingDate={c.bookingDate}
          bookingTime={c.bookingTime}
          cartItems={c.cartItems}
          subtotal={c.subtotal}
          shipping={c.shipping}
          tax={c.tax}
          total={c.total}
          couponCode={c.couponCode}
          setCouponCode={c.setCouponCode}
        />
      </main>
    </div>
  );
}
