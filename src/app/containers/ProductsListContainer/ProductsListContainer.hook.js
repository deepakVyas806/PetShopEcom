import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";

// The 6 premium food products matching the Stitch design UI exactly.
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
    rating: 5,
    reviewsCount: 64,
    category: "dogs",
    brand: "Royal Canin",
    description: "Formulated with glucosamine and chondroitin for healthy joints in aging dogs.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlmodekjTA73VXLA_F4U2sPMsf7ENPLUjuD8RAz1mjw8OCm9bBduNKaGYMNbbxVfWysQ5bPXtRp6YtNrjafnWZRdetcNJDYBrxwqwrWxgD8Pb1Hu2jpRj6k_iyb9Hkh3jwG_SsYd9F2nvSRSk7Y3iWUbQMVNUTjmH0VYS1Jg6hiT7PFSSsc93GBF6JgATQxdE9izyH57UsyOf7-yR3F8WYVBi_JQkgogc7eVusxm5h6PCVvyIJ6LruLAOJfdSsbCatNBECORZVhby8"
  }
];

export default function useProductsList() {
  const searchParams = useSearchParams();
  const { addToCart } = useStore();

  const categoryParam = searchParams.get("category");
  const queryParam = searchParams.get("query");

  // Filter States
  const [selectedPetTypes, setSelectedPetTypes] = useState(["dogs"]);
  const [priceRange, setPriceRange] = useState(200); // in USD max
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(false);
  const [sortBy, setSortBy] = useState("Popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Layout / Interaction States
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [addedItems, setAddedItems] = useState({});

  // Sync state with URL parameters
  useEffect(() => {
    if (categoryParam) {
      if (categoryParam === "dogs") {
        setSelectedPetTypes(["dogs"]);
      } else if (categoryParam === "cats") {
        setSelectedPetTypes(["cats"]);
      } else if (categoryParam === "birds") {
        // map birds/fish/small_pets correctly
        setSelectedPetTypes(["birds"]);
      } else if (categoryParam === "fish") {
        setSelectedPetTypes(["fish"]);
      } else if (categoryParam === "small_pets") {
        setSelectedPetTypes(["small_pets"]);
      }
    }
  }, [categoryParam]);

  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    } else {
      setSearchQuery("");
    }
  }, [queryParam]);

  // Handler functions
  const handlePetTypeChange = (type) => {
    setSelectedPetTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...STATIC_FOOD_PRODUCTS];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // 2. Pet Type Filter
    if (selectedPetTypes.length > 0) {
      result = result.filter((p) => selectedPetTypes.includes(p.category));
    }

    // 3. Price Filter (in USD)
    result = result.filter((p) => p.price <= priceRange);

    // 4. Brands Filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // 5. Ratings Filter
    if (ratingFilter) {
      result = result.filter((p) => p.rating >= 4);
    }

    // Sort Logic
    if (sortBy === "Popularity") {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedPetTypes, priceRange, selectedBrands, ratingFilter, sortBy, searchQuery]);

  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
    selectedPetTypes,
    handlePetTypeChange,
    priceRange,
    setPriceRange,
    selectedBrands,
    handleBrandChange,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    favorites,
    toggleFavorite,
    addedItems,
    handleAddToCart
  };
}
