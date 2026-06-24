// Razorpay frontend utility
// Lazily loads the Razorpay checkout script and provides a typed wrapper for opening the modal.

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export type RazorpayMethod = "card" | "netbanking" | "wallet";

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

export interface OpenRazorpayOptions {
  razorpayOrderId: string;
  /** Amount in paise (returned by backend /payment/create-order) */
  amount:          number | string;
  keyId:           string;
  storeName?:      string;
  /** Which payment tab to open: card | upi | wallet */
  method?:         RazorpayMethod;
  prefill?: {
    name?:    string;
    email?:   string;
    contact?: string;
  };
  onSuccess:  (response: RazorpayPaymentResponse) => void;
  onDismiss:  () => void;
}

// Maps our UI method to Razorpay's method filter.
// Only declare the key we want — Razorpay hides the rest automatically.
// Do NOT explicitly set others to 0: if the chosen method isn't enabled on the
// account, an all-zero filter produces a blank modal.
const METHOD_FILTER: Record<RazorpayMethod, Record<string, number>> = {
  card:       { card: 1 },
  netbanking: { netbanking: 1 },
  wallet:     { wallet: 1 },
};

let _scriptLoading: Promise<boolean> | null = null;

/** Loads the Razorpay checkout.js script exactly once. */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay)               return Promise.resolve(true);
  if (_scriptLoading)                return _scriptLoading;

  _scriptLoading = new Promise(resolve => {
    const script    = document.createElement("script");
    script.src      = "https://checkout.razorpay.com/v1/checkout.js";
    script.async    = true;
    script.onload   = () => resolve(true);
    script.onerror  = () => { _scriptLoading = null; resolve(false); };
    document.head.appendChild(script);
  });

  return _scriptLoading;
}

/** Opens the Razorpay payment modal. Call only after loadRazorpayScript() resolves true. */
export function openRazorpayModal(opts: OpenRazorpayOptions): void {
  const methodFilter = opts.method ? METHOD_FILTER[opts.method] : undefined;

  const rzp = new window.Razorpay({
    key:         opts.keyId,
    amount:      opts.amount,
    currency:    "INR",
    name:        opts.storeName ?? "artPet Shop",
    description: "Pet products order",
    image:       "/logo.png",
    order_id:    opts.razorpayOrderId,
    handler:     opts.onSuccess,
    prefill:     opts.prefill ?? {},
    // Restrict to the method the user selected in our UI
    ...(methodFilter && { method: methodFilter }),
    notes: {
      source: "artpet-web",
    },
    theme: {
      color:          "#7C3AED",
      hide_topbar:    false,
    },
    modal: {
      ondismiss:     opts.onDismiss,
      animation:     true,
      backdropclose: false,
    },
  });
  rzp.open();
}
