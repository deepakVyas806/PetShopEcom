"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";

export default function useCheckoutContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart } = useStore();

  const isService   = searchParams.get("type") === "service";
  const serviceId   = searchParams.get("serviceId") || "1";
  const bookingDate = searchParams.get("date") || "";
  const bookingTime = searchParams.get("time") || "";

  const [service, setService] = useState(null);
  useEffect(() => {
    if (!isService) return;
    api.get(`/services/${serviceId}`).then(d => setService(d.service)).catch(() => {});
  }, [isService, serviceId]);

  const steps = isService ? ["Contact", "Payment"] : ["Shipping", "Delivery", "Payment"];
  const [activeStep, setActiveStep] = useState(1);
  const [couponCode,  setCouponCode]  = useState("");
  const [couponError, setCouponError] = useState(null);
  const [discount,    setDiscount]    = useState(0);
  const [submitting,  setSubmitting]  = useState(false);
  const [errorMsg,    setErrorMsg]    = useState(null);

  // Address fields
  const [address, setAddress] = useState({
    name: "", line1: "", city: "", pincode: "", phone: "",
  });

  const cartItems = cart.length > 0 ? cart : [];

  const subtotal = useMemo(() => {
    if (isService) return service?.price ?? 0;
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [isService, service, cartItems]);

  const shipping = isService ? null : (subtotal >= 999 ? 0 : 99);
  const tax      = +(subtotal * 0.18).toFixed(2);
  const total    = subtotal + (shipping ?? 0) + tax - discount;

  const applyCoupon = async () => {
    setCouponError(null);
    try {
      const data = await api.post("/coupons/validate", { code: couponCode, subtotal });
      setDiscount(data.discount ?? 0);
    } catch (err) {
      setCouponError(err.message ?? "Invalid coupon");
    }
  };

  const goToStep = (step) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (isService) {
        await api.post("/appointments", {
          serviceId,
          date:     bookingDate,
          timeSlot: bookingTime,
        });
        router.push("/appointments");
      } else {
        const data = await api.post("/orders", {
          items: cartItems.map(i => ({ productId: i.product._id ?? i.product.id, quantity: i.quantity })),
          shippingAddress: address,
          paymentMethod: "Credit / Debit Card",
          couponCode: couponCode || undefined,
        });
        clearCart();
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
    couponCode, setCouponCode, couponError, applyCoupon, discount,
    cartItems, subtotal, shipping, tax, total,
    address, setAddress,
    submitting, errorMsg, handlePay,
  };
}
