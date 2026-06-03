import { useState } from "react";
import { useStore } from "@/context/StoreContext";

// ─── Static wishlist seed data ──────────────────────────────────────────────
const WISHLIST_SEED = [
  {
    id: "w1",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGJ2H1_GXX9Rx9NVZEOCBycDGS3GEyvr8mQWwPmadtcXCA0nxjiNkOOOHIJTVE2m_sOlLecMNRUSDXtpTZpt3MQO4VtyZuSspEspj-eiLc5-irhmnHFnkUxzqH9e8aMUqtDQVhyD13kK89iUrwuoXPmP65WF1nIthf3Cz001-_IdtZfrLpFPMMlGU09nMl2thonym-fF8N8HpZYHI83_Hnnz1gzX-wkebSRW98LOAvFq_fftAPIHVFM0QkXDF5W0kbWedWdqGcoXhI",
    category: "Dogs",
    type: "Accessories",
    name: "Luxury Leather Collar",
    price: 45.00,
    originalPrice: 59.00,
    badge: "priceDrop",
    stock: "inStock",
    itemType: "product",
  },
  {
    id: "w2",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZyJS3S-bh72OiipBliuQ3fEyfWM_smnfuAUsx08BkoCceOdxk4bO_ukx0qVgf4ct-tMzXHBY9YQ_Su6jkg6ncK4ZiO__ljySHNioe42wE-mQd_ktEUEI5qTsbmYpHIhHQbKzeR2hEq0b5768E1U7nuhfycm22TeQ_lRy1avNzQ_koga96ywut-GIq-N5Yib4alJ0UOZFV-XbUH758nXQPSBOxTbu1m4ThFAYACBAughobKqRizQ-ntNsPldHJGuMiGMPXUUGASO8R",
    category: "Cats",
    type: "Food",
    name: "Wild Salmon Kibble",
    price: 32.99,
    originalPrice: null,
    badge: null,
    stock: "lowStock",
    itemType: "product",
  },
  {
    id: "w3",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr2bkYe7LSwKMT3Leo54Sj2R-5aLRo-NBkJsghwj4Mx0431vsyHRn3IvHkVE32Nu68H9AhzRd6oxWym7tWowoi47CsMoRyfScDPdKtt-stL5HVmjR1UIbmsn8AT8wis5DhxXI0GotFK1P63VbesjfwJjhSO8cRqyCPziMG_9DfdbCNUVKNUp8M2dUMLiEOkGu6pXXS-YvSnKsWZT2L5DpdRyHmdR8eEg0n3AhthtLjkNBmm4FP5TMz1TyB9VlzvUsy31QZ-tKsYiOg",
    category: "Dogs",
    type: "Spa",
    name: "Full Grooming Package",
    price: 85.00,
    originalPrice: null,
    badge: "service",
    stock: "inStock",
    itemType: "service",
  },
  {
    id: "w4",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWN6ZxthwCYWBqMy6mhRlLQr86MZh5uNvkuY5mlf_qka4hNBRUetbODGooGtTLUv2gZbOmuX_giFOfxv9YGM2PIYCvNI3N4__lXBvRUzGgC2msRMNSdekFQXxruKprwywzA3QMrZsD3Q6cqLqP9vyMrNScJXqPWuIAdmvhq1UxO2mAoavMiGyMNSOZSx8ibJC3BsQii379t3b4tBb1wx-y64hm1_iGIcmtehY3uPg9lK4hHkAym78dg1QH0m0jxjZYe4VM9OPCkQkY",
    category: "Birds",
    type: "Habitat",
    name: "Modern Oak Birdhouse",
    price: 120.00,
    originalPrice: null,
    badge: null,
    stock: "outOfStock",
    itemType: "product",
  },
];

