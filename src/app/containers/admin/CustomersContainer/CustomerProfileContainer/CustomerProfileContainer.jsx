"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft, IconMail, IconPaw, IconBag, IconMoney,
  IconCalendar, IconVerified, IconCheck, IconPending, IconCancel,
} from "@/lib/icons";
import { fmt } from "@/lib/currency";
import { STATUS_STYLES } from "../data";

// ── Mock order generator (deterministic by customer id + index) ─────────────
const SERVICE_POOL = [
  "Premium Grooming", "Vet Consultation", "Dog Training Session",
  "Pet Boarding", "Spa & Relaxation", "Nail Trim & Paw Care",
  "Dental Cleaning", "Vaccination Package",
];
const AGO = ["2 weeks ago", "1 month ago", "2 months ago", "3 months ago", "4 months ago", "6 months ago"];
const ORDER_STATUS = ["completed", "completed", "completed", "pending", "cancelled"];

function buildOrders(customer) {
  const count = Math.min(customer.orders, 6);
  const base   = customer.id.charCodeAt(customer.id.length - 1);
  return Array.from({ length: count }, (_, i) => {
    const h = base + i;
    const perOrder = Math.round(customer.ltvRaw / customer.orders);
    const variance = Math.round(perOrder * (0.6 + (h % 9) * 0.08));
    return {
      id:      `ORD-${customer.id.slice(-3)}${String(i + 1).padStart(2, "0")}`,
      service: SERVICE_POOL[h % SERVICE_POOL.length],
      amount:  fmt(variance),
      date:    AGO[i % AGO.length],
      status:  ORDER_STATUS[i % ORDER_STATUS.length],
    };
  });
}

const ORDER_STATUS_STYLE = {
  completed: { icon: IconCheck,    bg: "bg-green-100",          text: "text-green-800",          label: "Completed" },
  pending:   { icon: IconPending,  bg: "bg-amber-100",          text: "text-amber-700",          label: "Pending"   },
  cancelled: { icon: IconCancel,   bg: "bg-error/10",           text: "text-error",              label: "Cancelled" },
};

function Avatar({ customer, size = "lg" }) {
  const sz  = size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm";
  if (customer.avatar) {
    return (
      <img
        src={customer.avatar}
        alt={customer.name}
        className={`${sz} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  const initials = customer.name
    .split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className={`${sz} rounded-full bg-primary-fixed/40 flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-primary">{initials}</span>
    </div>
  );
}

export default function CustomerProfileContainer({ customer }) {
  const router = useRouter();
  const orders = useMemo(() => buildOrders(customer), [customer]);
  const avgOrder = useMemo(
    () => fmt(Math.round(customer.ltvRaw / (customer.orders || 1))),
    [customer]
  );
  const status = STATUS_STYLES[customer.status] ?? STATUS_STYLES.inactive;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => router.push("/admin/customers")}
        className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <IconArrowLeft size={14} weight="bold" /> Back to Customers
      </button>

      {/* ── Hero card ── */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Coloured top bar matching status */}
        <div className={`h-1.5 ${customer.status === "vip" ? "bg-primary" : customer.status === "active" ? "bg-green-500" : "bg-outline-variant"}`} />
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar customer={customer} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-on-surface">{customer.name}</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                {status.label}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-0.5 flex items-center gap-1">
              <IconMail size={11} weight="regular" /> {customer.email}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 flex items-center gap-1">
              <IconCalendar size={11} weight="regular" /> Joined {customer.joinedAgo}
            </p>
            {customer.pets?.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <IconPaw size={11} className="text-primary" weight="fill" />
                {customer.pets.map((p) => (
                  <span key={p} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-semibold">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-on-surface-variant">Customer ID</p>
            <p className="text-xs font-mono font-bold text-on-surface mt-0.5">{customer.id}</p>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: IconBag,      label: "Total Orders",     value: customer.orders,   color: "text-primary",    bg: "bg-primary/10" },
          { icon: IconMoney,    label: "Lifetime Value",   value: customer.ltv,      color: "text-secondary",  bg: "bg-secondary/10" },
          { icon: IconVerified, label: "Avg Order Value",  value: avgOrder,          color: "text-tertiary",   bg: "bg-tertiary/10" },
          { icon: IconPaw,      label: "Pets Registered",  value: customer.pets?.length ?? 0, color: "text-error", bg: "bg-error/10" },
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

      {/* ── Order history ── */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/30">
          <h4 className="text-xs font-bold text-on-surface">Order History</h4>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Showing {orders.length} of {customer.orders} orders
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-outline-variant/30">
                {["Order ID", "Service", "Date", "Amount", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {orders.map((o) => {
                const s = ORDER_STATUS_STYLE[o.status] ?? ORDER_STATUS_STYLE.completed;
                const StatusIcon = s.icon;
                return (
                  <tr key={o.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-mono text-on-surface-variant">{o.id}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-on-surface">{o.service}</span>
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
      </div>
    </div>
  );
}
