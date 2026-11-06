import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getStorefrontItems } from "@/lib/store";
import { deliveryFee as getDeliveryFee } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getStorefrontItems();

  return (
    <CartProvider initialProducts={products} deliveryFee={getDeliveryFee()}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
