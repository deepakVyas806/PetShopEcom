import { redirect } from "next/navigation";

// Track order always requires an order ID — redirect bare visits to orders list
export default function TrackOrderIndexPage() {
  redirect("/orders");
}
