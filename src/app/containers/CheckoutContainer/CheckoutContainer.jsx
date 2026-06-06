"use client";

import React, { useState } from "react";
import useCheckoutContainer from "./CheckoutContainer.hook";
import { fmt } from "@/lib/currency";
import { Card, Button, FormField } from "@/components/ui";
import { IconCheck, IconUser, IconShipping, IconClock, IconArrowRight, IconArrowLeft, IconLock, IconCard, IconQR, IconWallet, IconMoney, IconLocation, IconShield, IconDownload, IconSupport } from "@/lib/icons";

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
                {isDone ? <IconCheck size={16} weight="bold" /> : step}
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
  return <FormField label={label} placeholder={placeholder} type={type} />;
}

/* ── Service mode: Contact step ── */
function ContactStep({ goToStep }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <IconUser size={18} className="text-primary" weight="regular" />
        <h2 className="text-sm font-semibold text-on-surface">Your contact details</h2>
      </div>

      <Card className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CheckoutInput label="First Name" placeholder="e.g. Alex" />
          <CheckoutInput label="Last Name" placeholder="e.g. Riverton" />
        </div>
        <CheckoutInput label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
        <CheckoutInput label="Email Address" placeholder="you@example.com" type="email" />
        <FormField
          label="Special Instructions (optional)"
          multiline
          rows={2}
          placeholder="Any special needs for your pet..."
        />
      </Card>

      <div className="flex justify-end pt-1">
        <Button onClick={() => goToStep(2)}>
          Continue to Payment
          <IconArrowRight size={16} weight="bold" />
        </Button>
      </div>
    </section>
  );
}

/* ── Cart mode: Shipping step ── */
function ShippingStep({ goToStep }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <IconShipping size={18} className="text-primary" weight="regular" />
        <h2 className="text-sm font-semibold text-on-surface">Delivery address</h2>
      </div>

      {/* Saved address cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="cursor-pointer">
          <input checked readOnly className="sr-only peer" name="address" type="radio" />
          <div className="p-3 rounded-xl border border-primary bg-primary/5 shadow-sm peer-checked:shadow-md transition-all">
            <div className="flex justify-between items-start mb-1.5">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Home</span>
              <IconCheck size={16} className="text-primary" weight="bold" />
            </div>
            <p className="font-bold text-on-surface text-xs">Alex Riverton</p>
            <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">124 Golden Retriever Lane,<br />West Hills, CA 90210</p>
            <p className="text-[10px] text-on-surface-variant mt-1 font-medium">+1 (555) 012-3456</p>
          </div>
        </label>
        <button className="p-3 rounded-xl border-2 border-dashed border-outline-variant hover:bg-surface-container-low transition-all flex flex-col items-center justify-center gap-1.5 group min-h-[96px]">
          <IconLocation size={20} className="text-outline group-hover:text-primary transition-colors" weight="regular" />
          <span className="text-[10px] font-medium text-on-surface-variant group-hover:text-primary">Add New Address</span>
        </button>
      </div>

      {/* New address form */}
      <Card className="space-y-3">
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
      </Card>

      <div className="flex justify-end pt-1">
        <Button onClick={() => goToStep(2)}>
          Continue to Delivery
          <IconArrowRight size={16} weight="bold" />
        </Button>
      </div>
    </section>
  );
}

const DELIVERY_OPTIONS = [
  { Icon: IconShipping, title: "Standard Shipping", sub: "3–5 business days", price: "FREE",   checked: true  },
  { Icon: IconArrowRight, title: "Express Delivery",  sub: "1–2 business days", price: fmt(12.99), checked: false },
  { Icon: IconClock, title: "Same Day",          sub: "Order before 12 PM", price: fmt(19.99), checked: false },
];

