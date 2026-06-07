import PageHeader           from "@/components/common/PageHeader";
import PromotionsContainer  from "@/app/containers/admin/PromotionsContainer/PromotionsContainer";

export default function AdminPromotionsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Promotions" }]}
        title="Promotions & Coupons"
        subtitle="Manage seasonal campaigns, discount codes, and customer loyalty rewards."
      />
      <PromotionsContainer />
    </>
  );
}
