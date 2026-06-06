"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { siteConfig } from "@/config/site";

export interface CartItem {
  product: any;
  quantity: number;
}

export interface BookingItem {
  id: string;
  service: any;
  date: string;
  timeSlot: string;
  petName: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface OrderItem {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  trackingStatus: "Order Confirmed" | "Shipped" | "Out for Delivery" | "Delivered";
  trackingDate: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface StoreContextType {
  products: any[];
  services: any[];
  addProduct: (product: any) => void;
  addService: (service: any) => void;

  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  bookings: BookingItem[];
  addBooking: (service: any, date: string, timeSlot: string, petName: string) => void;
  cancelBooking: (bookingId: string) => void;
  
  orders: OrderItem[];
  placeOrder: (shippingDetails: { address: string; paymentMethod: string }) => OrderItem;
  updateOrderStatus: (orderId: string, status: OrderItem["trackingStatus"]) => void;

  userRole: "guest" | "customer" | "admin";
  currentUser: UserProfile | null;
  login: (role: "customer" | "admin", email: string) => void;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [userRole, setUserRole] = useState<"guest" | "customer" | "admin">("guest");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // ── Cart persistence: restore from localStorage on mount ──────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("petshop_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch {
      // ignore malformed data
    }
  }, []);

  // ── Cart persistence: write to localStorage on every cart change ───────────
  useEffect(() => {
    try {
      localStorage.setItem("petshop_cart", JSON.stringify(cart));
    } catch {
      // ignore storage errors (e.g. private browsing quota)
    }
  }, [cart]);

  // Load configuration items on mount
  useEffect(() => {
    setProducts(siteConfig.products);
    setServices(siteConfig.services);

    // Initial mock bookings
    setBookings([
      {
        id: "b1",
        service: siteConfig.services[0],
        date: "2026-06-05",
        timeSlot: "10:00 AM - 11:00 AM",
        petName: "Maximus (Canine)",
        status: "Scheduled",
      },
    ]);

    // Initial mock orders tracking
    setOrders([
      {
        id: "PET-99218",
        items: [
          {
            product: siteConfig.products[0],
            quantity: 1,
          },
        ],
        subtotal: siteConfig.products[0].price,
        tax: siteConfig.products[0].price * 0.18,
        shipping: 0.00,
        total: siteConfig.products[0].price * 1.18,
        shippingAddress: "402, Shanti Vihar, Link Road, Andheri West, Mumbai, Maharashtra 400053",
        paymentMethod: "UPI (Google Pay)",
        trackingStatus: "Shipped",
        trackingDate: "June 02, 2026",
      },
    ]);
  }, []);

  const addProduct = (newProduct: any) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const addService = (newService: any) => {
    setServices((prev) => [newService, ...prev]);
  };

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const addBooking = (service: any, date: string, timeSlot: string, petName: string) => {
    const newBooking: BookingItem = {
      id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      service,
      date,
      timeSlot,
      petName,
      status: "Scheduled",
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b))
    );
  };

  const placeOrder = (shippingDetails: { address: string; paymentMethod: string }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = subtotal * 0.18; // 18% GST standard in India
    const shipping = subtotal > 999 ? 0.00 : 99.00; // Free shipping above ₹999, else ₹99
    const total = subtotal + tax + shipping;

    const newOrder: OrderItem = {
      id: `PET-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: shippingDetails.address,
      paymentMethod: shippingDetails.paymentMethod,
      trackingStatus: "Order Confirmed",
      trackingDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderItem["trackingStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, trackingStatus: status } : o))
    );
  };

  const login = (role: "customer" | "admin", email: string) => {
    setUserRole(role);
    setCurrentUser({
      name: role === "admin" ? "Admin Chief" : "Lady Genevieve",
      email: email,
      avatar: role === "admin" ? "🛡️" : "🐶",
    });
  };

  const logout = () => {
    setUserRole("guest");
    setCurrentUser(null);
    clearCart();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        services,
        addProduct,
        addService,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        bookings,
        addBooking,
        cancelBooking,
        orders,
        placeOrder,
        updateOrderStatus,
        userRole,
        currentUser,
        login,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
