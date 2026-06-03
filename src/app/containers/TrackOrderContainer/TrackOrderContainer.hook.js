// Static demo order — swap with real API call when backend is ready
export const ORDER = {
  id:             "APS-99283471",
  date:           "October 24, 2023",
  status:         "In Transit",
  carrier:        "PetExpress Logistics",
  trackingNumber: "PEX-8821-X921",

  address: {
    name:    "Alex Thompson",
    line1:   "1242 Whispering Pines Drive",
    line2:   "Suite 405, Petaluma, CA 94952",
    country: "United States",
    phone:   "+1 (555) 012-3456",
  },

  milestones: [
    {
      id:       "placed",
      label:    "Order Placed",
      detail:   "Oct 24, 10:30 AM • We've received your order.",
      status:   "done",
      icon:     "check",
      iconFill: true,
    },
    {
      id:       "processing",
      label:    "Processing",
      detail:   "Oct 24, 02:15 PM • Your items are being prepared.",
      status:   "done",
      icon:     "check",
      iconFill: true,
    },
    {
      id:       "packed",
      label:    "Packed",
      detail:   "Oct 25, 09:00 AM • Quality check complete and packed.",
      status:   "done",
      icon:     "check",
      iconFill: true,
    },
    {
      id:       "shipped",
      label:    "Shipped",
      detail:   "Oct 25, 04:30 PM • Package left the fulfillment center.",
      status:   "active",
      icon:     "local_shipping",
      iconFill: false,
    },
    {
      id:       "out_for_delivery",
      label:    "Out for Delivery",
      detail:   "Expected Oct 27, Morning",
      status:   "pending",
      icon:     "near_me",
      iconFill: false,
    },
    {
      id:       "delivered",
      label:    "Delivered",
      detail:   "Final destination reached",
      status:   "pending",
      icon:     "inventory_2",
      iconFill: false,
    },
  ],

  items: [
    {
      id:      "i1",
      name:    "Artisanal Braided Leash",
      variant: "Size: Large • Color: Mahogany",
      price:   45.00,
      qty:     1,
      image:   "https://lh3.googleusercontent.com/aida-public/AB6AXuAeefWzv5hBzvWl29QbNTpT1yYAUF5bhKuq7d7_8vXtNUkQXIG-_L353vzH7bo5hfHUAw-JHtgU8Crw0VeyjcY_7T6rvuF_wIiABC9w3YQLpSFcE7tt_vfi3eDbFQpjGmPKWuAGLKLJO0Wt35-mRr3h_RnOnd9zUMB-NazSK-IMas4hBbcEK8tc_PQdKFZFVBEgUhpz24nb8QDSWDpZ9krUAWpHKNsMv_a0heff9DTukf5TH3uK_ZsQLPgVnhKCIiOiUv2zNHIVWqXd",
    },
    {
      id:      "i2",
      name:    "Organic Gourmet Kibble",
      variant: "Weight: 12lb • Grain-Free",
      price:   68.50,
      qty:     1,
      image:   "https://lh3.googleusercontent.com/aida-public/AB6AXuCiM-vTD2xUP3EEMDJS00a_NsX9i9DnnSINB9gDuzFv53TroyiNRFu0e6MH1KPRu-Iop_WTbGGmj2bCd6cqtEXZ32Xo4CIdrUKYiJHsJwKPHElq38BBE482CfLLrez2T0WINOCX-9yMjsCIh36FIuGN2qUwhtZVmH1oaXStUFClkhawVHngF7hwYz6h5M3kNfaOk92mv-1rkCqWYtlloiz4FIYVyLuPUO9vGFFM_rsAmml7Y7sD6_OUWVpl5wui9WhKKulQedgKsVJw",
    },
  ],

  subtotal: 113.50,
  shipping: 0,
  total:    113.50,

  driver: {
    name:     "Mateo R.",
    distance: "5 miles away",
    heading:  "Heading North",
  },
};

export default function useTrackOrderContainer() {
  return { order: ORDER };
}
