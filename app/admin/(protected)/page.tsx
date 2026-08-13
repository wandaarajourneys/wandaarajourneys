import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Package, MessageSquareQuote, Newspaper, Inbox, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [destinationCount, packageCount, testimonialCount, blogCount, unreadInquiries, recentActivity] =
    await Promise.all([
      prisma.destination.count(),
      prisma.package.count(),
      prisma.testimonial.count(),
      prisma.blogPost.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.adminActivityLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    ]);

  const stats = [
    { label: "Destinations", value: destinationCount, href: "/admin/destinations", icon: MapPin },
    { label: "Packages", value: packageCount, href: "/admin/packages", icon: Package },
    { label: "Testimonials", value: testimonialCount, href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Blog Posts", value: blogCount, href: "/admin/blog", icon: Newspaper },
    { label: "Unread Inquiries", value: unreadInquiries, href: "/admin/inquiries", icon: Inbox, highlight: unreadInquiries > 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">Dashboard</h1>
      <p className="mt-1 text-sm text-teal-700/60">An overview of your site&apos;s content.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className={`rounded-2xl border p-5 shadow-card hover:shadow-card-hover transition-shadow ${
                stat.highlight ? "border-terracotta-300 bg-terracotta-50" : "border-teal-700/10 bg-white"
              }`}
            >
              <Icon size={20} className={stat.highlight ? "text-terracotta-600" : "text-teal-600"} aria-hidden="true" />
              <p className="mt-3 font-display text-3xl text-teal-800">{stat.value}</p>
              <p className="mt-1 text-sm text-teal-700/60">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-teal-700/10 bg-white shadow-card">
        <div className="px-6 py-4 border-b border-teal-700/10 flex items-center gap-2">
          <Clock size={16} className="text-teal-600" aria-hidden="true" />
          <h2 className="font-display text-lg text-teal-800">Recent Activity</h2>
        </div>
        {recentActivity.length === 0 ? (
          <p className="px-6 py-6 text-sm text-teal-700/60">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-teal-700/10">
            {recentActivity.map((entry) => (
              <li key={entry.id} className="px-6 py-3.5 flex items-center justify-between gap-4 text-sm">
                <span className="text-teal-800">
                  <span className="font-medium">{entry.userEmail}</span>{" "}
                  <span className="text-teal-700/70">
                    {entry.action.replace(/_/g, " ")} {entry.entity}
                    {entry.entityId ? ` (${entry.entityId.slice(0, 8)})` : ""}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-teal-700/50">
                  {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
