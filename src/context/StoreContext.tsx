"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  product:  any;
  quantity: number;
}

interface StoreContextType {
  cart:             CartItem[];
  cartReady:        boolean;
  addToCart:        (product: any) => void;
  removeFromCart:   (productId: string) => void;
  updateQuantity:   (productId: string, quantity: number) => void;
  clearCart:        () => void;
  // Legacy stubs — auth lives in AuthContext, data lives in per-hook API calls
  userRole:         "guest" | "customer" | "admin";
  currentUser:      null;
  login:            (role: "customer" | "admin", email: string) => void;
  logout:           () => void;
  products:         any[];
  services:         any[];
  orders:           any[];
  bookings:         any[];
  addProduct:       (p: any) => void;
  addService:       (s: any) => void;
  addBooking:       (service: any, date: string, timeSlot: string, petName: string) => void;
  cancelBooking:    (bookingId: string) => void;
  placeOrder:       (details: { address: string; paymentMethod: string }) => any;
  updateOrderStatus:(orderId: string, status: string) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("petshop_auth");
    return raw ? (JSON.parse(raw).token ?? null) : null;
  } catch { return null; }
}

// Normalize product ID — MongoDB uses _id, some mock data uses id
function pid(product: any): string {
  return product._id ?? product.id ?? "";
}

// Fire-and-forget cart API sync — silently skips if user is not authenticated
async function syncCart(
  endpoint: string,
  method: string,
  body?: Record<string, unknown>
) {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        // Only send Content-Type when there's a body — Fastify rejects empty-body JSON
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch { /* silent */ }
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);

  // On mount: restore from localStorage, then override with API cart if authenticated
  useEffect(() => {
    // 1. Local restore first (instant)
    try {
      const raw = localStorage.getItem("petshop_cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch { /* ignore */ }

    // 2. If authenticated, fetch server cart and use as source of truth
    const token = getToken();
    if (!token) {
      setCartReady(true);
      return;
    }

    fetch(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.items?.length > 0) {
          setCart(data.items);
          try { localStorage.setItem("petshop_cart", JSON.stringify(data.items)); } catch { /**/ }
        }
      })
      .catch(() => { /* ignore */ })
      .finally(() => setCartReady(true));
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem("petshop_cart", JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart]);

  const addToCart = (product: any) => {
    const id = pid(product);
    setCart((prev) => {
      const hit = prev.find((i) => pid(i.product) === id);
      if (hit) return prev.map((i) => pid(i.product) === id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    syncCart("/cart", "POST", { productId: id, quantity: 1 });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => pid(i.product) !== productId));
    syncCart(`/cart/${productId}`, "DELETE");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev) => prev.map((i) => pid(i.product) === productId ? { ...i, quantity } : i));
    syncCart(`/cart/${productId}`, "PATCH", { quantity });
  };

  const clearCart = () => {
    setCart([]);
    syncCart("/cart", "DELETE");
  };

  const noop = () => {};

  return (
    <StoreContext.Provider value={{
      cart, cartReady, addToCart, removeFromCart, updateQuantity, clearCart,
      userRole: "guest", currentUser: null,
      login: noop, logout: noop,
      products: [], services: [], orders: [], bookings: [],
      addProduct: noop, addService: noop,
      addBooking: noop, cancelBooking: noop,
      placeOrder: () => ({}),
      updateOrderStatus: noop,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
