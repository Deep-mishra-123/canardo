import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { getProductById } from "@/lib/store";

export const metadata = {
  title: "Edit Product",
};

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return <ProductEditor product={product} />;
}
