import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import useStoreSettings from "@/lib/useStoreSettings";

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

  // ── Backend estimate — single source of truth for all financials ──────────
  const [estimate, setEstimate] = useState({ subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 });
  const debounceRef = useRef(null);

  const fetchEstimate = useCallback(async (items) => {
    if (!items.length) {
      setEstimate({ subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 });
      return;
    }
    try {
      const data = await api.post("/orders/estimate", {
        items: items.map(i => ({ productId: pid(i.product), quantity: i.quantity })),
      });
      setEstimate(data);
    } catch { /* keep previous estimate on network error */ }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchEstimate(selectedItems);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [selectedItems, fetchEstimate]);

  const subtotal   = estimate.subtotal;
  const shipping   = estimate.shipping;
  const tax        = estimate.tax;
  const grandTotal = estimate.total;

  const rewardsPoints = useMemo(() => Math.round(subtotal), [subtotal]);
  const cartCount     = useMemo(() => cartItems.reduce((s, i) => s + i.quantity, 0), [cartItems]);
  const selectedCount = selectedItems.reduce((s, i) => s + i.quantity, 0);

  const totalSavings = useMemo(() =>
    selectedItems.reduce((acc, i) => {
      const mrp = i.product.mrp ?? i.product.price;
      return acc + Math.max(0, (mrp - i.product.price) * i.quantity);
    }, 0),
    [selectedItems]
  );

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

  // ── Checkout (only selected) ───────────────────────────────────────────────
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) return;
    // Save items before any redirect so they survive the sign-in round-trip
    try {
      sessionStorage.setItem("checkout_items", JSON.stringify(selectedItems));
    } catch { /* ignore */ }
    if (!isAuthenticated) {
      router.push("/signin?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return {
    cart:             cartItems,
    cartCount,
    loading,
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
    grandTotal,
    rewardsPoints,
    totalSavings,
    handleUpdateQuantity,
    handleRemoveItem,
    handleProceedToCheckout,
  };
}
