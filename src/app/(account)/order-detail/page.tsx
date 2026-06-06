import { redirect } from "next/navigation";

// Order detail always requires an order ID — redirect bare visits to orders list
export default function OrderDetailIndexPage() {
  redirect("/orders");
}
