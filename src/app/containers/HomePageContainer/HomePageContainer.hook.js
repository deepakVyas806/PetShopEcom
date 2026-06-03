import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function useHomePage() {
  const { products, addToCart } = useStore();

  const [addedItems,  setAddedItems]  = useState({});
  const [favorites,   setFavorites]   = useState([]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const premiumShowcase = products.slice(0, 5);

  return {
    premiumShowcase,
    addedItems,
    handleAddToCart,
    favorites,
    toggleFavorite,
  };
}
