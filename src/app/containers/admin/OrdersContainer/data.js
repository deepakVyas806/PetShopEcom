import { fmt } from "@/lib/currency";

export const ORDERS = [
  {
    id: "#ORD-2024-8932", customer: "Sarah Miller",  initials: "SM", avatarBg: "bg-tertiary-container",   avatarFg: "text-on-tertiary-container",        email: "sarah.m@example.com",  date: "Oct 24, 2023", amount: fmt(12450), status: "Delivered",  avatar: null,
  },
  {
    id: "#ORD-2024-8941", customer: "James Haddon",  initials: "JH", avatarBg: "bg-secondary-container",  avatarFg: "text-on-secondary-container",       email: "james@mail.net",       date: "Oct 25, 2023", amount: fmt(8900),  status: "Shipped",   avatar: null,
  },
  {
    id: "#ORD-2024-8950", customer: "Anna Lee",      initials: "AL", avatarBg: "bg-primary-fixed",        avatarFg: "text-on-primary-fixed",             email: "anna_lee@shop.com",    date: "Oct 25, 2023", amount: fmt(21025), status: "Pending",   avatar: null,
  },
  {
    id: "#ORD-2024-8955", customer: "Robert Chen",   initials: "RC", avatarBg: "bg-surface-container",    avatarFg: "text-on-surface-variant",           email: "robert.c@domain.io",   date: "Oct 26, 2023", amount: fmt(4599),  status: "Cancelled", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAygSq320r7e_Ox5GGQ49VjA8A334l8vrHq38Fw9O5pzvqYih71Vmz5gLHvmxWx7PR9NL9cKX35idlp_YJRM8yuHdavXG6RiB9kFjM4mWok00DhC-uqHbewH4LdJi75hdrA0PYq1i3-Bcch9st5V1owNOOV2JDhYEosKn1OxcC1DCAQ-xbt5I9iCqxoXVFHAWtNQuaHG42U6aLx32C3X0kPmUbzvD_4St-zR3PJbp_XsPcFEb-Yc17_W-4b_y60QBlqGjmpFqhykUG",
  },
  {
    id: "#ORD-2024-8962", customer: "Kelly Foster",  initials: "KF", avatarBg: "bg-tertiary-fixed-dim",   avatarFg: "text-on-tertiary-fixed-variant",    email: "kelly.f@provider.com", date: "Oct 26, 2023", amount: fmt(34210), status: "Processing", avatar: null,
  },
  {
    id: "#ORD-2024-8968", customer: "Tom Green",     initials: "TG", avatarBg: "bg-secondary-fixed-dim",  avatarFg: "text-on-secondary-fixed-variant",   email: "tommy@green.co",       date: "Oct 27, 2023", amount: fmt(1250),  status: "Refunded",  avatar: null,
  },
];

export const DATE_OPTIONS   = ["Last 30 Days", "Last 7 Days", "This Quarter", "Custom Range"];
export const STATUS_OPTIONS = ["All Statuses", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];

/** Status → Tailwind classes for the admin order badge */
export const STATUS_STYLES = {
  Delivered:  { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  },
  Shipped:    { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
  Pending:    { bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
  Cancelled:  { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
  Processing: { bg: "bg-primary/10", text: "text-primary",    dot: "bg-primary animate-pulse" },
  Refunded:   { bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400"   },
  Confirmed:  { bg: "bg-green-50",   text: "text-green-600",  dot: "bg-green-400"  },
};

export const MOCK_ORDER_ITEMS = [
  { name: "Royal Canin Adult Dog Food 10kg", sku: "RC-DOG-10KG", qty: 2, unitPrice: fmt(3499) },
  { name: "Premium Pet Grooming Kit",        sku: "GRM-KIT-01",  qty: 1, unitPrice: fmt(2999) },
  { name: "Orthopedic Memory Foam Pet Bed",  sku: "BED-ORTH-L",  qty: 1, unitPrice: fmt(5999) },
];

export const STATUS_FLOW = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
