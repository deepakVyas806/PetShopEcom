import { useState, useEffect, useMemo } from "react";
import { useStore } from "@/context/StoreContext";

// Sibling food items list matching ProductsListContainer exactly
const STATIC_FOOD_PRODUCTS = [
  {
    id: "f1",
    name: "Royal Canin Puppy Formula",
    price: 45.99,
    mrp: 58.00,
    rating: 5,
    reviewsCount: 42,
    category: "dogs",
    brand: "Royal Canin",
    badge: "Sale -20%",
    description: "Complete nutritional balance for large breed puppies with digestive support.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDESXKFifTmdMr8tiaLJ-_wu8GPNoxAv0-lu0_i6OYBAwwEibAJ7533mwcvmHvdbb5AykHnK3QEx6W9d3sO42b2Fq-R_moL9sde-5ayXwTyeyiEhqNaTg0aKcOScwiIS1YBd75eYxORnreF2JN75d41DSL9JRQ4DWBuIznWTcR060IrVnHYRABX-7JCykqHG49gtEiTqNCcQbmaK19kYdAnTgL9zPRHg2Gl3JLmuNZS6wBP-aXLh70y3MWuO7ecGn-jahRpuYHTGS5Y"
  },
  {
    id: "f2",
    name: "Purina Pro Plan Adult",
    price: 32.50,
    mrp: 39.00,
    rating: 4.5,
    reviewsCount: 128,
    category: "cats",
    brand: "Purina Pro",
    badge: "New",
    description: "High protein salmon & rice formula for healthy skin and coat shine.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWYaupJ7kQhPDsZrgyeKyYwqVxUVePftwZa-siB4kbV5tGP9dcTFQIZj_cON-8NWF4h5-_UwTDvLsTFR0200R4lfPEy8HaY_KRVd3EpLeZAHlV_DV3HZrHskf1WVmqi9v-AWN1n6VYln4OZJH7SvESGB_KrgALmoCw_YpS3ybPbTUwk7wVoEvbQThCDhp9SKrpBW5G7LYqYcWbAHPN4cnMy7IT5l_BwCQOkVFtGrm_-r7WAn5tWyD7A9mFo_dQ2qHLCKqunPQR2cwi"
  },
  {
    id: "f3",
    name: "Hill's Science Active",
    price: 62.00,
    mrp: 75.00,
    rating: 4,
    reviewsCount: 89,
    category: "dogs",
    brand: "Hill's Science Diet",
    description: "Specifically formulated for working dogs requiring extra energy and joint support.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrHVKfbTfyQoNGJF3E_P7PiK--ZdvGEZR-wUs_X00ZmaZZ-t0E5cBqhbx9wdSi36r7l77KvNs9wYE7u9AiRKn1W-iHV55fsy-XXxhvJvjOlbi3Kc_f-MkAeKVHgI9kdOYRaL1b4my0V6ko5I_PDv5ebLANDJRuSdr4TawV8TUfmuy-JUznb5AdjKDH7Wr84UOtdMQ4pRadI9ijAVhpWSO-FZQxTQ6Sy7ijaLRxkFmpu-FSDUTFA1KReQ3G5tYEy2byA5_eriEteUQq"
  },
  {
    id: "f4",
    name: "Blue Buffalo Small Bite",
    price: 28.99,
    mrp: 35.00,
    rating: 5,
    reviewsCount: 12,
    category: "small_pets",
    brand: "Blue Buffalo",
    description: "Premium small-bite formula enriched with LifeSource Bits for small breed health.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwEIOmLvyjCqeRLLDHScTpzhpl6unFx-yMD7dCuId2b0XRAy7NwTcvmnbLb4z6q7mK0fKL_5eWP7jBIQbLGSKK_CRGv7u00fz-Gby_mRhpGzfyrFGjmb0RKHY_KaYoRJByEIOG6CytFGx9SvD_x6Pue8tjR7D-d6lMpSPs7FgCVp-XUpUqpUVsy-_pZRll1upPTqlFsmrNdpMDpVK8fcxNR3M-JfGKbTE6-HKYgWPuBtZYclo7Vpe8-NS8l5aSHZDs0YSRH-TB2k-2"
  },
  {
    id: "f5",
    name: "Fancy Feast Classic",
    price: 18.25,
    mrp: 22.00,
    rating: 4,
    reviewsCount: 215,
    category: "cats",
    brand: "Purina Pro",
    badge: "Sale -15%",
    description: "Multipack of gourmet pâté flavors for the most discerning feline palate.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCUJXUWF3OQkOlExGrmiEehTYF7yfKmfCQoNbfV8HzpCasGXAbHaGVss-ZkxRjjuObWseOlku8LeqdP27RtgsDtp_YasHMHy3E0tf1SKaUfkuRHy4jZu-S_Ra4aTcRtc8SCZ_DI7MjKXLmUDJSlW4nkPfAM0spoBq-K_REsI3g6o8vFmwojrEV4pDWnf_EGpZQHJ5rWml1UnU5DaN9cienGaPaGCKsAMa4yloH4bK1W9WFuhJN5Fcrzhx8mhHwM-kyexJQE0XHf1UO"
  },
  {
    id: "f6",
    name: "Eukanuba Senior Fit",
    price: 54.99,
    mrp: 65.00,
    rating: 5,
    reviewsCount: 64,
    category: "dogs",
    brand: "Royal Canin",
    description: "Formulated with glucosamine and chondroitin for healthy joints in aging dogs.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlmodekjTA73VXLA_F4U2sPMsf7ENPLUjuD8RAz1mjw8OCm9bBduNKaGYMNbbxVfWysQ5bPXtRp6YtNrjafnWZRdetcNJDYBrxwqwrWxgD8Pb1Hu2jpRj6k_iyb9Hkh3jwG_SsYd9F2nvSRSk7Y3iWUbQMVNUTjmH0VYS1Jg6hiT7PFSSsc93GBF6JgATQxdE9izyH57UsyOf7-yR3F8WYVBi_JQkgogc7eVusxm5h6PCVvyIJ6LruLAOJfdSsbCatNBECORZVhby8"
  }
];

