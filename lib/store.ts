import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { SEED_PRODUCTS } from "@/data/products";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type {
  ContactMessage,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductCategory,
  ProductVariant,
  StorefrontItem,
} from "@/lib/types";
import { deliveryFee, flattenProducts } from "@/lib/utils";
import type { CheckoutInput, ProductUpdateInput } from "@/lib/validation";

const LOCAL_DB_PATH = path.join(process.cwd(), "data", "store.local.json");

type LocalDatabase = {
  products: Product[];
  orders: Order[];
  messages?: ContactMessage[];
};

let localQueue: Promise<unknown> = Promise.resolve();

export class StoreError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "STORE_ERROR", status = 400) {
    super(message);
    this.name = "StoreError";
    this.code = code;
    this.status = status;
  }
}

function cloneSeed(): Product[] {
  return structuredClone(SEED_PRODUCTS);
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

async function readLocalDb(): Promise<LocalDatabase> {
  try {
    const raw = await fs.readFile(LOCAL_DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as LocalDatabase;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.orders)) {
      throw new Error("Invalid local database");
    }
    if (!Array.isArray(parsed.messages)) parsed.messages = [];
    return parsed;
  } catch {
    const fresh: LocalDatabase = { products: cloneSeed(), orders: [], messages: [] };
    // Serverless filesystems (Vercel) are read-only, so never persist locally in production.
    if (process.env.NODE_ENV !== "production") {
      await writeLocalDb(fresh);
    }
    return fresh;
  }
}

