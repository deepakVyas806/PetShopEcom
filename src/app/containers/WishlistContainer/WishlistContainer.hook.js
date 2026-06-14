import { useState, useEffect, useCallback } from "react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

function transformProduct(p) {
  const stockQty = typeof p.stock === "number" ? p.stock : 0;
  const stockStatus = stockQty > 0 ? (stockQty <= 5 ? "lowStock" : "inStock") : "outOfStock";
  const hasMrpDiscount = p.mrp && p.mrp > p.price;
  return {
    id:            p._id ?? p.id,
    image:         p.image ?? "",
    category:      p.petTypes?.[0] ?? p.category ?? "General",
    type:          p.category ?? "",
    name:          p.name,
    price:         p.price,
    originalPrice: hasMrpDiscount ? p.mrp : null,
    badge:         p.badge || (hasMrpDiscount ? "priceDrop" : null),
    stock:         stockStatus,
    itemType:      "product",
  };
}

export default function useWishlistContainer() {
  const { addToCart } = useStore();
  const { isAuthenticated } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [movingIds,     setMovingIds]     = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get("/wishlists")
      .then(data => setWishlistItems((data.items ?? []).map(transformProduct)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const removeFromWishlist = useCallback((id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    api.delete(`/wishlists/${id}`).catch(() => {});
  }, []);

  const moveToCart = useCallback((item) => {
    if (item.stock === "outOfStock" || item.itemType === "service") return;
    setMovingIds(prev => new Set([...prev, item.id]));
    addToCart({ _id: item.id, name: item.name, price: item.price, image: item.image });
    setTimeout(() => {
      removeFromWishlist(item.id);
      setMovingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 900);
  }, [addToCart, removeFromWishlist]);

  const addAllToCart = useCallback(() => {
    const addable = wishlistItems.filter(
      item => item.itemType === "product" && item.stock !== "outOfStock"
    );
    addable.forEach(item =>
      addToCart({ _id: item.id, name: item.name, price: item.price, image: item.image })
    );
    addable.forEach(item => removeFromWishlist(item.id));
  }, [wishlistItems, addToCart, removeFromWishlist]);

  return {
    wishlistItems,
    loading,
    movingIds,
    recentlyViewed: [],
    removeFromWishlist,
    moveToCart,
    addAllToCart,
  };
}