// ─── Recently viewed static data ─────────────────────────────────────────────
export const RECENTLY_VIEWED = [
  {
    id: "r1",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADFzDTpj3mC8bDDSia7N6ylwGCYjUd1J0Tm2yBBK4hscoYQmvzhWcSLwWo4Y3SEAG36tQs9VB7y8HhJ72ET_k-rFd4gb_AI4dHg4UCfJ-DwBgLKaO5HDXrqGC1ks2K2-vSAvCkbajlTkger_bY-c8XfMGK-SSkI5kxurSkeqrBG1NIhFi0c60ZrPHtXzoG2iXfsHQEOPYZ5FTX-Fi6opQ2Idr0MxWfBvyWOd0ztQMkV5vAkhHu6WiJd7ZwVdhRPZSHIw7LKsyf9QtS",
    name: "Catnip Veggie Set",
    price: 12.50,
  },
  {
    id: "r2",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFW1DS-ah0VIYO21_ADxoYU1hLC7PgTXqRjUs5rhOlXD9mVRa2Ym1pNjFHBp1qRQZSkyT2vOSpwV8Qm4PezLI9RekVVM-IBQskby8z5rpVB8YWffULOxmGAdjUL71pMd25KX_KKEvn9V38TJXOqOO014fIsa5Ql0IcLXh-4vSR9O6Y_BRROegRQ8PfhxzUHax6e2lo4mPxnWOOk0UalrFFRNfFDpimV7tvFgcGNJG36VeHRl1JEhtJretojfwaNdRgIkRWsSTUzrbP",
    name: "Smart Water Fountain",
    price: 89.00,
  },
  {
    id: "r3",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWMVV9GR8UeiHAsrljq586X4YE2nUGDcmnvp8nhX23IPFcPJgYf4V4NjrhtG7NPAKnrl27OdWS0Cq5H2UqoHtEj2bKMGjuK3ln9nZ4KnXY51VzTH-1lWkHB9FBh3PPuH-fGAG6VNzicEdp80yJ6LQqG6UcHVJn-_9hqAxxgWWRrIMQXnCHdotLUto6VyNS2ZFhDlF3h_mENrso6NYo5REoQduHk-zbnIqhRluvk5oLn48wj66vKRdEaAHDPgT_QTkW2gaH101",
    name: "Memory Foam Oasis",
    price: 156.00,
  },
  {
    id: "r4",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBo0VaFSPrlqzO7goEeCqfsjKMZmZDUjLJ-GSDz1a272gizv8ZIYRVkzjjibG0itIMv8uGBjdUVAzlKJz6QvWgZZZJ2rRZf2zwqlRIpmWlCEHJ_hgLhbjtVD9p3yXb2-E0ifVv1k-ew3uXMqy53hBq1DHuF2frjEJ-HuNyCX2gTQNxnDeXnlC5saTTZIjm1Pe_11tbbNwu4ZZSMUui9tSU0KvcWEvFN93UWLxxY3EOxQLnZHGNoIPbPoKTzOjfXOZZP6KRkN7RQs-mr",
    name: "Exotic Play Set",
    price: 24.99,
  },
  {
    id: "r5",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbb-Nkz51lQTuuvvNzsRUW4cMwd61U8cV7bKmtlD4BOpAzbWWEETil3dSCpyMQ6u6gMyE9uQ9pu_nJ5ZY3TvPLdLrwNYal0tbKtcajJBxMdoo7B_aNeM0AXkdtu61TRn768E5y38h4pDWVIUQUOmmqIy-CPbQBqHJ2DLPaUnJCojOkhUhmoUJhQDl6lZbGxjkPG6sZSvA76lVMoZquCr9mu5rBdk5iciSsLpvU4OD1On_dikIJGdqIERS03_3j_ipn-tTmKQZLm",
    name: "Gourmet Treat Box",
    price: 35.00,
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
export default function useWishlistContainer() {
  const { addToCart } = useStore();

  const [wishlistItems, setWishlistItems] = useState(WISHLIST_SEED);
  // IDs currently playing the "added" → remove animation
  const [movingIds, setMovingIds] = useState(new Set());

  const removeFromWishlist = (id) =>
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));

  const moveToCart = (item) => {
    if (item.stock === "outOfStock" || item.itemType === "service") return;
    setMovingIds((prev) => new Set([...prev, item.id]));
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
    // Remove card after animation completes
    setTimeout(() => {
      removeFromWishlist(item.id);
      setMovingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 900);
  };

  const addAllToCart = () => {
    const addable = wishlistItems.filter(
      (item) => item.itemType === "product" && item.stock !== "outOfStock"
    );
    addable.forEach((item) =>
      addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })
    );
    setWishlistItems((prev) =>
      prev.filter((item) => item.stock === "outOfStock" || item.itemType === "service")
    );
  };

  return {
    wishlistItems,
    movingIds,
    recentlyViewed: RECENTLY_VIEWED,
    removeFromWishlist,
    moveToCart,
    addAllToCart,
  };
}