function DeliveryStep({ goToStep }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <IconShipping size={18} className="text-primary" weight="regular" />
        <h2 className="text-sm font-semibold text-on-surface">Choose delivery speed</h2>
      </div>

      <div className="space-y-2">
        {DELIVERY_OPTIONS.map(({ Icon, title, sub, price, checked }) => (
          <label key={title} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface cursor-pointer hover:border-primary/50 transition-all">
            <input defaultChecked={checked} className="accent-primary w-4 h-4 shrink-0" name="delivery" type="radio" />
            <Icon size={18} className="text-on-surface-variant shrink-0" weight="regular" />
            <div className="flex-grow min-w-0">
              <span className="font-bold text-on-surface text-xs">{title}</span>
              <p className="text-[10px] text-on-surface-variant">{sub}</p>
            </div>
            <span className="font-bold text-primary text-xs shrink-0">{price}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-1">
        <Button variant="ghost" onClick={() => goToStep(1)}>
          <IconArrowLeft size={16} weight="bold" /> Back
        </Button>
        <Button onClick={() => goToStep(3)}>
          Continue to Payment <IconArrowRight size={16} weight="bold" />
        </Button>
      </div>
    </section>
  );
}

const PAYMENT_METHODS = [
  { id: "card",  label: "Card",    Icon: IconCard,   sub: "Credit / Debit" },
  { id: "upi",   label: "UPI",     Icon: IconQR,     sub: "Any UPI app"    },
  { id: "wallet",label: "Wallets", Icon: IconWallet, sub: "Razorpay / Paytm" },
  { id: "cod",   label: "Cash",    Icon: IconMoney,  sub: "Pay on delivery" },
];

function PaymentStep({ goToStep, handlePay, total, isService }) {
  const backStep = isService ? 1 : 2;
  const [method, setMethod] = useState("card");

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <IconLock size={18} className="text-primary" weight="regular" />
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
            <m.Icon size={20} className={method === m.id ? "text-primary" : "text-on-surface-variant"} weight="regular" />
            <span className={`text-[10px] font-bold leading-tight ${method === m.id ? "text-primary" : "text-on-surface"}`}>{m.label}</span>
            <span className="text-[9px] text-on-surface-variant leading-tight hidden sm:block">{m.sub}</span>
          </button>
        ))}
      </div>

      {/* Card fields */}
      {method === "card" && (
        <Card className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] text-on-surface-variant ml-1">Card Number</label>
            <div className="relative">
              <input className="w-full bg-surface-container-low border border-transparent rounded-lg focus:border-primary focus:ring-0 text-xs py-2.5 px-3 pr-12 text-on-surface" placeholder="0000 0000 0000 0000" type="text" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 font-bold italic text-[10px]">VISA</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Expiry" placeholder="MM / YY" />
            <FormField label="CVV" placeholder="•••" type="password" />
          </div>
          <FormField label="Name on Card" placeholder="As printed on card" />
        </Card>
      )}

      {/* UPI */}
      {method === "upi" && (
        <Card className="space-y-3">
          <FormField label="UPI ID" placeholder="yourname@upi" />
          <p className="text-[10px] text-on-surface-variant">You'll receive a payment request on your UPI app.</p>
        </Card>
      )}

      {/* Wallets */}
      {method === "wallet" && (
        <Card>
          <div className="grid grid-cols-3 gap-2">
            {["Paytm", "PhonePe", "Razorpay"].map((w) => (
              <label key={w} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-outline-variant cursor-pointer hover:border-primary transition-all">
                <input type="radio" name="wallet" className="accent-primary w-3 h-3" />
                <span className="text-[10px] font-semibold text-on-surface">{w}</span>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* Cash on Delivery */}
      {method === "cod" && (
        <Card className="flex items-start gap-3">
          <IconMoney size={20} className="text-primary mt-0.5" weight="regular" />
          <div>
            <p className="text-xs font-bold text-on-surface">Cash on Delivery</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">Pay in cash when your order is delivered. No online transaction needed.</p>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" onClick={() => goToStep(backStep)}>
          <IconArrowLeft size={16} weight="bold" /> Back
        </Button>
        <Button onClick={handlePay} className="px-6 py-2.5 shadow-md">
          <IconLock size={16} weight="bold" />
          {method === "cod" ? "Place Order" : `Pay ${fmt(total)}`}
        </Button>
      </div>
    </section>
  );
}

/* ── Order Summary sidebar ── */
function OrderSummary({ isService, service, bookingDate, bookingTime, cartItems, subtotal, shipping, tax, total, couponCode, setCouponCode }) {
  return (
    <aside className="lg:col-span-4 space-y-4">
      <Card className="sticky top-24">
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
          <IconShield size={16} weight="regular" />
          <IconMoney size={16} weight="regular" />
          <IconLock size={16} weight="regular" />
        </div>
      </Card>
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
