"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, StorefrontItem } from "@/lib/types";
import { Toast } from "@/components/ui/Toast";

const STORAGE_KEY = "canardo_cart_v1";

type CartContextValue = {
  products: StorefrontItem[];
  cart: CartLine[];
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  lines: Array<{ line: CartLine; product: StorefrontItem; lineTotal: number }>;
  addItem: (variantId: string, quantity?: number) => boolean;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  getProduct: (variantId: string) => StorefrontItem | undefined;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseStoredCart(value: string | null): CartLine[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is CartLine =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as CartLine).variantId === "string" &&
          Number.isInteger((item as CartLine).quantity) &&
          (item as CartLine).quantity > 0,
      )
      .map((item) => ({
        variantId: item.variantId,
        quantity: Math.min(20, Math.max(1, item.quantity)),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
  initialProducts,
  deliveryFee,
}: {
  children: React.ReactNode;
  initialProducts: StorefrontItem[];
  deliveryFee: number;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    setCart(parseStoredCart(window.localStorage.getItem(STORAGE_KEY)));
    setHydrated(true);

    let active = true;
    fetch("/api/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { products?: StorefrontItem[] } | null) => {
        if (active && Array.isArray(data?.products)) {
          setProducts(data.products);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast((current) => ({ ...current, show: false }));
  }, []);

  const getProduct = useCallback(
    (variantId: string) => products.find((product) => product.variantId === variantId),
    [products],
  );

  const addItem = useCallback(
    (variantId: string, quantity = 1) => {
      const product = products.find((item) => item.variantId === variantId);
      if (!product || !product.isActive) {
        showToast("This product is currently unavailable");
        return false;
      }
      if (product.price === null || product.price <= 0) {
        showToast("This product is not available to order yet");
        return false;
      }

      setCart((current) => {
        const existing = current.find((item) => item.variantId === variantId);
        if (existing) {
          return current.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(20, item.quantity + quantity) }
              : item,
          );
        }
        return [...current, { variantId, quantity: Math.min(20, quantity) }];
      });
      const label = product.fragrance
        ? `${product.productName} — ${product.fragrance}`
        : product.productName;
      showToast(`${label} added to your cart`);
      return true;
    },
    [products, showToast],
  );

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: Math.max(1, Math.min(20, quantity)) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setCart((current) => current.filter((item) => item.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = products.find((item) => item.variantId === line.variantId);
          if (!product) return null;
          return {
            line,
            product,
            lineTotal: (product.price || 0) * line.quantity,
          };
        })
        .filter(
          (
            entry,
          ): entry is {
            line: CartLine;
            product: StorefrontItem;
            lineTotal: number;
          } => entry !== null,
        ),
    [cart, products],
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => Math.round(lines.reduce((sum, entry) => sum + entry.lineTotal, 0) * 100) / 100,
    [lines],
  );

  const payable = lines.length > 0;
  const total = payable ? Math.round((subtotal + deliveryFee) * 100) / 100 : 0;

  const value: CartContextValue = {
    products,
    cart,
    hydrated,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    lines,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    getProduct,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toast message={toast.message} show={toast.show} onClose={hideToast} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
