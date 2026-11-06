import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

function extensionFor(file: File) {
  const fromName = path.extname(file.name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(fromName)) return fromName;
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/svg+xml") return ".svg";
  return ".jpg";
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image selected" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WebP or SVG image." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 8 MB." },
      { status: 413 },
    );
  }

  const extension = extensionFor(file);
  const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${extension}`;

  try {
    if (isSupabaseConfigured()) {
      const client = getSupabaseAdmin();
      if (!client) throw new Error("Supabase unavailable");
      const bucket = process.env.SUPABASE_PRODUCT_BUCKET || "product-images";
      const bytes = Buffer.from(await file.arrayBuffer());
      const objectPath = `products/${filename}`;
      const { error } = await client.storage.from(bucket).upload(objectPath, bytes, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) {
        console.error("upload", error);
        return NextResponse.json(
          { error: "Could not upload image. Check the storage bucket." },
          { status: 500 },
        );
      }
      const { data } = client.storage.from(bucket).getPublicUrl(objectPath);
      return NextResponse.json({ url: data.publicUrl });
    }

    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDirectory, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDirectory, filename), bytes);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("POST /api/admin/upload", error);
    return NextResponse.json({ error: "Could not upload image." }, { status: 500 });
  }
}
