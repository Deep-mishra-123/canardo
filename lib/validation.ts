import { z } from "zod";

const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine((value) => /^(\+91)?[6-9]\d{9}$/.test(value), {
    message: "Enter a valid 10-digit mobile number",
  });

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),
  mobile: phone,
  whatsapp: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || "")
    .refine((value) => value === "" || /^(\+91)?[6-9]\d{9}$/.test(value.replace(/[\s-]/g, "")), {
      message: "Enter a valid WhatsApp number or leave it blank",
    }),
  address: z
    .string()
    .trim()
    .min(10, "Please enter your complete delivery address")
    .max(500, "Address is too long"),
  city: z.string().trim().min(2, "Please enter your city").max(80),
  state: z.string().trim().min(2, "Please enter your state").max(80),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
  notes: z.string().trim().max(400).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid("Invalid product selection"),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Your cart is empty")
    .max(50),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const statusSchema = z.object({
  status: z.enum([
    "New",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]),
});

const variantInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(120),
  fragrance: z.string().trim().max(100).optional().nullable(),
  size: z.string().trim().max(80).optional().nullable(),
  price: z.number().nonnegative().nullable(),
  imageUrl: z.string().trim().min(1).max(1000),
  description: z.string().trim().max(1000),
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0).max(999),
});

export const productUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120),
  category: z.enum(["floor-cleaner", "hand-wash"]),
  description: z.string().trim().max(1200),
  imageUrl: z.string().trim().min(1).max(1000),
  isActive: z.boolean(),
  isPlaceholderImage: z.boolean(),
  sortOrder: z.number().int().min(0).max(999),
  variants: z.array(variantInput).min(1).max(30),
});

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(200),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((value) => value || ""),
  message: z
    .string()
    .trim()
    .min(10, "Please share a little more detail")
    .max(2000, "Message is too long"),
});
