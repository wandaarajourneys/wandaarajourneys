import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation/newsletter";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 2_000;

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const ip = getClientIp(req);
    const { success } = rateLimit(`newsletter:${ip}`);
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

    const parsed = newsletterSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (parsed.data.company) {
      return NextResponse.json({ success: true });
    }

    // Double opt-in ready: persist to an ESP (e.g. Mailchimp/Resend Audiences) here,
    // and send a confirmation email before marking the subscriber active.
    console.info("[newsletter] New signup pending confirmation:", parsed.data.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/newsletter] Unexpected error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
