import { CartView } from "@/components/cart/CartView";

export const metadata = {
  title: "Shopping Cart",
  description: "Review your CANARDO Floor Care selection.",
};

export default function CartPage() {
  return (
    <div className="bg-offwhite">
      <CartView />
    </div>
  );
}
