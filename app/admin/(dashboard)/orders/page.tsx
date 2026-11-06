import { OrdersTable } from "@/components/admin/OrdersTable";
import { listOrders } from "@/lib/store";

export const metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <div>
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-forest/50">
          Orders
        </p>
        <h1 className="display-title mt-2 text-4xl text-forest md:text-5xl">
          Incoming orders.
        </h1>
        <p className="mt-2 text-xs text-charcoal/50">
          Review customer details, delivery addresses and order totals.
        </p>
      </div>

      <div className="mt-6">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
