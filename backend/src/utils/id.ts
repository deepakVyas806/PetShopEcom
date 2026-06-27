/** Generate a human-readable ID like PET-123456 */
export function generateOrderId(): string {
  return `PET-${Math.floor(100000 + Math.random() * 900000)}`;
}

/** Generate a booking ID like BK-123456 */
export function generateBookingId(): string {
  return `BK-${Math.floor(100000 + Math.random() * 900000)}`;
}

/** Generate a transaction ID like TXN-123456789 */
export function generateTransactionId(): string {
  return `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
}
