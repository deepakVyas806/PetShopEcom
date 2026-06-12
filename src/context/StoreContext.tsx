"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  product: any;
  quantity: number;
}

interface StoreContextType {
  cart:             CartItem[];
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

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Restore cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("petshop_cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist cart on every change
  useEffect(() => {
    try { localStorage.setItem("petshop_cart", JSON.stringify(cart)); }
    catch { /* ignore */ }
  }, [cart]);

  const addToCart = (product: any) =>
    setCart((prev) => {
      const hit = prev.find((i) => i.product.id === product.id);
      if (hit) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== productId));

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const noop = () => {};

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
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
