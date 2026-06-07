/**
 * Static dashboard data — lives outside components so it is NEVER
 * recreated on re-render. Replace with API calls when backend is ready.
 */
import { fmt } from "@/lib/currency";
import {
  IconMoney, IconBag, IconUser, IconPackage,
  IconGroom, IconTag, IconCart, IconCalendar,
} from "@/lib/icons";

export const STAT_CARDS = [
  { icon: IconMoney,   iconBg: "bg-primary/10",   iconColor: "text-primary",           stripe: "bg-primary",    label: "Total Revenue", value: fmt(128430), sub: "+12% this month",    subColor: "text-emerald-600" },
  { icon: IconBag,     iconBg: "bg-secondary/10", iconColor: "text-secondary",         stripe: "bg-secondary",  label: "Orders",        value: "1,420",     sub: "+8.2% this month",   subColor: "text-emerald-600" },
  { icon: IconUser,    iconBg: "bg-tertiary/10",  iconColor: "text-tertiary",          stripe: "bg-tertiary",   label: "Customers",     value: "8,942",     sub: "New members joined", subColor: "text-on-surface-variant/60" },
  { icon: IconPackage, iconBg: "bg-amber-50",     iconColor: "text-amber-500",         stripe: "bg-amber-400",  label: "Products",      value: "312",       sub: "In catalogue",       subColor: "text-on-surface-variant/60" },
  { icon: IconGroom,   iconBg: "bg-secondary/10", iconColor: "text-secondary",         stripe: "bg-secondary",  label: "Services",      value: "24",        sub: "Available now",      subColor: "text-on-surface-variant/60" },
  { icon: IconTag,     iconBg: "bg-error/10",     iconColor: "text-error",             stripe: "bg-error",      label: "Coupons",       value: "15",        sub: "Active promotions",  subColor: "text-on-surface-variant/60" },
];

export const REVENUE_MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const REVENUE_HEIGHTS = [40, 55, 45, 70, 60, 85, 75, 95, 80, 90, 100, 85];

export const SALES_CATEGORIES = [
  { label: "Pet Food",     pct: 64, color: "bg-primary"   },
  { label: "Toys & Accs", pct: 22, color: "bg-tertiary"   },
  { label: "Grooming",    pct: 14, color: "bg-secondary"  },
];

export const RECENT_ACTIVITIES = [
  {
    icon: IconCart,     iconBg: "bg-primary/10",   iconColor: "text-primary",
    title: "New Order #8429",    sub: "Premium Cat Tree by Sarah Jenkins",       meta: fmt(18900), time: "2 mins ago",
  },
  {
    icon: IconUser,     iconBg: "bg-tertiary/10",  iconColor: "text-tertiary",
    title: "New Registration",   sub: "Michael Chen joined as a Gold Member",    meta: null,       time: "15 mins ago",
  },
  {
    icon: IconCalendar, iconBg: "bg-secondary/10", iconColor: "text-secondary",
    title: "Booking Confirmed",  sub: "Dog Grooming appointment for 'Buddy'",    meta: null,       time: "45 mins ago",
  },
];

export const BEST_SELLER = {
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgnWx38Wp-_0yw5ZH09IvYSGxP5_GvdzbBJxoHn0-Z2PZpnJZGAOzilCwXPp6piREf7fbMqyvGC5STVVakAXjwVaaNVtyMQMFPvgg8JLlPlSbTMp0-XFOFMktxTADLfbcV12X4-wO_bT0ngx4xfa5chEWSu11tnDAF2rq90AsU2qLBEx-oTdfWyMDaJulC3sjDKscYETt0e8QzNe92_slIK3bMIVy0oPHPjtQgCvcg8a5sdgcYsiehrzgQab2UC8FUReHpQCzJrAxr",
  name:    "Luxury Dog Bedding",
  revenue: fmt(14200),
};
