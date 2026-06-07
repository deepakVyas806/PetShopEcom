import { notFound } from "next/navigation";
import { PRODUCTS } from "@/app/containers/admin/ProductsContainer/data";
import CreateProductContainer from "@/app/containers/admin/ProductsContainer/CreateProductContainer/CreateProductContainer";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();
  return <CreateProductContainer product={product} />;
}