// Fallback images from code.html
const FALLBACK_THUMBS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAo_kONBapSdtdQXN1iLIqsgx81li30cgDA8cva9ckyj2KHwArvefh5AM2c3bwpoBQlq5TiztOFHXfRJZ7Z9yuvgCWM1R53ZwYQBJYUeLTqs6gBqbi7TGx4TGkxtwFjWjYUDq89Fnm6WgiUlSuxpXGF6YPAjHwJarKlVHWypZYySsUQ2puKX-OKbnf-JObiIhwJ6c1svFAvF3gVlucdV6Q5GEXRSeCRkaS_hSDDgRiKcHf44h-V1AbnpGvFaiB3t3HCMZPPpPFdvrSs",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCyKqrQDsfTBVnfdpYiJ9byCrZYFmQxDJpu21vwvmrTnUZ3lwn107dDmqbZ5eQKQI318xXxpgqDApPosbXxZ2ge_TR-JwK8stbnnntYh9pw-os5vagAqLGBa8bKQAvoWJUcmf3cK4V997P3E3oDH4nkvEMD1k9jdqn5wqmrCHSihwdpuiB2Ywt4oYYOI09CufqG1TBjHoV_RsLq9Mai8lsgNVSIgNIDFGuy36gRFAGuop-6mArpNaURIt861Z8s_8_xNM1BsMFKtVyi",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC3cxMdHKlvGIzLolFR5MWFHZ0fsWa5_jmD6MDohMGRVL6jBGfOLOa2iCxJPk4iW7RNOvmHiv7o7PPeg7ByBCehAGg8EHTT_0Ck90uiOfALAuoIbIPH7GvnqlUqcl_I9UGYoDo-R-uQLh5t1fM_CsDnAzgggAVKXiJtt0UAxbjnY-t74VThfKTfkoALjkDToiGSy6NYQvbRDnmZfuKVBMQ7SvW7DoQ5DbDNbbk9nww-XHCn1k6VfC2l5MppY4C_JwswZtm65mbEkQw1",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCpR7WJWn8YV2hKgLsOE9jR1ewYCFgDCq2x6ImGaa-6phRURMsh6eyDF3AQ_9wXsD9SXVyh2_Z5ucnTMZSIHuQQ_D-MKT36JhoaYRBVw1Q9jNIOrwyytLkwmKG5xEUJdLzxtrvUV4jNiQi2W4rBTyU4JRP8DgTZtSCcAIkS6Qon8VyY4yXpRNLsRBEyYp9Pwh7ZJKUB1nR4oWDrFA8W6LC3aajQjtdf0iQkcKuSG1p_GKu8szxpBxgfw89MbyH9GkR-c3e5Kaez78wj"
];

