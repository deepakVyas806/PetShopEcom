import CreateProductContainer from "@/app/containers/admin/ProductsContainer/CreateProductContainer/CreateProductContainer";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CreateProductContainer editId={id} />;
}
