import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validation/inquiry";
import { sendInquiryEmail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 10_000;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // same-origin requests (no CORS preflight) omit Origin on some clients
  const allowed = new Set(
    [process.env.NEXT_PUBLIC_SITE_URL, `http://${req.headers.get("host")}`, `https://${req.headers.get("host")}`].filter(
      Boolean,
    ),
  );
  return allowed.has(origin);
}

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
    }

    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const ip = getClientIp(req);
    const { success } = rateLimit(`inquiry:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 },
      );
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const body = JSON.parse(raw);
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form for errors.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    if (parsed.data.company) {
      // Honeypot triggered — silently accept to avoid tipping off bots, but do nothing.
      return NextResponse.json({ success: true });
    }

    await Promise.all([
      sendInquiryEmail(parsed.data),
      prisma.inquiry.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          interest: parsed.data.interest || null,
          travelDates: parsed.data.travelDates || null,
          travelers: parsed.data.travelers ?? null,
          message: parsed.data.message,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/inquiry] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
