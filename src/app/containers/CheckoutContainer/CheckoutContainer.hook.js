"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";
import useStoreSettings from "@/lib/useStoreSettings";
import { loadRazorpayScript, openRazorpayModal } from "@/lib/razorpay";

const EMPTY_ESTIMATE = { subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0, freeShipping: false };

export default function useCheckoutContainer() {
  const storeSettings = useStoreSettings();
  const router        = useRouter();
  const searchParams  = useSearchParams();
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
  }, []);

  // ── Saved addresses ───────────────────────────────────────────────────────
  const [savedAddresses,    setSavedAddresses]    = useState([]);
  const [addressesLoading,  setAddressesLoading]  = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

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
  const activeDeliveryOptions = (storeSettings.deliveryOptions ?? []).filter(o => o.active);

  // ── Payment method ────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState("card");

  // ── Coupon ────────────────────────────────────────────────────────────────
  const [couponCode,       setCouponCode]       = useState("");
  const [couponError,      setCouponError]      = useState(null);
  const [appliedCoupon,    setAppliedCoupon]    = useState("");
  const [availableOffers,  setAvailableOffers]  = useState([]);

  // ── Backend estimate — single source of truth for all financials ──────────
  const [estimate,        setEstimate]        = useState(EMPTY_ESTIMATE);
  const [estimateLoading, setEstimateLoading] = useState(false);

  const fetchEstimate = useCallback(async (items, option, coupon) => {
    if (!items.length) { setEstimate(EMPTY_ESTIMATE); return; }
    setEstimateLoading(true);
    try {
      const data = await api.post("/orders/estimate", {
        items: items.map(i => ({
          productId: i.product._id ?? i.product.id,
          quantity:  i.quantity,
        })),
        deliveryOption: option,
        couponCode:     coupon || undefined,
      });
      setEstimate(data);
      if (coupon && data.couponValid === false) {
        setCouponError("Coupon is not valid for this order");
        setAppliedCoupon("");
      }
    } catch {
      setEstimate(EMPTY_ESTIMATE);
    } finally {
      setEstimateLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isService) return;
    fetchEstimate(checkoutItems, deliveryOption, appliedCoupon);
  }, [checkoutItems, deliveryOption, appliedCoupon, isService, fetchEstimate]);

  // ── Service contact form ──────────────────────────────────────────────────
  const [contactForm, setContactForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", notes: "",
  });

  // Fetch offers applicable to all products in the cart (backend resolves categories)
  useEffect(() => {
    const params = new URLSearchParams();
    if (isService && serviceId) {
      params.set("serviceId", serviceId);
    } else if (checkoutItems.length > 0) {
      const productIds = [...new Set(checkoutItems.map(i => i.product?._id ?? i.product?.id).filter(Boolean))];
      if (productIds.length) params.set("productIds", productIds.join(","));
    }
    const qs = params.toString();
    if (!qs) return;
    api.get(`/coupons/applicable?${qs}`)
      .then(data => setAvailableOffers(data.coupons ?? []))
      .catch(() => {});
  }, [checkoutItems, isService, serviceId]);

  // ── Coupon apply — validates then triggers estimate re-fetch ──────────────
  const applyCoupon = async () => {
    setCouponError(null);
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return; }
    setAppliedCoupon(couponCode.trim().toUpperCase());
  };

  // One-click apply from an offer chip
  const applyCouponFromOffer = useCallback((code) => {
    setCouponError(null);
    setCouponCode(code);
    setAppliedCoupon(code);
  }, []);

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
      // ── Service appointment ───────────────────────────────────────────────
      if (isService) {
        await api.post("/appointments", { serviceId, date: bookingDate, timeSlot: bookingTime });
        router.push("/appointments");
        return;
      }

      const shippingAddress = selectedAddressId
        ? savedAddresses.find(a => a._id === selectedAddressId)
        : { ...newAddress, country: "India" };

      const orderPayload = {
        items: checkoutItems.map(i => ({
          productId: i.product._id ?? i.product.id,
          quantity:  i.quantity,
        })),
        shippingAddress,
        paymentMethod,
        deliveryOption,
        couponCode: appliedCoupon || undefined,
      };

      // ── Cash on delivery — no payment gateway ─────────────────────────────
      if (paymentMethod === "cod") {
        const data = await api.post("/orders", orderPayload);
        clearCart();
        try { sessionStorage.removeItem("checkout_items"); } catch { /**/ }
        router.push(`/order-confirmation?orderId=${data.order._id}`);
        return;
      }

      // ── Online payment via Razorpay ───────────────────────────────────────
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setErrorMsg("Payment gateway could not be loaded. Check your internet connection and try again.");
        setSubmitting(false);
        return;
      }

      // Use the backend-calculated total for Razorpay — no frontend math
      const rzpData = await api.post("/payment/create-order", { amount: estimate.total });

      setSubmitting(false);

      const prefillAddress = shippingAddress ?? {};
      openRazorpayModal({
        razorpayOrderId: rzpData.razorpayOrderId,
        amount:          rzpData.amount,
        keyId:           rzpData.keyId,
        storeName:       "artPet Shop",
        method:          paymentMethod,
        prefill: {
          name:    prefillAddress.name  ?? "",
          contact: prefillAddress.phone ?? "",
        },
        onSuccess: async (response) => {
          setSubmitting(true);
          setErrorMsg(null);
          try {
            const data = await api.post("/orders", {
              ...orderPayload,
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clearCart();
            try { sessionStorage.removeItem("checkout_items"); } catch { /**/ }
            router.push(`/order-confirmation?orderId=${data.order._id}`);
          } catch (err) {
            setErrorMsg(
              err.message ??
              "Your payment was received but order creation failed. Please contact support with your payment ID."
            );
            setSubmitting(false);
          }
        },
        onDismiss: () => {
          setErrorMsg("Payment was cancelled. Click 'Pay' to try again.");
          setSubmitting(false);
        },
      });

    } catch (err) {
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  // For service bookings, use the service price directly
  const serviceTotal = isService ? (service?.price ?? 0) : 0;

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

    paymentMethod, setPaymentMethod,

    couponCode, setCouponCode, couponError, applyCoupon,
    appliedCoupon, availableOffers, applyCouponFromOffer,

    // All financials come from backend estimate
    subtotal:  isService ? serviceTotal : estimate.subtotal,
    discount:  estimate.discount,
    tax:       estimate.tax,
    shipping:  isService ? null : estimate.shipping,
    total:     isService ? serviceTotal : estimate.total,
    freeShipping: estimate.freeShipping,
    taxRate:   storeSettings.taxRate,
    estimateLoading,

    submitting, errorMsg, handlePay,
  };
}
