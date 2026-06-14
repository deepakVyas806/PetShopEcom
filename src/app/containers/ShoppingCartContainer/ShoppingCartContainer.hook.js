import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function useShoppingCart() {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Promo code states
  const [promoInput,    setPromoInput]    = useState("");
  const [appliedCode,   setAppliedCode]   = useState("");
  const [promoError,    setPromoError]    = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);

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

  // Reset discount when cart items change significantly
  // (promoDiscount is now a state set by the API response)

  // Grand Total calculation
  const grandTotal = useMemo(() => {
    const total = subtotal + shipping + tax - promoDiscount;
    return Math.max(0, Number(total.toFixed(2)));
  }, [subtotal, shipping, tax, promoDiscount]);

  // Loyalty rewards points calculation (1 point per dollar of subtotal)
  const rewardsPoints = useMemo(() => {
    return Math.round(subtotal);
  }, [subtotal]);

  // Apply promo code handler — validates against the real API
  const applyPromoCode = async (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "") {
      setPromoError("Please enter a code");
      return;
    }
    if (!isAuthenticated) {
      setPromoError("Sign in to use promo codes");
      return;
    }
    setPromoError("");
    try {
      const data = await api.post("/coupons/validate", { code: cleanCode, subtotal });
      setAppliedCode(cleanCode);
      setPromoDiscount(data.discount ?? 0);
    } catch (err) {
      setPromoError(err.message ?? "Invalid promo code");
    }
  };

  // Remove promo code handler
  const removePromoCode = () => {
    setAppliedCode("");
    setPromoInput("");
    setPromoError("");
    setPromoDiscount(0);
  };

  // Quantity updates with validation
  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQty);
    }
  };

  // Place order/Checkout action — redirects to signin if unauthenticated
  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    if (isAuthenticated) {
      router.push("/checkout");
    } else {
      router.push("/signin?redirect=/checkout");
    }
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
    checkoutSuccess: false
  };
}
