"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { fmt } from "@/lib/currency";
import {
  IconArrowLeft, IconMail, IconPaw, IconBag, IconMoney,
  IconCalendar, IconVerified, IconCheck, IconPending, IconCancel,
} from "@/lib/icons";
import { STATUS_STYLES } from "../data";
import { Sk } from "@/components/ui";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtJoined(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

function timeAgo(d) {
  if (!d) return "—";
  const ms   = Date.now() - new Date(d).getTime();
  const days = Math.floor(ms / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
}

function mapOrder(o) {
  const firstItem = Array.isArray(o.items) && o.items[0];
  return {
    id:     `#${String(o._id).slice(-6).toUpperCase()}`,
    name:   firstItem?.name ?? firstItem?.productName ?? "Order",
    amount: fmt(o.total ?? 0),
    date:   timeAgo(o.createdAt),
    status: o.status ?? "pending",
    count:  Array.isArray(o.items) ? o.items.length : 0,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

const ORDER_STATUS_STYLE = {
  completed:  { icon: IconCheck,   bg: "bg-green-100",  text: "text-green-800",  label: "Completed"  },
  delivered:  { icon: IconCheck,   bg: "bg-green-100",  text: "text-green-800",  label: "Delivered"  },
  pending:    { icon: IconPending, bg: "bg-amber-100",  text: "text-amber-700",  label: "Pending"    },
  processing: { icon: IconPending, bg: "bg-amber-100",  text: "text-amber-700",  label: "Processing" },
  cancelled:  { icon: IconCancel,  bg: "bg-error/10",   text: "text-error",      label: "Cancelled"  },
};

function Avatar({ name, avatar, size = "lg" }) {
  const sz = size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm";
  if (avatar) {
    return (
      <img src={avatar} alt={name}
        className={`${sz} rounded-full object-cover flex-shrink-0`} />
    );
  }
  const initials = (name ?? "?")
    .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className={`${sz} rounded-full bg-primary-fixed/40 flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-primary">{initials}</span>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 flex gap-5">
        <Sk w="w-16" h="h-16" rounded="rounded-full" />
        <div className="flex-1 space-y-2">
          <Sk w="w-40" h="h-4" rounded="rounded-lg" />
          <Sk w="w-56" h="h-3" rounded="rounded-lg" />
          <Sk w="w-32" h="h-3" rounded="rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 space-y-3">
            <Sk w="w-9" h="h-9" rounded="rounded-xl" />
            <Sk w="w-16" h="h-4" rounded="rounded-lg" />
            <Sk w="w-24" h="h-3" rounded="rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CustomerProfileContainer({ id }) {
  const router = useRouter();

  const [customer, setCustomer] = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [ltv,      setLtv]      = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/customers/${id}`);
      setCustomer(data.customer);
      setOrders((data.orders ?? []).map(mapOrder));
      setLtv(data.ltv ?? 0);
    } catch (e) {
      if (e?.statusCode === 404 || e?.message?.includes("404")) {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <ProfileSkeleton />;

  if (notFound || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-sm font-bold text-on-surface">Customer not found</p>
        <button
          type="button"
          onClick={() => router.push("/admin/customers")}
          className="text-xs text-primary font-semibold hover:underline cursor-pointer"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const avgOrder = ltv > 0 ? fmt(Math.round(ltv / (orders.length || 1))) : "—";
  const status   = STATUS_STYLES[customer.status ?? "active"] ?? STATUS_STYLES.active;
  const pets     = customer.petPrefs ?? [];

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.push("/admin/customers")}
        className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <IconArrowLeft size={14} weight="bold" /> Back to Customers
      </button>

      {/* Hero card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className={`h-1.5 ${
          customer.status === "vip"    ? "bg-primary"
          : customer.status === "active" ? "bg-green-500"
          : "bg-outline-variant"
        }`} />
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar name={customer.name} avatar={customer.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-on-surface">{customer.name}</h2>
              {status && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                  {status.label}
                </span>
              )}
            </div>
            <p className="text-[10px] text-on-surface-variant mt-0.5 flex items-center gap-1">
              <IconMail size={11} /> {customer.email}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 flex items-center gap-1">
              <IconCalendar size={11} /> Joined {fmtJoined(customer.createdAt)}
            </p>
            {pets.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <IconPaw size={11} className="text-primary" weight="fill" />
                {pets.map((p) => (
                  <span key={p} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-semibold">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-on-surface-variant">Customer ID</p>
            <p className="text-xs font-mono font-bold text-on-surface mt-0.5">
              {String(customer._id).slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: IconBag,      label: "Total Orders",    value: orders.length,     color: "text-primary",   bg: "bg-primary/10"   },
          { icon: IconMoney,    label: "Lifetime Value",  value: fmt(ltv),          color: "text-secondary", bg: "bg-secondary/10" },
          { icon: IconVerified, label: "Avg Order Value", value: avgOrder,          color: "text-tertiary",  bg: "bg-tertiary/10"  },
          { icon: IconPaw,      label: "Pets Registered", value: pets.length,       color: "text-error",     bg: "bg-error/10"     },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={18} weight="bold" className={color} />
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface">{value}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order history */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30">
          <h4 className="text-xs font-bold text-on-surface">Order History</h4>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            {orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? "s" : ""} found` : "No orders yet"}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <IconBag size={28} className="text-on-surface-variant/30" weight="thin" />
            <p className="text-xs font-semibold text-on-surface-variant">No orders placed yet</p>
            <p className="text-[10px] text-on-surface-variant/60">Orders will appear here once placed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  {["Order ID", "Item(s)", "Date", "Amount", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {orders.map((o) => {
                  const s = ORDER_STATUS_STYLE[o.status] ?? ORDER_STATUS_STYLE.pending;
                  const StatusIcon = s.icon;
                  return (
                    <tr key={o.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-[10px] font-mono text-on-surface-variant">{o.id}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-on-surface">{o.name}</span>
                        {o.count > 1 && (
                          <span className="ml-1 text-[10px] text-on-surface-variant">+{o.count - 1} more</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[10px] text-on-surface-variant">{o.date}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-bold text-on-surface">{o.amount}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
                          <StatusIcon size={9} weight="bold" /> {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
