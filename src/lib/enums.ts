/**
 * ─── Application Enums ─────────────────────────────────────────────────────
 * Single source of truth for all magic strings used in conditional logic.
 * Import and use these everywhere instead of raw string comparisons.
 */

export enum OrderStatus {
  CONFIRMED    = "Order Confirmed",
  SHIPPED      = "Shipped",
  OUT_DELIVERY = "Out for Delivery",
  DELIVERED    = "Delivered",
}

export enum CancelStep {
  IDLE    = "idle",
  CONFIRM = "confirm",
  DONE    = "done",
}

export enum ReorderStep {
  IDLE   = "idle",
  ADDING = "adding",
  DONE   = "done",
}

export enum PetType {
  DOGS       = "dogs",
  CATS       = "cats",
  SMALL_PETS = "small_pets",
  BIRDS      = "birds",
  FISH       = "fish",
}

export enum ServiceCategory {
  ALL        = "all",
  GROOMING   = "grooming",
  VETERINARY = "veterinary",
  TRAINING   = "training",
  SITTING    = "sitting",
}

export enum NotificationFilter {
  ALL        = "all",
  ORDERS     = "orders",
  PROMOTIONS = "promotions",
  ACCOUNT    = "account",
}

export enum AuthView {
  LOGIN    = "login",
  SIGNUP   = "signup",
  FORGOT   = "forgot-password",
}

export enum PaymentMethod {
  CARD   = "card",
  UPI    = "upi",
  WALLET = "wallet",
  COD    = "cod",
}

export enum SearchItemType {
  PRODUCT = "product",
  SERVICE = "service",
}

export enum CheckoutFlowType {
  CART    = "cart",
  SERVICE = "service",
}

export enum AppointmentStatus {
  ALL       = "all",
  UPCOMING  = "upcoming",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum SortOrder {
  DATE_ASC  = "date-asc",
  DATE_DESC = "date-desc",
}

export enum StockStatus {
  IN_STOCK  = "inStock",
  LOW_STOCK = "lowStock",
  OUT       = "outOfStock",
}
