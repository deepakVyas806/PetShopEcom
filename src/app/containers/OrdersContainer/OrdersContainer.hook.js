import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

// ─── Mock orders (replace with API call in production) ────────────────────────
const MOCK_ORDERS = [
  {
    id:     "APS-9281",
    date:   "Oct 24, 2023",
    status: "Shipped",
    total:  124.50,
    items: [
      {
        id:      "i1",
        name:    "ErgoComfort Pro Harness",
        variant: "Size: Large • Color: Royal Purple",
        qty:     1,
        price:   45.00,
        image:   "https://lh3.googleusercontent.com/aida-public/AB6AXuD9m136IRIDRHJ6ZPAuF-YQ3D3ufijZJBY9yptZsSHg3MvRMfTqKA_xYKGzrYZPJTu4YEkWUM_K0-UlS-U_vy9LR-efYSDgg-XoSr53AdBg76-PpPrCdbs56kQZt-lx3FFLCIvb0ATO7WyJPbsTl4XMfuojJbZNMURjc18sgBAnGM1vZ03FmTvvbhkDCZ09U9LCpap01QN9dyBPOQlHmHMbZ3vkesuARakP02JchHLvjX_XGmCvQiBiFs0iH3NH1ppfOIGPMLRj9cFW",
      },
      {
        id:      "i2",
        name:    "Grain-Free Salmon Bites (500g)",
        variant: "Organic • High Protein",
        qty:     2,
        price:   39.75,
        image:   "https://lh3.googleusercontent.com/aida-public/AB6AXuDb32NIPxKS-ARTSOb1b8qE8_gyfNJ7B2hUtVget5iFDyir7apHYleZx7rrJJQpnKygNW5DCTkbyMzWfwRuSZzD-qSvwHHkhkGlAhsccw0jWC1TFydxZ8NuFNR3mQdIh9-uA-WgddSFKIHberpy02LQneUotIkZw6_egyh45ZsXb-2HZGsRiADKsGUOS6kLfueXCctf27waF77A9Sf-TTcxlbxvOJxsMsNtsMoMU1GbhTtchxpYzh5RiXyRS05QsdET2oltGne8Up-f",
      },
    ],
  },
  {
    id:     "APS-8824",
    date:   "Oct 12, 2023",
    status: "Delivered",
    total:  89.90,
    items: [
      {
        id:      "i3",
        name:    "Luxury OrthoCloud Pet Bed",
        variant: "Size: Medium • Memory Foam",
        qty:     1,
        price:   89.90,
        image:   "https://lh3.googleusercontent.com/aida-public/AB6AXuD1iKVV5AIjAmmdv8_yh0_LKzY0ZOWNT5olVISienzq_2D9vf7H3sffiS9vnaC_VEOXbm7sX1a-LD8Ff6eyXBuD9fzWtszdcltjbd3fUCiwEiJdg_R8NBer1LukVDzgiRrXrIjhkpPuSlTMnDF-n77T-FRnITAM4BWklwk5ROLwruFHCQqZMDj5lSM08c8_5yTQIE7iz681MGdXU0rg-yrbLZ1GyNVzh01eNlc0fLgIFnN9DAMG5gfKhrE-6ItA-gDkq6M4eSgQgu7F",
      },
    ],
  },
  {
    id:     "APS-9400",
    date:   "Oct 28, 2023",
    status: "Order Confirmed",
    total:  34.00,
    items:  [],
  },
];

export default function useOrdersContainer() {
  const { logout } = useAuth();

  const [searchQuery,    setSearchQuery]    = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_ORDERS;
    const q = searchQuery.toLowerCase();
    return MOCK_ORDERS.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const toggleExpand = (id) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return {
    filteredOrders,
    searchQuery,
    setSearchQuery,
    expandedOrders,
    toggleExpand,
    logout,
  };
}
