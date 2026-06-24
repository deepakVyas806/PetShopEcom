"use client";

import React from "react";
import useCheckoutContainer from "./CheckoutContainer.hook";
import { fmt } from "@/lib/currency";
import { Card, Button, FormField } from "@/components/ui";
import {
  IconCheck, IconUser, IconShipping, IconClock, IconArrowRight, IconArrowLeft,
  IconLock, IconCard, IconWallet, IconMoney, IconLocation,
  IconShield, IconSpinner, IconNetbanking,
} from "@/lib/icons";

/* ── Step navigation ──────────────────────────────────────────────────────── */
function StepNav({ steps, activeStep }) {
  return (
    <nav className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {steps.map((label, index) => {
        const step = index + 1;
        const isDone   = step < activeStep;
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

/* ── Service: Contact step ───────────────────────────────────────────────── */
function ContactStep({ form, setForm, goToStep }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <IconUser size={18} className="text-primary" weight="regular" />
        <h2 className="text-sm font-semibold text-on-surface">Your contact details</h2>
      </div>
      <Card className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="First Name" placeholder="e.g. Ravi" value={form.firstName}
            onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
          <FormField label="Last Name" placeholder="e.g. Sharma" value={form.lastName}
            onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
        </div>
        <FormField label="Phone Number" placeholder="+91 98765 43210" type="tel" value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
        <FormField label="Email Address" placeholder="you@example.com" type="email" value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
        <FormField label="Special Instructions (optional)" multiline rows={2}
          placeholder="Any special needs for your pet..." value={form.notes}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
      </Card>
      <div className="flex justify-end pt-1">
        <Button onClick={() => goToStep(2)}>
          Continue to Payment <IconArrowRight size={16} weight="bold" />
        </Button>
      </div>
    </section>
  );
}

/* ── Cart: Shipping step ─────────────────────────────────────────────────── */
function ShippingStep({
  savedAddresses, addressesLoading, selectedAddressId, setSelectedAddressId,
  showNewAddressForm, setShowNewAddressForm,
  newAddress, setNewAddress, saveAndSelectAddress,
  goToStep,
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <IconShipping size={18} className="text-primary" weight="regular" />
        <h2 className="text-sm font-semibold text-on-surface">Delivery address</h2>
      </div>

      {addressesLoading ? (
        <div className="flex items-center gap-2 text-xs text-on-surface-variant py-4">
          <IconSpinner size={16} className="animate-spin text-primary" weight="regular" />
          Loading saved addresses…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedAddresses.map((addr) => {
            const isSelected = addr._id === selectedAddressId;
            return (
              <label key={addr._id} className="cursor-pointer" onClick={() => setSelectedAddressId(addr._id)}>
                <div className={`p-3 rounded-xl border shadow-sm transition-all ${
                  isSelected ? "border-primary bg-primary/5" : "border-outline-variant/40 hover:border-primary/40"
                }`}>
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                      {addr.label ?? "Address"}
                    </span>
                    {isSelected && <IconCheck size={16} className="text-primary" weight="bold" />}
                  </div>
                  <p className="font-bold text-on-surface text-xs">{addr.name}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                    {addr.city}, {addr.state} {addr.pincode}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1 font-medium">{addr.phone}</p>
                </div>
              </label>
            );
          })}

          <button
            className="p-3 rounded-xl border-2 border-dashed border-outline-variant hover:bg-surface-container-low transition-all flex flex-col items-center justify-center gap-1.5 group min-h-[96px]"
            onClick={() => setShowNewAddressForm(v => !v)}
          >
            <IconLocation size={20} className="text-outline group-hover:text-primary transition-colors" weight="regular" />
            <span className="text-[10px] font-medium text-on-surface-variant group-hover:text-primary">
              {showNewAddressForm ? "Cancel" : "Add New Address"}
            </span>
          </button>
        </div>
      )}

      {/* New address form */}
      {showNewAddressForm && (
        <Card className="space-y-3">
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">New Address</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Full Name" placeholder="e.g. Ravi Sharma" value={newAddress.name}
              onChange={e => setNewAddress(p => ({ ...p, name: e.target.value }))} />
            <FormField label="Phone" placeholder="+91 98765 43210" type="tel" value={newAddress.phone}
              onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <FormField label="Street Address" placeholder="Flat / House No., Street" value={newAddress.line1}
            onChange={e => setNewAddress(p => ({ ...p, line1: e.target.value }))} />
          <div className="grid grid-cols-3 gap-3">
            <FormField label="City" placeholder="Mumbai" value={newAddress.city}
              onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} />
            <FormField label="State" placeholder="Maharashtra" value={newAddress.state}
              onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))} />
            <FormField label="Pincode" placeholder="400001" value={newAddress.pincode}
              onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))} />
          </div>
          <Button variant="secondary" size="sm" onClick={saveAndSelectAddress}>
            <IconCheck size={14} weight="bold" /> Save Address
          </Button>
        </Card>
      )}

      <div className="flex justify-end pt-1">
        <Button onClick={() => goToStep(2)} disabled={!selectedAddressId && !showNewAddressForm}>
          Continue to Delivery <IconArrowRight size={16} weight="bold" />
        </Button>
      </div>
    </section>
  );
}

