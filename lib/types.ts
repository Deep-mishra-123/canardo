export type ProductCategory = "floor-cleaner" | "hand-wash";

export type OrderStatus =
  | "New"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "New",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  fragrance: string | null;
  size: string | null;
  price: number | null;
  imageUrl: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  isActive: boolean;
  isPlaceholderImage: boolean;
  sortOrder: number;
  variants: ProductVariant[];
};

export type StorefrontItem = {
  productId: string;
  productName: string;
  productSlug: string;
  category: ProductCategory;
  productDescription: string;
  variantId: string;
  variantName: string;
  variantSlug: string;
  fragrance: string | null;
  size: string | null;
  price: number | null;
  imageUrl: string;
  description: string;
  isPlaceholderImage: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type OrderItem = {
  id: string;
  productId: string | null;
  variantId: string | null;
  productName: string;
  variantName: string;
  fragrance: string | null;
  size: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  confirmationToken: string;
  customerName: string;
  mobile: string;
  whatsapp: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type CartLine = {
  variantId: string;
  quantity: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};
