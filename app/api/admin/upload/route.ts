import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSessionUser } from "@/lib/admin/session";
import { verifyCsrf } from "@/lib/auth/csrf";
import { isAllowedOrigin } from "@/lib/admin/security";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req) || !verifyCsrf(req)) {
      return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    }

    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Image upload isn't configured. Paste an externally-hosted image URL instead." },
        { status: 501 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Use JPEG, PNG, WebP, AVIF, or GIF." }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File is too large (5MB max)." }, { status: 413 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
    const blob = await put(`admin-uploads/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("[api/admin/upload] Unexpected error:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
