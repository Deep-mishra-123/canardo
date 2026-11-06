import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata = {
  title: "New Product",
};

export default function AdminNewProductPage() {
  return <ProductEditor product={null} />;
}
