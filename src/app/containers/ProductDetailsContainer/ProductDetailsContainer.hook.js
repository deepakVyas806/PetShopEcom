import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";


const BUNDLE_ITEMS = [
  {
    id: "bundle_supp",
    name: "Pet Multivitamin Supplement",
    price: 19.99,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIaDKYZ0LTIBzFQJba07WuZ2VjWmV3wGD8xV1oiQf31PXOTzrikfEoGHtHyEcx92UxXFnQ7UdNkxcX_IuERgETU7NPxSM-DOwLffvtT3MmXa1lHM4h-czETxpOm5EJXBZy1SILMX9y7Pp67-Nz4yZFLlGkF4HZKdETucwFk_yBk6rplKMq0C_0Lw1VgPsbZdzO0fRk1Z9Kot-ifzPQvSADuUp9qGaQJt8dUNpyoXAr66o1u3lDL9NoKkOf9TWrLuLUOBP5FfNAWZl0"
  },
  {
    id: "bundle_bowl",
    name: "Artisan Ceramic Bowl",
    price: 39.99,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8q7-VpKBRB21C-0vG7eQJfY9PFwsFuN281FCqZDNqD2stBsqu4OcB3lo0Stf8OK3BPeKLDYNzyMj5Xq_fnV7UzUfXVqdZz4BVyeoiYWG9wnhBH3fIxEIKkuKkcciTngvKZHd-snALTLJtX9FwkwftSSlGbeZlVQu0ivBUf_9eW4_L-GAhM7Y-zus9y2CkLGf8dAUIWNA5zo7e6rHUMS9bgx9mcfybzZA_j3ldvf_PXhcow"
  }
];

export default function useProductDetails(productId) {
  const { addToCart, removeFromCart } = useStore();

  const [product,   setProduct]   = useState(null);
  const [ratingAgg, setRatingAgg] = useState(null);
  const [loading,   setLoading]   = useState(true);

  const [apiReviews,    setApiReviews]    = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    api.get(`/products/${productId}`)
      .then(data => {
        setProduct(data.product ?? null);
        setRatingAgg(data.ratingAgg ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    setReviewsLoading(true);
    api.get(`/products/${productId}/reviews?limit=10`)
      .then(data => setApiReviews(data.reviews ?? []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [productId]);

  // Gallery: real images array, fall back to primary image only
  const gallery = useMemo(() => {
    if (!product) return [];
    const imgs = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [];
    return [product.image, ...imgs].filter(Boolean);
  }, [product]);

  const [activeImage, setActiveImage] = useState("");
  useEffect(() => { if (product?.image) setActiveImage(product.image); }, [product]);

  // Sizes: real variants first, fall back by category
  const sizes = useMemo(() => {
    if (!product) return ["Small", "Medium", "Large"];
    if (product.variants?.length > 0) return product.variants.map(v => v.name);
    if (product.category === "dogs" || product.category === "cats") return ["2kg", "12kg", "18kg"];
    if (product.category === "pharmacy") return ["100ml", "250ml", "500ml"];
    return ["Small", "Medium", "Large"];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState("");
  useEffect(() => { if (sizes.length > 0) setSelectedSize(sizes[0]); }, [sizes]);

  // Selected variant and its price
  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length || !selectedSize) return null;
    return product.variants.find(v => v.name === selectedSize) ?? null;
  }, [product, selectedSize]);

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;

  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const [activeTab, setActiveTab] = useState("Specifications");

  const [checkedBundleItems, setCheckedBundleItems] = useState({ bundle_supp: true, bundle_bowl: true });
  const toggleBundleItem = (itemId) => setCheckedBundleItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));

  const bundleTotal = useMemo(() => {
    let total = displayPrice;
    if (checkedBundleItems.bundle_supp) total += BUNDLE_ITEMS[0].price;
    if (checkedBundleItems.bundle_bowl) total += BUNDLE_ITEMS[1].price;
    return total;
  }, [displayPrice, checkedBundleItems]);

  // Rating distribution from real ratingAgg — empty array when no reviews
  const ratingDistribution = useMemo(() => {
    if (!ratingAgg?.dist?.length) return [];
    const dist = ratingAgg.dist;
    const total = dist.length;
    return [5, 4, 3, 2, 1].map(star => ({
      star: String(star),
      pct: Math.round((dist.filter(r => r === star).length / total) * 100),
    }));
  }, [ratingAgg]);

  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedToCartSuccess(true);
    setTimeout(() => setAddedToCartSuccess(false), 2000);
  };

  const handleBuyNow = () => handleAddToCart();

  const handleAddBundleToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    if (checkedBundleItems.bundle_supp) addToCart({ ...BUNDLE_ITEMS[0], category: "pharmacy" });
    if (checkedBundleItems.bundle_bowl) addToCart({ ...BUNDLE_ITEMS[1], category: "dogs" });
    setAddedToCartSuccess(true);
    setTimeout(() => setAddedToCartSuccess(false), 2000);
  };

  return {
    product, loading,
    ratingAgg, ratingDistribution,
    apiReviews, reviewsLoading,
    gallery, activeImage, setActiveImage,
    sizes, selectedSize, setSelectedSize,
    selectedVariant, displayPrice,
    quantity, incrementQuantity, decrementQuantity,
    activeTab, setActiveTab,
    checkedBundleItems, toggleBundleItem,
    bundleTotal, bundleItems: BUNDLE_ITEMS,
    handleAddToCart, handleBuyNow, handleAddBundleToCart,
    addedToCartSuccess, removeFromCart,
  };
}