// Sibling Bundle accessories mapping
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
  const { products: storeProducts, addToCart, removeFromCart } = useStore();

  // Find product by id from static foods first (to match list page), then store products
  const product = useMemo(() => {
    let found = STATIC_FOOD_PRODUCTS.find((p) => p.id === productId);
    if (!found && storeProducts) {
      found = storeProducts.find((p) => p.id === productId);
    }
    if (!found) {
      // Return a mocked dynamic product if ID is still unresolved to prevent app crash
      found = {
        id: productId || "f1",
        name: "Artisan Wild Salmon & Kale Kibble",
        price: 64.99,
        mrp: 89.00,
        rating: 4.8,
        reviewsCount: 2451,
        category: "dogs",
        brand: "artPetShop Premium",
        badge: "Best Seller",
        description: "A premium grain-free formulation crafted with wild-caught Alaskan salmon, organic kale, and field garden greens.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRkBLEHOZuh9zXGy_XzLVVFMcMK5ZkTYnL8RaNKfOk3a7bkOw51Y9vWZy2XWpM-6cguY9xbM3gw3sMqTI-GjcnAXXjNaNclu2hIJyVZkOzRQd_m0gM0byGyup_XuOiITXI60Xl93n5Wz5lvDp3UDaB1Ai2l_JJD0Spilum3fKXrX-0aCjuOijByiZnGbmMB221lr78HEKheOKnoatEfDOg6YP_HwaK6O8rTOF7XXbtY0oflvjvts0g-T2G4kyPvwieDR73PP2d_ry9"
      };
    }
    return found;
  }, [productId, storeProducts]);

  // Gallery state
  const gallery = useMemo(() => {
    if (!product) return [];
    return [
      product.image,
      FALLBACK_THUMBS[0],
      FALLBACK_THUMBS[1],
      FALLBACK_THUMBS[2],
      FALLBACK_THUMBS[3]
    ];
  }, [product]);

  const [activeImage, setActiveImage] = useState("");

  // Sync active image with product change
  useEffect(() => {
    if (product?.image) {
      setActiveImage(product.image);
    }
  }, [product]);

  // Size selections
  const sizes = useMemo(() => {
    if (product.category === "dogs" || product.category === "cats") {
      return ["2kg", "12kg", "18kg"];
    }
    if (product.category === "pharmacy") {
      return ["100ml", "250ml", "500ml"];
    }
    return ["Small", "Medium", "Large"];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (sizes.length > 0) {
      setSelectedSize(sizes[1] || sizes[0]); // Default to middle size if possible
    }
  }, [sizes]);

  // Quantity State
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Tabs state
  const [activeTab, setActiveTab] = useState("Specifications");

  // Bundle selection checkboxes
  const [checkedBundleItems, setCheckedBundleItems] = useState({
    bundle_supp: true,
    bundle_bowl: true
  });

  const toggleBundleItem = (itemId) => {
    setCheckedBundleItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Bundle Total calculation
  const bundleTotal = useMemo(() => {
    let total = product.price;
    if (checkedBundleItems.bundle_supp) {
      total += BUNDLE_ITEMS[0].price;
    }
    if (checkedBundleItems.bundle_bowl) {
      total += BUNDLE_ITEMS[1].price;
    }
    return total;
  }, [product.price, checkedBundleItems]);

  // Cart operations feedback animations
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    // Add product multiple times based on selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCartSuccess(true);
    setTimeout(() => {
      setAddedToCartSuccess(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // In a full implementation this might route to /checkout immediately
  };

  // Frequently bought together bundle checkout
  const handleAddBundleToCart = () => {
    // 1. Add main product
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // 2. Add supplement if checked
    if (checkedBundleItems.bundle_supp) {
      addToCart({
        id: BUNDLE_ITEMS[0].id,
        name: BUNDLE_ITEMS[0].name,
        price: BUNDLE_ITEMS[0].price,
        image: BUNDLE_ITEMS[0].image,
        category: "pharmacy"
      });
    }
    // 3. Add bowl if checked
    if (checkedBundleItems.bundle_bowl) {
      addToCart({
        id: BUNDLE_ITEMS[1].id,
        name: BUNDLE_ITEMS[1].name,
        price: BUNDLE_ITEMS[1].price,
        image: BUNDLE_ITEMS[1].image,
        category: "dogs"
      });
    }

    setAddedToCartSuccess(true);
    setTimeout(() => {
      setAddedToCartSuccess(false);
    }, 2000);
  };

  return {
    product,
    gallery,
    activeImage,
    setActiveImage,
    sizes,
    selectedSize,
    setSelectedSize,
    quantity,
    incrementQuantity,
    decrementQuantity,
    activeTab,
    setActiveTab,
    checkedBundleItems,
    toggleBundleItem,
    bundleTotal,
    bundleItems: BUNDLE_ITEMS,
    handleAddToCart,
    handleBuyNow,
    handleAddBundleToCart,
    addedToCartSuccess,
    removeFromCart,
  };
}
