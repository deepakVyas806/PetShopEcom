import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import useStoreSettings from "@/lib/useStoreSettings";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function pid(product) {
  return product?._id ?? product?.id ?? "";
}

export default function useShoppingCart() {
  const storeSettings = useStoreSettings();
  const {
    cart: storeCart,
    cartReady,
    removeFromCart: storeRemove,
    updateQuantity: storeUpdate,
  } = useStore();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Mirror storeCart locally so we can do optimistic updates
  const [cartItems, setCartItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Promo code states
  const [promoInput,       setPromoInput]       = useState("");
  const [appliedCode,      setAppliedCode]      = useState("");
  const [promoError,       setPromoError]       = useState("");
  const [promoDiscount,    setPromoDiscount]    = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // ── Fetch available coupons ────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/coupons`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.coupons) setAvailableCoupons(data.coupons); })
      .catch(() => {});
  }, []);

  // ── Sync from StoreContext (single source of truth — StoreContext fetches API on mount) ──
  useEffect(() => {
    if (!cartReady) return;
    const normalised = storeCart.map(i => ({ product: i.product, quantity: i.quantity }));
    setCartItems(normalised);
    setSelectedIds(prev => {
      // Keep existing selections if items still exist, auto-select new items
      const existingIds = new Set(normalised.map(i => pid(i.product)));
      const kept = new Set([...prev].filter(id => existingIds.has(id)));
      // Auto-select any newly added items
      normalised.forEach(i => {
        if (!prev.size) kept.add(pid(i.product)); // first load — select all
      });
      return kept.size === 0 && normalised.length > 0
        ? new Set(normalised.map(i => pid(i.product))) // fallback: select all
        : kept;
    });
  }, [storeCart, cartReady]);

  const loading = !cartReady;

  // ── Selection helpers ──────────────────────────────────────────────────────
  const isAllSelected = cartItems.length > 0 && cartItems.every(i => selectedIds.has(pid(i.product)));

  const toggleSelectItem = (productId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cartItems.map(i => pid(i.product))));
    }
  };

  // ── Selected items subset ──────────────────────────────────────────────────
  const selectedItems = useMemo(
    () => cartItems.filter(i => selectedIds.has(pid(i.product))),
    [cartItems, selectedIds]
  );

  // ── Financials (only selected items) ──────────────────────────────────────
  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [selectedItems]
  );

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= storeSettings.freeShippingThreshold ? 0 : storeSettings.baseShippingCost;
  }, [subtotal, storeSettings.freeShippingThreshold, storeSettings.baseShippingCost]);

  const tax = useMemo(
    () => Number((subtotal * storeSettings.taxRate / 100).toFixed(2)),
    [subtotal, storeSettings.taxRate]
  );

  const grandTotal = useMemo(
    () => Math.max(0, Number((subtotal + shipping + tax - promoDiscount).toFixed(2))),
    [subtotal, shipping, tax, promoDiscount]
  );

  const rewardsPoints = useMemo(() => Math.round(subtotal), [subtotal]);
  const cartCount     = useMemo(() => cartItems.reduce((s, i) => s + i.quantity, 0), [cartItems]);
  const selectedCount = selectedItems.reduce((s, i) => s + i.quantity, 0);

  const itemSavings = useMemo(() =>
    selectedItems.reduce((acc, i) => {
      const mrp = i.product.mrp ?? i.product.price;
      return acc + Math.max(0, (mrp - i.product.price) * i.quantity);
    }, 0),
    [selectedItems]
  );
  const totalSavings = itemSavings + promoDiscount;

  // ── Update quantity (optimistic local + StoreContext sync — StoreContext calls API) ──
  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    // Optimistic local update (instant UI feedback)
    setCartItems(prev =>
      prev.map(i => pid(i.product) === productId ? { ...i, quantity: newQty } : i)
    );
    // StoreContext handles the API PATCH call — no duplicate call here
    storeUpdate(productId, newQty);
  };

  // ── Remove item (optimistic local + StoreContext sync) ────────────────────
  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(i => pid(i.product) !== productId));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
    // StoreContext handles the API DELETE call — no duplicate call here
    storeRemove(productId);
  };

  // ── Promo code ─────────────────────────────────────────────────────────────
  const applyPromoCode = async (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) { setPromoError("Please enter a code"); return; }
    if (!isAuthenticated) { setPromoError("Sign in to use promo codes"); return; }
    setPromoError("");
    try {
      const data = await api.post("/coupons/validate", { code: cleanCode, orderTotal: subtotal });
      setAppliedCode(cleanCode);
      setPromoDiscount(data.discount ?? 0);
    } catch (err) {
      setPromoError(err.message ?? "Invalid promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedCode("");
    setPromoInput("");
    setPromoError("");
    setPromoDiscount(0);
  };

  // ── Checkout (only selected) ───────────────────────────────────────────────
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) return;
    if (!isAuthenticated) {
      router.push("/signin?redirect=/checkout");
      return;
    }
    try {
      sessionStorage.setItem("checkout_items", JSON.stringify(selectedItems));
    } catch { /* ignore */ }
    router.push("/checkout");
  };

  return {
    cart:             cartItems,
    cartCount,
    loading,
    availableCoupons,
    selectedIds,
    selectedItems,
    selectedCount,
    isAllSelected,
    toggleSelectItem,
    toggleSelectAll,
    subtotal,
    shipping,
    tax,
    taxRate:           storeSettings.taxRate,
    freeShipThreshold: storeSettings.freeShippingThreshold,
    promoDiscount,
    grandTotal,
    rewardsPoints,
    totalSavings,
    promoInput,
    setPromoInput,
    appliedCode,
    promoError,
    applyPromoCode,
    removePromoCode,
    handleUpdateQuantity,
    handleRemoveItem,
    handleProceedToCheckout,
  };
}
