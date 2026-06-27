import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";

export default function useProductDetails(productId) {
  const { addToCart } = useStore();

  const [product,        setProduct]        = useState(null);
  const [ratingAgg,      setRatingAgg]      = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [apiReviews,     setApiReviews]     = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [bundleItems,    setBundleItems]    = useState([]);
  const [coupons,        setCoupons]        = useState([]);

  // Fetch product + reviews
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

  // Fetch bundle suggestions — related products (different category, popular)
  useEffect(() => {
    if (!product) return;
    const cat = product.category ?? "";
    // Fetch 2 popular products from a complementary category
    const query = cat ? `/products?limit=2&sortBy=Popularity&exclude=${productId}` : `/products?limit=2&sortBy=Popularity`;
    api.get(query)
      .then(data => {
        const items = (data.products ?? []).slice(0, 2).map(p => ({
          id:    p._id ?? p.id,
          name:  p.name,
          price: p.price,
          image: p.image,
        }));
        setBundleItems(items);
      })
      .catch(() => {});
  }, [product, productId]);

  // Fetch applicable coupons once the product is loaded (global + product/category scoped)
  useEffect(() => {
    if (!product) return;
    if (!product._id) return;
    api.get(`/coupons/applicable?productIds=${product._id}`)
      .then(data => setCoupons(data.coupons ?? []))
      .catch(() => {});
  }, [product]);

  // Gallery
  const gallery = useMemo(() => {
    if (!product) return [];
    const imgs = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
    return [product.image, ...imgs].filter(Boolean);
  }, [product]);

  const [activeImage, setActiveImage] = useState("");
  useEffect(() => { if (product?.image) setActiveImage(product.image); }, [product]);

  // Sizes
  const sizes = useMemo(() => {
    if (!product) return ["Small", "Medium", "Large"];
    if (product.variants?.length > 0) return product.variants.map(v => v.name);
    if (product.category === "dogs" || product.category === "cats") return ["2kg", "12kg", "18kg"];
    if (product.category === "pharmacy") return ["100ml", "250ml", "500ml"];
    return ["Small", "Medium", "Large"];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState("");
  useEffect(() => { if (sizes.length > 0) setSelectedSize(sizes[0]); }, [sizes]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length || !selectedSize) return null;
    return product.variants.find(v => v.name === selectedSize) ?? null;
  }, [product, selectedSize]);

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;

  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const [activeTab, setActiveTab] = useState("Specifications");

  // Bundle state — keyed by product ID dynamically
  const [checkedBundleItems, setCheckedBundleItems] = useState({});
  useEffect(() => {
    if (bundleItems.length > 0) {
      setCheckedBundleItems(Object.fromEntries(bundleItems.map(i => [i.id, true])));
    }
  }, [bundleItems]);

  const toggleBundleItem = (itemId) =>
    setCheckedBundleItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));

  const bundleTotal = useMemo(() => {
    let total = displayPrice;
    bundleItems.forEach(item => {
      if (checkedBundleItems[item.id]) total += item.price;
    });
    return total;
  }, [displayPrice, bundleItems, checkedBundleItems]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    if (!ratingAgg?.dist?.length) return [];
    const dist = ratingAgg.dist;
    const total = dist.length;
    return [5, 4, 3, 2, 1].map(star => ({
      star: String(star),
      pct:  Math.round((dist.filter(r => r === star).length / total) * 100),
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
    bundleItems.forEach(item => {
      if (checkedBundleItems[item.id]) addToCart(item);
    });
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
    bundleItems, checkedBundleItems, toggleBundleItem, bundleTotal,
    coupons,
    handleAddToCart, handleBuyNow, handleAddBundleToCart,
    addedToCartSuccess,
  };
}
