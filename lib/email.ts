import nodemailer from "nodemailer";
import type { InquiryInput } from "@/lib/validation/inquiry";
import { siteConfig } from "@/lib/constants";

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendInquiryEmail(data: Omit<InquiryInput, "company">) {
  const transport = getTransport();
  const to = process.env.INQUIRY_TO_EMAIL || "info@wandaaratours.com";
  const from = process.env.INQUIRY_FROM_EMAIL || "no-reply@wandaaratours.com";

  const subject = `New inquiry from ${data.name}${data.interest ? ` — ${data.interest}` : ""}`;
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Interest: ${data.interest || "Not specified"}`,
    `Travel dates: ${data.travelDates || "Not specified"}`,
    `Travelers: ${data.travelers ?? "Not specified"}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  const html = `
    <h2>New Wandaara Tours Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Interest:</strong> ${escapeHtml(data.interest || "Not specified")}</p>
    <p><strong>Travel dates:</strong> ${escapeHtml(data.travelDates || "Not specified")}</p>
    <p><strong>Travelers:</strong> ${data.travelers ?? "Not specified"}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
  `;

  if (!transport) {
    // No SMTP configured (e.g. local dev without .env) — log so the flow is still testable.
    console.info("[email] SMTP not configured, logging inquiry instead of sending:", {
      to,
      subject,
    });
    return { delivered: false };
  }

  await transport.sendMail({
    to,
    from,
    replyTo: data.email,
    subject,
    text,
    html,
  });

  return { delivered: true };
}

export async function sendAdminPasswordResetEmail(toEmail: string, resetUrl: string) {
  const transport = getTransport();
  const from = process.env.INQUIRY_FROM_EMAIL || "no-reply@wandaaratours.com";
  const subject = `${siteConfig.name} Admin — Password Reset`;

  const text = [
    "A password reset was requested for your Wandaara admin account.",
    "",
    `Reset your password: ${resetUrl}`,
    "",
    "This link expires in 1 hour. If you didn't request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <h2>Admin Password Reset</h2>
    <p>A password reset was requested for your Wandaara admin account.</p>
    <p><a href="${resetUrl}">Reset your password</a></p>
    <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
  `;

  if (!transport) {
    // No SMTP configured — log the reset link so the flow is testable locally
    // without a mail provider. Never do this in a real production deployment.
    console.info("[email] SMTP not configured, logging password reset link instead of sending:", {
      to: toEmail,
      resetUrl,
    });
    return { delivered: false };
  }

  await transport.sendMail({ to: toEmail, from, subject, text, html });
  return { delivered: true };
}
