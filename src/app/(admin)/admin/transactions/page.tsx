import PageHeader            from "@/components/common/PageHeader";
import TransactionsContainer from "@/app/containers/admin/TransactionsContainer/TransactionsContainer";

export default function AdminTransactionsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Transactions" }]}
        title="Transaction Ledger"
        subtitle="All payment records across orders — COD, UPI, card, and Razorpay."
      />
      <TransactionsContainer />
    </>
  );
}
