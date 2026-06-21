"use client";

import { useState, useEffect } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

// Defaults used if the API hasn't responded yet or fails
export const SETTINGS_DEFAULTS = {
  taxRate:               18,
  freeShippingThreshold: 999,
  baseShippingCost:      50,
  deliveryOptions: [
    { key: "standard", label: "Standard Delivery", description: "3–5 business days", cost: 0,   active: true  },
    { key: "express",  label: "Express Delivery",  description: "1–2 business days",  cost: 99,  active: true  },
    { key: "same_day", label: "Same Day Delivery", description: "Order before 12 PM", cost: 199, active: false },
  ],
  storeName:  "artPet Shop",
  storeEmail: "",
  storePhone: "",
};

// Module-level cache — one fetch shared across all components in the same page lifecycle.
// Invalidated when the module is reloaded (i.e. on hard refresh / new navigation).
let _cache   = null;
let _pending = null;

function loadSettings() {
  if (_cache) return Promise.resolve(_cache);
  if (_pending) return _pending;
  _pending = fetch(`${BASE_URL}/settings`)
    .then(r => (r.ok ? r.json() : null))
    .then(data => {
      _cache   = data?.settings ? { ...SETTINGS_DEFAULTS, ...data.settings } : SETTINGS_DEFAULTS;
      _pending = null;
      return _cache;
    })
    .catch(() => {
      _pending = null;
      return SETTINGS_DEFAULTS;
    });
  return _pending;
}

/**
 * Returns store settings fetched from /api/v1/settings.
 * Falls back to SETTINGS_DEFAULTS synchronously so components never block on render.
 * All instances on the same page share one request.
 */
export default function useStoreSettings() {
  const [settings, setSettings] = useState(_cache ?? SETTINGS_DEFAULTS);

  useEffect(() => {
    loadSettings().then(s => setSettings(s));
  }, []);

  return settings;
}
