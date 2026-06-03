// ─── Static demo — swap with API call using order ID in production ─────────────
export const ORDER_STEPS = [
  { id: "confirmed",    label: "Confirmed",         icon: "check"          },
  { id: "processing",   label: "Processing",        icon: "inventory"      },
  { id: "shipped",      label: "Shipped",           icon: "local_shipping" },
  { id: "out_delivery", label: "Out for Delivery",  icon: "hail"           },
  { id: "delivered",    label: "Delivered",         icon: "home_pin"       },
];

// Map store trackingStatus → step index (0-based)
const STATUS_STEP = {
  "Order Confirmed": 0,
  "Shipped":         2,
  "Out for Delivery":3,
  "Delivered":       4,
};

const ORDER = {
  id:            "APS-9281",
  date:          "Oct 24, 2023",
  time:          "12:45 PM",
  status:        "Shipped",
  statusLabel:   "In Transit",
  trackingNote:  "Your package left the Chicago distribution center and is on its way to Pawsome City. Estimated arrival: Oct 27, 2023.",
  activeStep:    STATUS_STEP["Shipped"],

  items: [
    {
      id:            "i1",
      name:          "Artisan Wild Salmon Kibble - 5kg",
      qty:           1,
      price:         89.50,
      originalPrice: null,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLbuinTXWNbKxSkBegqoZIFwsjiDn1lcbsCNXJ2mMCOj6jVl_4Wr0TqC2C20g5e4YWdg2sP_igK0UUsim-v2dovo6l8ib2Eixcf5-H0_kfQn1AnpObPzIW9JhcNRZei2BuczK9IHZoWuNCn-yWJOSnuTA-1nmhSVlHzeAq5I8qOkrzpW50YNq87Dzh9CNa1NxdvnktRtRDLoFGbpk8-ETexbpGaDYjFqJdzfq2FnaCyGh28Du1KleUOtju2F1PkMrCPqCBa_Xl0sIH",
    },
    {
      id:            "i2",
      name:          "Organic Braided Tug Rope - Lavender",
      qty:           2,
      price:         35.00,
      originalPrice: 45.00,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmfbd5_WXmwZvIn6ZA6ZJlFFEcwkZgxPC9qtnKUDDkHbNFrIH9HhGV-pJ2AYfYhK405bX6pP6Oj8ny0RQQ9VtzgzChr_bAu5gdxrOgdyd38q2DActBQ4pDbpditjrr7_ZlWtyMCNffE1QH8hgfIlGa4Vfrb_d6Ela7P-kql3B5o1dNythW9ldidzIER8VpXfkilJEQ2jK62MG67JlS7fVbjU5Q9jb5PRnYH1wS-0gzGBdCz5PFH4f98HPWMGrLSaZHE3Zzamg_3HZY",
    },
  ],

  shipping: {
    address: "123 Pet Lane,\nPawsome City, PC 54321\nUnited States",
  },

  payment: {
    label: "Visa ending in 4242",
  },

  subtotal: 124.50,
  shippingCost: 0,
  tax: 0,
  total: 124.50,
};

export default function useOrderDetailContainer() {
  return { order: ORDER };
}
