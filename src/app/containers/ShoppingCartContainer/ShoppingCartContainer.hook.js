import { useState, useMemo } from "react";
import { useStore } from "@/context/StoreContext";

export default function useShoppingCart() {
  const { cart, updateQuantity, removeFromCart, placeOrder } = useStore();

  // Promo code states
  const [promoInput, setPromoInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Cart counts
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Shipping calculation (Free over $50, else $5.00)
  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 50 ? 0 : 5.00;
  }, [subtotal]);

  // Tax calculation (8.5% tax rate to match Stitch code.html layout)
  const tax = useMemo(() => {
    return Number((subtotal * 0.085).toFixed(2));
  }, [subtotal]);

  // Promo discount calculation (10% off subtotal if NEWPET10 is applied)
  const promoDiscount = useMemo(() => {
    if (appliedCode.toUpperCase() === "NEWPET10") {
      return Number((subtotal * 0.10).toFixed(2));
    }
    return 0;
  }, [subtotal, appliedCode]);

  // Grand Total calculation
  const grandTotal = useMemo(() => {
    const total = subtotal + shipping + tax - promoDiscount;
    return Math.max(0, Number(total.toFixed(2)));
  }, [subtotal, shipping, tax, promoDiscount]);

  // Loyalty rewards points calculation (1 point per dollar of subtotal)
  const rewardsPoints = useMemo(() => {
    return Math.round(subtotal);
  }, [subtotal]);

  // Apply promo code handler
  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "NEWPET10") {
      setAppliedCode("NEWPET10");
      setPromoError("");
    } else if (cleanCode === "") {
      setPromoError("Please enter a code");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  // Remove promo code handler
  const removePromoCode = () => {
    setAppliedCode("");
    setPromoInput("");
    setPromoError("");
  };

  // Quantity updates with validation
  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQty);
    }
  };

  // Place order/Checkout action
  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    
    // Simulate placing order using StoreContext
    placeOrder({
      address: "120 Logistics Hub, Andheri East, Mumbai, Maharashtra, India",
      paymentMethod: "Credit Card (Mock Payment)"
    });

    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
    }, 4000);
  };

  return {
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
    handleRemoveItem: removeFromCart,
    handleProceedToCheckout,
    checkoutSuccess
  };
}
