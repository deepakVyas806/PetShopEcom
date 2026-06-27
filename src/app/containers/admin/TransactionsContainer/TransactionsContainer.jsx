"use client";
import { useState, useCallback, useEffect } from "react";
import { api, qs } from "@/lib/api";
import { fmt } from "@/lib/currency";
import { IconReceipt, IconSearch, IconWallet, IconTag } from "@/lib/icons";

// ── Status badge ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  success:  { bg: "bg-green-100",   text: "text-green-700",  dot: "bg-green-500"  },
  pending:  { bg: "bg-amber-100",   text: "text-amber-700",  dot: "bg-amber-500"  },
  refunded: { bg: "bg-blue-100",    text: "text-blue-700",   dot: "bg-blue-500"   },
  failed:   { bg: "bg-red-100",     text: "text-red-700",    dot: "bg-red-500"    },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const METHOD_LABEL = {
  cod:        "Cash on Delivery",
  card:       "Card",
  upi:        "UPI",
  netbanking: "Net Banking",
  wallet:     "Wallet",
};

function methodLabel(m) {
  return METHOD_LABEL[m?.toLowerCase()] ?? m ?? "—";
}

// ── Summary card ────────────────────────────────────────────────────────────────
function SummaryCard({ label, value, sub, accent }) {
  return (
    <div className={`px-4 py-3 rounded-xl border shadow-sm flex items-center gap-3 ${accent}`}>
      <div>
        <p className="text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant">{label}</p>
        <p className="text-sm font-bold text-on-surface mt-0.5">{value}</p>
        {sub && <p className="text-[10px] text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main container ───────────────────────────────────────────────────────────────
export default function TransactionsContainer() {
  const [transactions, setTransactions] = useState([]);
  const [summary,      setSummary]      = useState(null);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);

  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("all");
  const [method,  setMethod]  = useState("all");
  const [page,    setPage]    = useState(1);
  const perPage = 20;

  const selectCls = "bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2.5 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer";

  const fetchTxns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/transactions${qs({ page, limit: perPage, search: search || undefined, status, method })}`);
      setTransactions(data.transactions ?? []);
      setSummary(data.summary ?? null);
      setTotal(data.total ?? 0);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, method]);

  useEffect(() => { fetchTxns(); }, [fetchTxns]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div className="space-y-4">

      {/* Summary strip */}
      {summary && (
        <div className="flex flex-wrap gap-3">
          <SummaryCard
            label="Total Volume"
            value={fmt(summary.totalAmount ?? 0)}
            sub={`${total} transaction${total !== 1 ? "s" : ""}`}
            accent="bg-surface-container-low border-outline-variant/30"
          />
          <SummaryCard
            label="Successful"
            value={summary.successCount ?? 0}
            accent="bg-green-50 border-green-200"
          />
          <SummaryCard
            label="Pending (COD)"
            value={summary.pendingCount ?? 0}
            accent="bg-amber-50 border-amber-200"
          />
          <SummaryCard
            label="Refunded"
            value={summary.refundCount ?? 0}
            accent="bg-blue-50 border-blue-200"
          />
          <SummaryCard
            label="Failed"
            value={summary.failedCount ?? 0}
            accent="bg-red-50 border-red-200"
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by transaction ID or order ID…"
            className="w-full pl-8 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-on-surface-variant"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectCls}>
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
          <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} className={selectCls}>
            <option value="all">All Methods</option>
            <option value="cod">Cash on Delivery</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="netbanking">Net Banking</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/40">
                {["Transaction ID","Order Ref","Customer","Method","Amount / Total","Status","Date"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 rounded bg-on-surface/8 animate-pulse" style={{ width: `${60 + (j * 13) % 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-on-surface-variant text-xs">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => {
                  const user  = txn.userId;
                  const date  = new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                  const time  = new Date(txn.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <tr key={txn._id} className="hover:bg-surface-container-low/50 transition-colors">
                      {/* Transaction ID */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <IconReceipt size={13} className="text-primary" weight="bold" />
                          </div>
                          <span className="font-mono font-semibold text-on-surface">{txn.transactionId}</span>
                        </div>
                      </td>

                      {/* Order ref */}
                      <td className="px-4 py-3 font-mono text-primary font-semibold">
                        {txn.orderRef || "—"}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        {user ? (
                          <div>
                            <p className="font-semibold text-on-surface">{user.name}</p>
                            <p className="text-[10px] text-on-surface-variant">{user.email}</p>
                          </div>
                        ) : "—"}
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <IconWallet size={12} className="text-on-surface-variant" weight="regular" />
                          <span className="text-on-surface">{methodLabel(txn.method)}</span>
                        </div>
                        {txn.razorpayPaymentId && (
                          <p className="text-[9px] font-mono text-on-surface-variant mt-0.5 truncate max-w-[120px]">{txn.razorpayPaymentId}</p>
                        )}
                        {txn.upiVpa && (
                          <p className="text-[9px] text-on-surface-variant mt-0.5">{txn.upiVpa}</p>
                        )}
                        {txn.cardLast4 && (
                          <p className="text-[9px] text-on-surface-variant mt-0.5">•••• {txn.cardLast4}</p>
                        )}
                      </td>

                      {/* Amount breakdown */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(() => {
                          const discount   = txn.orderId?.discount   ?? 0;
                          const couponCode = txn.orderId?.couponCode ?? null;
                          const paid       = txn.amount;
                          const gross      = discount > 0 ? paid + discount : null;
                          return (
                            <div className="flex flex-col gap-0.5">
                              {gross !== null && (
                                <div className="text-[10px] text-on-surface-variant line-through">
                                  {fmt(gross)}
                                </div>
                              )}
                              {discount > 0 && (
                                <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold">
                                  <IconTag size={9} weight="fill" />
                                  {couponCode ?? "Discount"}
                                  <span>−{fmt(discount)}</span>
                                </div>
                              )}
                              <div className="text-xs font-extrabold text-primary">
                                {fmt(paid)}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={txn.status} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">
                        <p>{date}</p>
                        <p className="text-[10px]">{time}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-outline-variant/20 bg-surface-container-low/20">
            <p className="text-[10px] text-on-surface-variant">
              Page {page} of {totalPages} — {total} total
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-xs border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
