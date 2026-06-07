import { fmt } from "@/lib/currency";

export const COUPONS = [
  {
    id: "CPN-001",
    name: "Paw-some Summer Sale",
    code: "PAW-SOME-SUMMER",
    description: "20% off all dog toys",
    discountType: "percent",
    value: 20,
    minOrderRaw: 500,
    usageCount: 1240,
    usageLimit: 5000,
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    status: "active",
    revenueRaw: 842050,
  },
  {
    id: "CPN-002",
    name: "New Friend Welcome",
    code: "NEW-FRIEND-15",
    description: "15% off first purchase",
    discountType: "percent",
    value: 15,
    minOrderRaw: 0,
    usageCount: 4892,
    usageLimit: 0,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "active",
    revenueRaw: 2215000,
  },
  {
    id: "CPN-003",
    name: "Flash Friday",
    code: "FLASH-FRIDAY",
    description: "Buy 1 Get 1 on all treats",
    discountType: "bogo",
    value: 0,
    minOrderRaw: 300,
    usageCount: 0,
    usageLimit: 1000,
    startDate: "2026-07-04",
    endDate: "2026-07-04",
    status: "scheduled",
    revenueRaw: 0,
  },
  {
    id: "CPN-004",
    name: "Vet Visit Special",
    code: "VET-VISIT-10",
    description: "10% off medical cat food",
    discountType: "percent",
    value: 10,
    minOrderRaw: 800,
    usageCount: 854,
    usageLimit: 2000,
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    status: "active",
    revenueRaw: 412000,
  },
  {
    id: "CPN-005",
    name: "Summer Groom Deal",
    code: "SUMMER-GROOM",
    description: "₹200 off grooming sessions",
    discountType: "fixed",
    value: 200,
    minOrderRaw: 1000,
    usageCount: 320,
    usageLimit: 500,
    startDate: "2026-06-15",
    endDate: "2026-08-15",
    status: "active",
    revenueRaw: 64000,
  },
  {
    id: "CPN-006",
    name: "Birthday Bonanza",
    code: "PET-BIRTHDAY",
    description: "25% birthday special for pets",
    discountType: "percent",
    value: 25,
    minOrderRaw: 600,
    usageCount: 450,
    usageLimit: 1000,
    startDate: "2026-04-01",
    endDate: "2026-05-31",
    status: "paused",
    revenueRaw: 112500,
  },
  {
    id: "CPN-007",
    name: "Loyalty Gold Reward",
    code: "LOYALTY-GOLD",
    description: "30% off for VIP members",
    discountType: "percent",
    value: 30,
    minOrderRaw: 1500,
    usageCount: 280,
    usageLimit: 300,
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    status: "active",
    revenueRaw: 84000,
  },
  {
    id: "CPN-008",
    name: "Winter Warmth Ship",
    code: "WINTER-WARM",
    description: "Free shipping on all orders",
    discountType: "freeship",
    value: 0,
    minOrderRaw: 400,
    usageCount: 2100,
    usageLimit: 0,
    startDate: "2025-12-01",
    endDate: "2026-01-31",
    status: "expired",
    revenueRaw: 0,
  },
];

export const LIVE_ACTIVITY = [
  { coupon: "PAW-SOME-SUMMER", customer: "Sarah Jenkins",  timeAgo: "Just now",     dot: "bg-green-500" },
  { coupon: "NEW-FRIEND-15",   customer: "David Chen",     timeAgo: "4 mins ago",   dot: "bg-primary"   },
  { coupon: "PAW-SOME-SUMMER", customer: "Mike Ross",      timeAgo: "12 mins ago",  dot: "bg-primary"   },
  { coupon: "LOYALTY-GOLD",    customer: "Priya Patel",    timeAgo: "18 mins ago",  dot: "bg-tertiary"  },
  { coupon: "VET-VISIT-10",    customer: "Tom Anderson",   timeAgo: "31 mins ago",  dot: "bg-secondary" },
];

export const CAMPAIGN_HERO = {
  name: "Holiday Pet Pamper",
  description: "Top-performing campaign — in the top 5% of all-time offers.",
  convRate: "8.4%",
  shares: "2.1k",
  roas: fmt(1200000),
};

export const STATUS_META = {
  active:    { label: "Active",    bg: "bg-green-100", text: "text-green-800", border: "border-green-200"     },
  scheduled: { label: "Scheduled", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200"     },
  paused:    { label: "Paused",    bg: "bg-orange-100",text: "text-orange-700",border: "border-orange-200"    },
  expired:   { label: "Expired",   bg: "bg-surface-container-high", text: "text-on-surface-variant", border: "border-outline-variant" },
};

export function discountLabel(c) {
  if (c.discountType === "percent")  return `${c.value}% off`;
  if (c.discountType === "fixed")    return `${fmt(c.value)} off`;
  if (c.discountType === "freeship") return "Free Shipping";
  if (c.discountType === "bogo")     return "Buy 1 Get 1";
  return String(c.value);
}

// Module-level counter for new coupon IDs
let _cid = 100;
export function nextCouponId() { return `CPN-${String(++_cid).padStart(3, "0")}`; }
