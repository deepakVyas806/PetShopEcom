import PageHeader        from "@/components/common/PageHeader";
import ProductsContainer from "@/app/containers/admin/ProductsContainer/ProductsContainer";

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Products" }]}
        title="Product Inventory"
        subtitle="Manage your pet supplies and shop catalogue."
      />
      <ProductsContainer />
    </>
  );
}