async function writeLocalDb(db: LocalDatabase) {
  await fs.mkdir(path.dirname(LOCAL_DB_PATH), { recursive: true });
  const temporary = `${LOCAL_DB_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(temporary, LOCAL_DB_PATH);
}

function mutateLocalDb<T>(mutation: (db: LocalDatabase) => T | Promise<T>): Promise<T> {
  const operation = localQueue.then(async () => {
    const db = await readLocalDb();
    const result = await mutation(db);
    if (process.env.NODE_ENV !== "production") {
      await writeLocalDb(db);
    }
    return result;
  });
  localQueue = operation.catch(() => undefined);
  return operation;
}

function mapProductRow(row: Record<string, unknown>): Product {
  const rawVariants = (row.product_variants || row.variants || []) as Record<
    string,
    unknown
  >[];

  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    category: row.category as ProductCategory,
    description: String(row.description || ""),
    imageUrl: String(row.image_url || ""),
    isActive: Boolean(row.is_active),
    isPlaceholderImage: Boolean(row.is_placeholder_image),
    sortOrder: Number(row.sort_order || 0),
    variants: rawVariants
      .map(
        (variant): ProductVariant => ({
          id: String(variant.id),
          productId: String(variant.product_id),
          name: String(variant.name),
          slug: String(variant.slug),
          fragrance: variant.fragrance ? String(variant.fragrance) : null,
          size: variant.size ? String(variant.size) : null,
          price: asNumber(variant.price),
          imageUrl: String(variant.image_url || ""),
          description: String(variant.description || ""),
          isActive: Boolean(variant.is_active),
          sortOrder: Number(variant.sort_order || 0),
        }),
      )
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function mapOrderRow(row: Record<string, unknown>): Order {
  const rawItems = (row.order_items || row.items || []) as Record<string, unknown>[];
  return {
    id: String(row.id),
    orderNumber: String(row.order_number),
    confirmationToken: String(row.confirmation_token),
    customerName: String(row.customer_name),
    mobile: String(row.mobile),
    whatsapp: row.whatsapp ? String(row.whatsapp) : null,
    address: String(row.address),
    city: String(row.city),
    state: String(row.state),
    pincode: String(row.pincode),
    subtotal: Number(row.subtotal || 0),
    deliveryFee: Number(row.delivery_fee || 0),
    total: Number(row.total || 0),
    status: row.status as OrderStatus,
    notes: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    items: rawItems.map(
      (item): OrderItem => ({
        id: String(item.id),
        productId: item.product_id ? String(item.product_id) : null,
        variantId: item.variant_id ? String(item.variant_id) : null,
        productName: String(item.product_name),
        variantName: String(item.variant_name),
        fragrance: item.fragrance ? String(item.fragrance) : null,
        size: item.size ? String(item.size) : null,
        unitPrice: Number(item.unit_price || 0),
        quantity: Number(item.quantity || 0),
        lineTotal: Number(item.line_total || 0),
        imageUrl: String(item.image_url || ""),
      }),
    ),
  };
}

export async function listProducts(includeInactive = false): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    let query = client
      .from("products")
      .select("*, product_variants(*)")
      .order("sort_order", { ascending: true });
    if (!includeInactive) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) {
      console.error("listProducts", error);
      throw new StoreError("Could not load products", "DB_ERROR", 500);
    }
    return (data || [])
      .map((row) => mapProductRow(row as Record<string, unknown>))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const db = await readLocalDb();
  const products = includeInactive
    ? db.products
    : db.products.filter((product) => product.isActive);
  return structuredClone(products).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getStorefrontItems(): Promise<StorefrontItem[]> {
  return flattenProducts(await listProducts(false));
}

export async function getStorefrontItemBySlug(
  slug: string,
): Promise<StorefrontItem | null> {
  const items = await getStorefrontItems();
  return items.find((item) => item.variantSlug === slug) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await listProducts(true);
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await listProducts(true);
  return products.find((product) => product.id === id) || null;
}

function makeOrderNumber() {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = crypto.randomBytes(4).toString("hex").slice(0, 5).toUpperCase();
  return `CNR-${date}-${random}`;
}

export async function createOrder(input: CheckoutInput): Promise<Order> {
  const products = await listProducts(true);
  const variants = new Map(
    products
      .flatMap((product) =>
        product.variants.map((variant) => ({ product, variant })),
      )
      .map(({ product, variant }) => [variant.id, { product, variant }]),
  );

  const lineItems: OrderItem[] = [];
  const seen = new Set<string>();

  for (const cartItem of input.items) {
    if (seen.has(cartItem.variantId)) {
      throw new StoreError("Duplicate cart lines are not allowed", "INVALID_CART");
    }
    seen.add(cartItem.variantId);

    const entry = variants.get(cartItem.variantId);
    if (!entry || !entry.product.isActive || !entry.variant.isActive) {
      throw new StoreError(
        "One of the selected products is no longer available",
        "PRODUCT_UNAVAILABLE",
        409,
      );
    }
    if (entry.variant.price === null || entry.variant.price <= 0) {
      throw new StoreError(
        `${entry.product.name}${entry.variant.fragrance ? ` — ${entry.variant.fragrance}` : ""} is not available to order yet.`,
        "PRICE_NOT_SET",
        409,
      );
    }

    const lineTotal = roundMoney(entry.variant.price * cartItem.quantity);
    lineItems.push({
      id: crypto.randomUUID(),
      productId: entry.product.id,
      variantId: entry.variant.id,
      productName: entry.product.name,
      variantName: entry.variant.name,
      fragrance: entry.variant.fragrance,
      size: entry.variant.size,
      unitPrice: entry.variant.price,
      quantity: cartItem.quantity,
      lineTotal,
      imageUrl: entry.variant.imageUrl,
    });
  }

  if (lineItems.length === 0) {
    throw new StoreError("Your cart is empty", "EMPTY_CART");
  }

  const subtotal = roundMoney(
    lineItems.reduce((sum, line) => sum + line.lineTotal, 0),
  );
  const fee = roundMoney(deliveryFee());
  const total = roundMoney(subtotal + fee);
  const now = new Date().toISOString();
  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: makeOrderNumber(),
    confirmationToken: crypto.randomUUID(),
    customerName: input.customerName,
    mobile: input.mobile,
    whatsapp: input.whatsapp || null,
    address: input.address,
    city: input.city,
    state: input.state,
    pincode: input.pincode,
    subtotal,
    deliveryFee: fee,
    total,
    status: "New",
    notes: input.notes || null,
    createdAt: now,
    updatedAt: now,
    items: lineItems,
  };

  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);

    const { error: orderError } = await client.from("orders").insert({
      id: order.id,
      order_number: order.orderNumber,
      confirmation_token: order.confirmationToken,
      customer_name: order.customerName,
      mobile: order.mobile,
      whatsapp: order.whatsapp,
      address: order.address,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      total: order.total,
      status: order.status,
      notes: order.notes,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    });

    if (orderError) {
      console.error("createOrder:order", orderError);
      throw new StoreError("Could not place your order", "DB_ERROR", 500);
    }

    const { error: itemsError } = await client.from("order_items").insert(
      order.items.map((item) => ({
        id: item.id,
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.productName,
        variant_name: item.variantName,
        fragrance: item.fragrance,
        size: item.size,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        line_total: item.lineTotal,
        image_url: item.imageUrl,
      })),
    );

    if (itemsError) {
      console.error("createOrder:items", itemsError);
      await client.from("orders").delete().eq("id", order.id);
      throw new StoreError("Could not place your order", "DB_ERROR", 500);
    }

    return order;
  }

  await mutateLocalDb((db) => {
    db.orders.unshift(order);
  });
  return structuredClone(order);
}

export async function listOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    const { data, error } = await client
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("listOrders", error);
      throw new StoreError("Could not load orders", "DB_ERROR", 500);
    }
    return (data || []).map((row) => mapOrderRow(row as Record<string, unknown>));
  }

  const db = await readLocalDb();
  return structuredClone(db.orders);
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    const { data, error } = await client
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      console.error("getOrderById", error);
      throw new StoreError("Could not load order", "DB_ERROR", 500);
    }
    return data ? mapOrderRow(data as Record<string, unknown>) : null;
  }

  const db = await readLocalDb();
  return db.orders.find((order) => order.id === id) || null;
}

export async function getOrderConfirmation(
  orderNumber: string,
  token: string,
): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    const { data, error } = await client
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", orderNumber)
      .eq("confirmation_token", token)
      .maybeSingle();
    if (error) {
      console.error("getOrderConfirmation", error);
      throw new StoreError("Could not load order", "DB_ERROR", 500);
    }
    return data ? mapOrderRow(data as Record<string, unknown>) : null;
  }

  const db = await readLocalDb();
  return (
    db.orders.find(
      (order) =>
        order.orderNumber === orderNumber && order.confirmationToken === token,
    ) || null
  );
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    const { data, error } = await client
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*, order_items(*)")
      .maybeSingle();
    if (error) {
      console.error("updateOrderStatus", error);
      throw new StoreError("Could not update order", "DB_ERROR", 500);
    }
    return data ? mapOrderRow(data as Record<string, unknown>) : null;
  }

  return mutateLocalDb((db) => {
    const order = db.orders.find((entry) => entry.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return structuredClone(order);
  });
}

export async function updateProduct(
  id: string,
  input: ProductUpdateInput,
): Promise<Product> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);

    const { error: productError } = await client
      .from("products")
      .update({
        name: input.name,
        slug: input.slug,
        category: input.category,
        description: input.description,
        image_url: input.imageUrl,
        is_active: input.isActive,
        is_placeholder_image: input.isPlaceholderImage,
        sort_order: input.sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (productError) {
      console.error("updateProduct:product", productError);
      throw new StoreError("Could not save product", "DB_ERROR", 500);
    }

    const { data: existing, error: existingError } = await client
      .from("product_variants")
      .select("id")
      .eq("product_id", id);
    if (existingError) {
      throw new StoreError("Could not save variants", "DB_ERROR", 500);
    }

    const keptIds = new Set(input.variants.map((variant) => variant.id).filter(Boolean));
    const removedIds = (existing || [])
      .map((variant) => String(variant.id))
      .filter((variantId) => !keptIds.has(variantId));

    if (removedIds.length > 0) {
      const { error } = await client
        .from("product_variants")
        .delete()
        .in("id", removedIds);
      if (error) throw new StoreError("Could not remove variant", "DB_ERROR", 500);
    }

    for (const variant of input.variants) {
      const payload = {
        product_id: id,
        name: variant.name,
        slug: variant.slug,
        fragrance: variant.fragrance || null,
        size: variant.size || null,
        price: variant.price,
        image_url: variant.imageUrl,
        description: variant.description,
        is_active: variant.isActive,
        sort_order: variant.sortOrder,
        updated_at: new Date().toISOString(),
      };

      const response = variant.id
        ? await client.from("product_variants").update(payload).eq("id", variant.id)
        : await client.from("product_variants").insert(payload);
      if (response.error) {
        console.error("updateProduct:variant", response.error);
        throw new StoreError("Could not save product variant", "DB_ERROR", 500);
      }
    }

    const saved = await getProductById(id);
    if (!saved) throw new StoreError("Product not found", "NOT_FOUND", 404);
    return saved;
  }

  return mutateLocalDb((db) => {
    const product = db.products.find((entry) => entry.id === id);
    if (!product) throw new StoreError("Product not found", "NOT_FOUND", 404);

    product.name = input.name;
    product.slug = input.slug;
    product.category = input.category;
    product.description = input.description;
    product.imageUrl = input.imageUrl;
    product.isActive = input.isActive;
    product.isPlaceholderImage = input.isPlaceholderImage;
    product.sortOrder = input.sortOrder;
    product.variants = input.variants.map((variant) => ({
      id: variant.id || crypto.randomUUID(),
      productId: id,
      name: variant.name,
      slug: variant.slug,
      fragrance: variant.fragrance || null,
      size: variant.size || null,
      price: variant.price,
      imageUrl: variant.imageUrl,
      description: variant.description,
      isActive: variant.isActive,
      sortOrder: variant.sortOrder,
    }));

    return structuredClone(product);
  });
}

function mapMessageRow(row: Record<string, unknown>): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone ? String(row.phone) : null,
    message: String(row.message),
    isRead: Boolean(row.is_read),
    createdAt: String(row.created_at),
  };
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<ContactMessage> {
  const message: ContactMessage = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone || null,
    message: input.message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    const { error } = await client.from("contact_messages").insert({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      message: message.message,
      is_read: false,
      created_at: message.createdAt,
    });
    if (error) {
      console.error("createContactMessage", error);
      throw new StoreError("Could not send your message", "DB_ERROR", 500);
    }
    return message;
  }

  await mutateLocalDb((db) => {
    if (!db.messages) db.messages = [];
    db.messages.unshift(message);
  });
  return structuredClone(message);
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    const { data, error } = await client
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("listContactMessages", error);
      throw new StoreError("Could not load messages", "DB_ERROR", 500);
    }
    return (data || []).map((row) => mapMessageRow(row as Record<string, unknown>));
  }

  const db = await readLocalDb();
  return structuredClone(db.messages || []);
}

export async function markContactMessageRead(
  id: string,
  isRead: boolean,
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    const { error } = await client
      .from("contact_messages")
      .update({ is_read: isRead })
      .eq("id", id);
    if (error) throw new StoreError("Could not update message", "DB_ERROR", 500);
    return true;
  }

  return mutateLocalDb((db) => {
    const message = (db.messages || []).find((entry) => entry.id === id);
    if (!message) return false;
    message.isRead = isRead;
    return true;
  });
}

export async function createProduct(input: ProductUpdateInput): Promise<Product> {
  const id = crypto.randomUUID();

  if (isSupabaseConfigured()) {
    const client = getSupabaseAdmin();
    if (!client) throw new StoreError("Database is unavailable", "DB_UNAVAILABLE", 500);
    const { error } = await client.from("products").insert({
      id,
      name: input.name,
      slug: input.slug,
      category: input.category,
      description: input.description,
      image_url: input.imageUrl,
      is_active: input.isActive,
      is_placeholder_image: input.isPlaceholderImage,
      sort_order: input.sortOrder,
    });
    if (error) {
      console.error("createProduct", error);
      throw new StoreError(
        error.code === "23505"
          ? "That product slug is already in use"
          : "Could not create product",
        "DB_ERROR",
        400,
      );
    }

    const { error: variantsError } = await client.from("product_variants").insert(
      input.variants.map((variant) => ({
        id: crypto.randomUUID(),
        product_id: id,
        name: variant.name,
        slug: variant.slug,
        fragrance: variant.fragrance || null,
        size: variant.size || null,
        price: variant.price,
        image_url: variant.imageUrl,
        description: variant.description,
        is_active: variant.isActive,
        sort_order: variant.sortOrder,
      })),
    );

    if (variantsError) {
      console.error("createProduct:variants", variantsError);
      await client.from("products").delete().eq("id", id);
      throw new StoreError(
        variantsError.code === "23505"
          ? "One of the variant slugs is already in use"
          : "Could not create product variants",
        "DB_ERROR",
        400,
      );
    }
  } else {
    await mutateLocalDb((db) => {
      if (
        db.products.some(
          (product) => product.slug === input.slug || product.id === id,
        )
      ) {
        throw new StoreError("That product slug is already in use", "DUPLICATE", 409);
      }
      db.products.push({
        id,
        name: input.name,
        slug: input.slug,
        category: input.category,
        description: input.description,
        imageUrl: input.imageUrl,
        isActive: input.isActive,
        isPlaceholderImage: input.isPlaceholderImage,
        sortOrder: input.sortOrder,
        variants: input.variants.map((variant) => ({
          id: crypto.randomUUID(),
          productId: id,
          name: variant.name,
          slug: variant.slug,
          fragrance: variant.fragrance || null,
          size: variant.size || null,
          price: variant.price,
          imageUrl: variant.imageUrl,
          description: variant.description,
          isActive: variant.isActive,
          sortOrder: variant.sortOrder,
        })),
      });
    });
  }

  const product = await getProductById(id);
  if (!product) throw new StoreError("Could not create product", "DB_ERROR", 500);
  return product;
}
