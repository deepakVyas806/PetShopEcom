"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";
import useStoreSettings from "@/lib/useStoreSettings";

export default function useCheckoutContainer() {
  const storeSettings = useStoreSettings();
  const router        = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useStore();

  const isService   = searchParams.get("type") === "service";
  const serviceId   = searchParams.get("serviceId") || "";
  const bookingDate = searchParams.get("date") || "";
  const bookingTime = searchParams.get("time") || "";

  // ── Service data ─────────────────────────────────────────────────────────
  const [service, setService] = useState(null);
  useEffect(() => {
    if (!isService || !serviceId) return;
    api.get(`/services/${serviceId}`).then(d => setService(d.service ?? null)).catch(() => {});
  }, [isService, serviceId]);

  // ── Cart items — prefer sessionStorage (selected items from cart page) ────
  const [checkoutItems, setCheckoutItems] = useState([]);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("checkout_items");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCheckoutItems(parsed);
          return;
        }
      }
    } catch { /* ignore */ }
    // fallback: nothing (user should come from cart page)
  }, []);

  // ── Saved addresses ───────────────────────────────────────────────────────
  const [savedAddresses,   setSavedAddresses]   = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // New address form (used when typing manually or no saved addresses)
  const [newAddress, setNewAddress] = useState({
    name: "", line1: "", city: "", state: "", pincode: "", phone: "",
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  useEffect(() => {
    if (isService) return;
    setAddressesLoading(true);
    api.get("/addresses")
      .then(data => {
        const addrs = data.addresses ?? [];
        setSavedAddresses(addrs);
        const def = addrs.find(a => a.isDefault) ?? addrs[0];
        if (def) setSelectedAddressId(def._id);
      })
      .catch(() => {})
      .finally(() => setAddressesLoading(false));
  }, [isService]);

  // ── Step management ───────────────────────────────────────────────────────
  const steps = isService ? ["Contact", "Payment"] : ["Shipping", "Delivery", "Payment"];
  const [activeStep, setActiveStep] = useState(1);

  const goToStep = (step) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Delivery option ───────────────────────────────────────────────────────
  const [deliveryOption, setDeliveryOption] = useState("standard");
  // Active delivery options from settings (admin-configurable)
  const activeDeliveryOptions = useMemo(
    () => (storeSettings.deliveryOptions ?? []).filter(o => o.active),
    [storeSettings.deliveryOptions]
  );
  const deliveryCost = useMemo(() => {
    const opt = storeSettings.deliveryOptions?.find(o => o.key === deliveryOption);
    return opt?.cost ?? 0;
  }, [deliveryOption, storeSettings.deliveryOptions]);

  // ── Coupon ────────────────────────────────────────────────────────────────
  const [couponCode,  setCouponCode]  = useState("");
  const [couponError, setCouponError] = useState(null);
  const [discount,    setDiscount]    = useState(0);

  // ── Order form state ──────────────────────────────────────────────────────
  const [contactForm, setContactForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", notes: "",
  });

  // ── Financials ────────────────────────────────────────────────────────────
  const subtotal = useMemo(() => {
    if (isService) return service?.price ?? 0;
    return checkoutItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }, [isService, service, checkoutItems]);

  const shipping = isService ? null : (subtotal >= storeSettings.freeShippingThreshold ? 0 : deliveryCost);
  const tax      = +(subtotal * storeSettings.taxRate / 100).toFixed(2);
  const total    = Math.max(0, subtotal + (shipping ?? 0) + tax - discount);

  const applyCoupon = async () => {
    setCouponError(null);
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return; }
    try {
      const data = await api.post("/coupons/validate", { code: couponCode.trim(), orderTotal: subtotal });
      if (data.valid === false) { setCouponError(data.message ?? "Invalid coupon"); return; }
      setDiscount(data.discount ?? 0);
    } catch (err) {
      setCouponError(err.message ?? "Invalid coupon");
    }
  };

  // ── Save a new address then proceed ──────────────────────────────────────
  const saveAndSelectAddress = async () => {
    try {
      const data = await api.post("/addresses", {
        ...newAddress,
        country:   "India",
        isDefault: savedAddresses.length === 0,
      });
      const saved = data.address;
      setSavedAddresses(prev => [...prev, saved]);
      setSelectedAddressId(saved._id);
      setShowNewAddressForm(false);
    } catch (err) {
      // surface error to UI
      console.error("Address save failed:", err.message);
    }
  };

  // ── Submission ────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg,   setErrorMsg]   = useState(null);

  const handlePay = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (isService) {
        await api.post("/appointments", { serviceId, date: bookingDate, timeSlot: bookingTime });
        router.push("/appointments");
      } else {
        const shippingAddress =
          selectedAddressId
            ? savedAddresses.find(a => a._id === selectedAddressId)
            : { ...newAddress, country: "India" };

        const data = await api.post("/orders", {
          items: checkoutItems.map(i => ({
            productId: i.product._id ?? i.product.id,
            quantity:  i.quantity,
          })),
          shippingAddress,
          paymentMethod: "Credit / Debit Card",
          couponCode:    couponCode.trim() || undefined,
        });

        // Clear cart and sessionStorage
        clearCart();
        try { sessionStorage.removeItem("checkout_items"); } catch { /**/ }

        const oid = data.order?._id;
        router.push(oid ? `/order-confirmation?orderId=${oid}` : "/order-confirmation");
      }
    } catch (err) {
      setErrorMsg(err.message ?? "Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isService, service, bookingDate, bookingTime,
    steps, activeStep, goToStep,

    checkoutItems,

    savedAddresses, addressesLoading, selectedAddressId, setSelectedAddressId,
    showNewAddressForm, setShowNewAddressForm,
    newAddress, setNewAddress, saveAndSelectAddress,

    contactForm, setContactForm,

    deliveryOption, setDeliveryOption,
    activeDeliveryOptions,
    taxRate:           storeSettings.taxRate,
    freeShipThreshold: storeSettings.freeShippingThreshold,

    couponCode, setCouponCode, couponError, applyCoupon, discount,

    subtotal, shipping, tax, total,

    submitting, errorMsg, handlePay,
  };
}
