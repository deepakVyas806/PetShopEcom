import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { api } from "@/lib/api";

const FALLBACK_THUMBS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAo_kONBapSdtdQXN1iLIqsgx81li30cgDA8cva9ckyj2KHwArvefh5AM2c3bwpoBQlq5TiztOFHXfRJZ7Z9yuvgCWM1R53ZwYQBJYUeLTqs6gBqbi7TGx4TGkxtwFjWjYUDq89Fnm6WgiUlSuxpXGF6YPAjHwJarKlVHWypZYySsUQ2puKX-OKbnf-JObiIhwJ6c1svFAvF3gVlucdV6Q5GEXRSeCRkaS_hSDDgRiKcHf44h-V1AbnpGvFaiB3t3HCMZPPpPFdvrSs",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCyKqrQDsfTBVnfdpYiJ9byCrZYFmQxDJpu21vwvmrTnUZ3lwn107dDmqbZ5eQKQI318xXxpgqDApPosbXxZ2ge_TR-JwK8stbnnntYh9pw-os5vagAqLGBa8bKQAvoWJUcmf3cK4V997P3E3oDH4nkvEMD1k9jdqn5wqmrCHSihwdpuiB2Ywt4oYYOI09CufqG1TBjHoV_RsLq9Mai8lsgNVSIgNIDFGuy36gRFAGuop-6mArpNaURIt861Z8s_8_xNM1BsMFKtVyi",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC3cxMdHKlvGIzLolFR5MWFHZ0fsWa5_jmD6MDohMGRVL6jBGfOLOa2iCxJPk4iW7RNOvmHiv7o7PPeg7ByBCehAGg8EHTT_0Ck90uiOfALAuoIbIPH7GvnqlUqcl_I9UGYoDo-R-uQLh5t1fM_CsDnAzgggAVKXiJtt0UAxbjnY-t74VThfKTfkoALjkDToiGSy6NYQvbRDnmZfuKVBMQ7SvW7DoQ5DbDNbbk9nww-XHCn1k6VfC2l5MppY4C_JwswZtm65mbEkQw1",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCpR7WJWn8YV2hKgLsOE9jR1ewYCFgDCq2x6ImGaa-6phRURMsh6eyDF3AQ_9wXsD9SXVyh2_Z5ucnTMZSIHuQQ_D-MKT36JhoaYRBVw1Q9jNIOrwyytLkwmKG5xEUJdLzxtrvUV4jNiQi2W4rBTyU4JRP8DgTZtSCcAIkS6Qon8VyY4yXpRNLsRBEyYp9Pwh7ZJKUB1nR4oWDrFA8W6LC3aajQjtdf0iQkcKuSG1p_GKu8szxpBxgfw89MbyH9GkR-c3e5Kaez78wj"
];

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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8q7-VpKBRB21C-0vG7eQJfY9PFwsFuN281FCqZDNqD2stBsqu4OcB3lu0Stf8OK3BPeKLDYNzyMj5Xq_fnV7UzUfXVqdZz4BVyeoiYWG9wnhBH3fIxEIKkuKkcciTngvKZHd-snALTLJtX9FwkwftSSlGbeZlVQu0ivBUf_9eW4_L-GAhM7Y-zus9y2CkLGf8dAUIWNA5zo7e6rHUMS9bgx9mcfybzZA_j3ldvf_zRIJ0YDTdUDadMfupn9evYnmmlLUe1_PXhcow"
  }
];

export default function useProductDetails(productId) {
  const { addToCart, removeFromCart } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    api.get(`/products/${productId}`)
      .then(data => setProduct(data.product))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const gallery = useMemo(() => {
    if (!product?.image) return [];
    return [product.image, ...FALLBACK_THUMBS];
  }, [product]);

  const [activeImage, setActiveImage] = useState("");
  useEffect(() => { if (product?.image) setActiveImage(product.image); }, [product]);

  const sizes = useMemo(() => {
    if (!product) return ["Small", "Medium", "Large"];
    if (product.category === "dogs" || product.category === "cats") return ["2kg", "12kg", "18kg"];
    if (product.category === "pharmacy") return ["100ml", "250ml", "500ml"];
    return ["Small", "Medium", "Large"];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState("");
  useEffect(() => { if (sizes.length > 0) setSelectedSize(sizes[1] || sizes[0]); }, [sizes]);

  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const [activeTab, setActiveTab] = useState("Specifications");

  const [checkedBundleItems, setCheckedBundleItems] = useState({ bundle_supp: true, bundle_bowl: true });
  const toggleBundleItem = (itemId) => setCheckedBundleItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));

  const bundleTotal = useMemo(() => {
    let total = product?.price ?? 0;
    if (checkedBundleItems.bundle_supp) total += BUNDLE_ITEMS[0].price;
    if (checkedBundleItems.bundle_bowl) total += BUNDLE_ITEMS[1].price;
    return total;
  }, [product?.price, checkedBundleItems]);

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
    gallery, activeImage, setActiveImage,
    sizes, selectedSize, setSelectedSize,
    quantity, incrementQuantity, decrementQuantity,
    activeTab, setActiveTab,
    checkedBundleItems, toggleBundleItem,
    bundleTotal, bundleItems: BUNDLE_ITEMS,
    handleAddToCart, handleBuyNow, handleAddBundleToCart,
    addedToCartSuccess, removeFromCart,
  };
}