/* ── Cart: Delivery step — options driven by admin settings ──────────────── */
const DELIVERY_ICON = {
  standard: IconShipping,
  express:  IconArrowRight,
  same_day: IconClock,
};

function DeliveryStep({ deliveryOption, setDeliveryOption, deliveryOptions, freeShipThreshold, goToStep }) {
  const opts = deliveryOptions?.length ? deliveryOptions : [
    { key: "standard", label: "Standard Delivery", description: "3–5 business days", cost: 0, active: true },
  ];
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <IconShipping size={18} className="text-primary" weight="regular" />
        <h2 className="text-sm font-semibold text-on-surface">Choose delivery speed</h2>
      </div>
      <div className="space-y-2">
        {opts.map(opt => {
          const Icon = DELIVERY_ICON[opt.key] ?? IconShipping;
          const isFree = opt.key === "standard";
          const priceLabel = isFree
            ? (freeShipThreshold ? `FREE over ₹${freeShipThreshold}` : "FREE")
            : `₹${opt.cost}`;
          return (
            <label key={opt.key} className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant bg-surface cursor-pointer hover:border-primary/50 transition-all">
              <input
                checked={deliveryOption === opt.key}
                onChange={() => setDeliveryOption(opt.key)}
                className="accent-primary w-4 h-4 shrink-0"
                name="delivery"
                type="radio"
              />
              <Icon size={18} className="text-on-surface-variant shrink-0" weight="regular" />
              <div className="flex-grow min-w-0">
                <span className="font-bold text-on-surface text-xs">{opt.label}</span>
                <p className="text-[10px] text-on-surface-variant">{opt.description}</p>
              </div>
              <span className={`font-bold text-xs shrink-0 ${isFree ? "text-green-600" : "text-primary"}`}>
                {priceLabel}
              </span>
            </label>
          );
        })}
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

/* ── Payment step ────────────────────────────────────────────────────────── */
const PAYMENT_METHODS = [
  { id: "card",       label: "Card",       Icon: IconCard,       sub: "Credit / Debit"  },
  { id: "netbanking", label: "Netbanking", Icon: IconNetbanking, sub: "All major banks"  },
  { id: "wallet",     label: "Wallets",    Icon: IconWallet,     sub: "Paytm / PhonePe" },
  { id: "cod",        label: "Cash",       Icon: IconMoney,      sub: "Pay on delivery" },
];

function PaymentStep({
  goToStep, handlePay, total, isService, submitting, errorMsg,
  paymentMethod, setPaymentMethod,
}) {
  const backStep = isService ? 1 : 2;
  const isOnline = paymentMethod !== "cod";

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <IconLock size={18} className="text-primary" weight="regular" />
        <h2 className="text-sm font-semibold text-on-surface">Secure Payment</h2>
      </div>

      {/* Method selector */}
      <div className="grid grid-cols-4 gap-2">
        {PAYMENT_METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setPaymentMethod(m.id)}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all cursor-pointer outline-none ${
              paymentMethod === m.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-outline-variant bg-surface hover:border-primary/40"
            }`}
          >
            <m.Icon size={20} className={paymentMethod === m.id ? "text-primary" : "text-on-surface-variant"} weight="regular" />
            <span className={`text-[10px] font-bold leading-tight ${paymentMethod === m.id ? "text-primary" : "text-on-surface"}`}>
              {m.label}
            </span>
            <span className="text-[9px] text-on-surface-variant leading-tight hidden sm:block">{m.sub}</span>
          </button>
        ))}
      </div>

      {/* Online payment — Razorpay handles the actual form in its own modal */}
      {isOnline && (
        <Card className="flex items-start gap-3.5">
          <div className="mt-0.5 w-8 h-8 rounded-lg bg-[#072654] flex items-center justify-center shrink-0">
            <span className="text-white font-black text-[10px] tracking-tight">R₹</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-on-surface">
              {paymentMethod === "card"       && "Pay by Credit / Debit Card"}
              {paymentMethod === "netbanking" && "Pay via Netbanking"}
              {paymentMethod === "wallet"     && "Pay via Wallet (Paytm / PhonePe)"}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
              Clicking <strong>Pay {fmt(total)}</strong> opens a secure Razorpay popup.
              Enter your card / UPI / wallet details there — nothing is stored on our servers.
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <IconShield size={12} className="text-green-600" weight="fill" />
              <span className="text-[10px] text-green-700 font-semibold">256-bit SSL · PCI-DSS compliant</span>
            </div>
          </div>
        </Card>
      )}

      {/* COD */}
      {paymentMethod === "cod" && (
        <Card className="flex items-start gap-3">
          <IconMoney size={20} className="text-primary mt-0.5" weight="regular" />
          <div>
            <p className="text-xs font-bold text-on-surface">Cash on Delivery</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">
              Pay in cash when your order arrives. No online transaction needed.
              Your order status will be <strong>Pending</strong> until delivered.
            </p>
          </div>
        </Card>
      )}

      {/* Error / cancel message */}
      {errorMsg && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-error/5 border border-error/20 rounded-xl">
          <span className="text-error text-base mt-px shrink-0">⚠</span>
          <p className="text-xs text-error font-semibold leading-relaxed">{errorMsg}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" onClick={() => goToStep(backStep)} disabled={submitting}>
          <IconArrowLeft size={16} weight="bold" /> Back
        </Button>
        <Button onClick={handlePay} disabled={submitting} className="px-6 py-2.5 shadow-md">
          {submitting
            ? <><IconSpinner size={16} className="animate-spin" weight="regular" /> Processing…</>
            : paymentMethod === "cod"
              ? <><IconCheck size={16} weight="bold" /> Place Order</>
              : <><IconLock size={16} weight="bold" /> Pay {fmt(total)}</>
          }
        </Button>
      </div>
    </section>
  );
}

/* ── Order summary sidebar ────────────────────────────────────────────────── */
function OrderSummary({ isService, service, bookingDate, bookingTime, checkoutItems, subtotal, shipping, tax, taxRate, total, couponCode, setCouponCode, applyCoupon, couponError, discount }) {
  return (
    <aside className="lg:col-span-4 space-y-4">
      <Card className="sticky top-24">
        <h3 className="text-sm font-semibold text-on-surface mb-4 border-b border-outline-variant/20 pb-2">
          {isService ? "Appointment Summary" : "Order Summary"}
        </h3>

        {isService ? (
          <div className="space-y-4 mb-6">
            {service && (
              <>
                <div className="flex gap-3">
                  <img src={service.image} alt={service.title} className="w-16 h-16 rounded-xl object-cover bg-surface-container-low flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-on-surface">{service.title}</h4>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{service.category}</span>
                    <p className="text-xs text-primary font-bold mt-1">{service.duration}</p>
                  </div>
                </div>
                <div className="bg-surface-container rounded-xl p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-on-surface-variant">Date</span>
                    <span className="text-[10px] font-semibold text-on-surface">{bookingDate || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-on-surface-variant">Time</span>
                    <span className="text-[10px] font-semibold text-on-surface">{bookingTime || "—"}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {checkoutItems.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-4">No items selected.</p>
            ) : checkoutItems.map((item) => {
              const id = item.product._id ?? item.product.id;
              return (
                <div className="flex gap-3" key={id}>
                  <img alt={item.product.name} className="w-14 h-14 rounded-xl object-cover bg-surface-container-low shrink-0" src={item.product.image} />
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-bold text-on-surface truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-on-surface-variant">Qty: {item.quantity}</p>
                    <p className="text-xs font-bold text-primary mt-0.5">{fmt(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Totals */}
        <div className="space-y-2.5 border-t border-outline-variant/20 pt-4 mb-4">
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          {!isService && (
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>{shipping === 0 ? "FREE" : fmt(shipping ?? 0)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-on-surface-variant">
            <span>Tax ({taxRate ?? 18}% GST)</span><span>{fmt(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-xs text-green-600 font-bold">
              <span>Coupon discount</span><span>−{fmt(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-semibold text-on-surface pt-1.5 border-t border-outline-variant/10">
            <span>Total</span><span className="text-primary font-black">{fmt(total)}</span>
          </div>
        </div>

        {/* Coupon */}
        <div className="space-y-1.5">
          <div className="relative">
            <input
              className="w-full bg-surface-container-low border border-transparent rounded-xl focus:border-primary focus:ring-0 text-xs py-3 pl-4 pr-16 text-on-surface"
              placeholder="Coupon Code"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
            />
            <button
              onClick={applyCoupon}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-bold text-xs hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer border-none bg-transparent"
            >
              Apply
            </button>
          </div>
          {couponError && <p className="text-[10px] text-error font-semibold">{couponError}</p>}
          {discount > 0 && <p className="text-[10px] text-green-600 font-semibold">Coupon applied! You save {fmt(discount)}</p>}
        </div>

        <div className="mt-5 flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-all">
          <IconShield size={16} weight="regular" />
          <IconMoney size={16} weight="regular" />
          <IconLock size={16} weight="regular" />
        </div>
      </Card>
    </aside>
  );
}

/* ── Main container ──────────────────────────────────────────────────────── */
export default function CheckoutContainer() {
  const c = useCheckoutContainer();

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full flex-grow">

        <div className="lg:col-span-8 space-y-8">
          <StepNav steps={c.steps} activeStep={c.activeStep} />

          {/* Service flow */}
          {c.isService && c.activeStep === 1 && (
            <ContactStep form={c.contactForm} setForm={c.setContactForm} goToStep={c.goToStep} />
          )}
          {c.isService && c.activeStep === 2 && (
            <PaymentStep goToStep={c.goToStep} handlePay={c.handlePay} total={c.total}
              isService submitting={c.submitting} errorMsg={c.errorMsg}
              paymentMethod={c.paymentMethod} setPaymentMethod={c.setPaymentMethod} />
          )}

          {/* Cart flow */}
          {!c.isService && c.activeStep === 1 && (
            <ShippingStep
              savedAddresses={c.savedAddresses}
              addressesLoading={c.addressesLoading}
              selectedAddressId={c.selectedAddressId}
              setSelectedAddressId={c.setSelectedAddressId}
              showNewAddressForm={c.showNewAddressForm}
              setShowNewAddressForm={c.setShowNewAddressForm}
              newAddress={c.newAddress}
              setNewAddress={c.setNewAddress}
              saveAndSelectAddress={c.saveAndSelectAddress}
              goToStep={c.goToStep}
            />
          )}
          {!c.isService && c.activeStep === 2 && (
            <DeliveryStep
              deliveryOption={c.deliveryOption}
              setDeliveryOption={c.setDeliveryOption}
              deliveryOptions={c.activeDeliveryOptions}
              freeShipThreshold={c.freeShipThreshold}
              goToStep={c.goToStep}
            />
          )}
          {!c.isService && c.activeStep === 3 && (
            <PaymentStep goToStep={c.goToStep} handlePay={c.handlePay} total={c.total}
              isService={false} submitting={c.submitting} errorMsg={c.errorMsg}
              paymentMethod={c.paymentMethod} setPaymentMethod={c.setPaymentMethod} />
          )}
        </div>

        <OrderSummary
          isService={c.isService}
          service={c.service}
          bookingDate={c.bookingDate}
          bookingTime={c.bookingTime}
          checkoutItems={c.checkoutItems}
          subtotal={c.subtotal}
          shipping={c.shipping}
          tax={c.tax}
          taxRate={c.taxRate}
          total={c.total}
          couponCode={c.couponCode}
          setCouponCode={c.setCouponCode}
          applyCoupon={c.applyCoupon}
          couponError={c.couponError}
          discount={c.discount}
        />
      </main>
    </div>
  );
}
