import { useState, useMemo } from "react";

const INITIAL = [
  {
    id:       "n1",
    type:     "order",
    icon:     "local_shipping",
    iconBg:   "bg-primary-fixed",
    iconColor:"text-primary",
    title:    "Order #APS-123 is out for delivery",
    body:     "Your gourmet pet treats and ergonomic dog bed are with the courier. Estimated arrival: 2:00 PM – 4:00 PM today.",
    time:     "2 hours ago",
    read:     false,
    actions:  [
      { label: "View Order",    variant: "primary",   href: "/order-detail" },
      { label: "Track Courier", variant: "secondary", href: "/track-order"  },
    ],
  },
  {
    id:       "n2",
    type:     "promo",
    icon:     "sell",
    iconBg:   "bg-tertiary-fixed",
    iconColor:"text-tertiary",
    title:    "Exclusive 20% Discount for Buddy!",
    body:     "It's Buddy's birthday month! Use code PAWTY20 at checkout for 20% off all grooming services and toys.",
    highlight:"PAWTY20",
    time:     "5 hours ago",
    read:     false,
    actions:  [
      { label: "Claim Discount",  variant: "primary",   href: "/marketplace" },
      { label: "Save for Later",  variant: "secondary", href: "#"             },
    ],
  },
  {
    id:       "n3",
    type:     "account",
    icon:     "security",
    iconBg:   "bg-surface-container",
    iconColor:"text-on-surface-variant",
    title:    "Password changed successfully",
    body:     "Your account security was updated. If you didn't perform this action, please contact support immediately.",
    time:     "Yesterday",
    read:     true,
    actions:  [],
  },
  {
    id:       "n4",
    type:     "order",
    icon:     "inventory_2",
    iconBg:   "bg-surface-container",
    iconColor:"text-on-surface-variant",
    title:    "Item back in stock: 'Salmon Bites'",
    body:     "One of your wishlist items is back in stock. Grab it before it's gone again!",
    time:     "2 days ago",
    read:     true,
    actions:  [
      { label: "View Item", variant: "secondary", href: "/wishlist" },
    ],
  },
];

const FILTER_MAP = {
  all:        () => true,
  orders:     (n) => n.type === "order",
  promotions: (n) => n.type === "promo",
  account:    (n) => n.type === "account",
};

export default function useNotificationsContainer() {
  const [notifications, setNotifications] = useState(INITIAL);
  const [activeFilter,  setActiveFilter]  = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(
    () => notifications.filter(FILTER_MAP[activeFilter] ?? (() => true)),
    [notifications, activeFilter]
  );

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return { filtered, unreadCount, activeFilter, setActiveFilter, markRead, markAllRead };
}
