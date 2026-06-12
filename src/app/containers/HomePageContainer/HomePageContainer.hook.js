import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";

export default function useHomePage() {
  const { addToCart } = useStore();

  const [addedItems,      setAddedItems]      = useState({});
  const [favorites,       setFavorites]       = useState([]);
  const [premiumShowcase, setPremiumShowcase] = useState([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    api.get("/products?featured=true&limit=5&sortBy=Popularity")
      .then(data => setPremiumShowcase(data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    const key = product._id ?? product.id;
    setAddedItems(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [key]: false })), 1500);
  };

  const toggleFavorite = (productId) =>
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);

  return { premiumShowcase, loading, addedItems, handleAddToCart, favorites, toggleFavorite };
}
