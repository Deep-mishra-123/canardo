import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata = {
  title: "Checkout",
  description: "Enter your delivery details to place your CANARDO order.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-offwhite">
      <CheckoutView />
    </div>
  );
}
