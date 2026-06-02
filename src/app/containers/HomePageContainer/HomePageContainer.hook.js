import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function useHomePage() {
  const { products, addToCart } = useStore();
  const [addedItems, setAddedItems] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const premiumShowcase = products.slice(0, 4);

  return {
    premiumShowcase,
    addedItems,
    handleAddToCart,
  };
}
