import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { getDestinations } from "@/lib/data/destinations";
import { getPackages } from "@/lib/data/packages";
import { getBlogPosts } from "@/lib/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/destinations",
    "/packages",
    "/gallery",
    "/blog",
    "/contact",
    "/faq",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  // DB may not be reachable at build time — return gracefully with only static
  // routes so the build never fails. Dynamic routes are picked up at runtime.
  let destinationRoutes: MetadataRoute.Sitemap = [];
  let packageRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const [destinations, packages, blogPosts] = await Promise.all([
      getDestinations(),
      getPackages(),
      getBlogPosts(),
    ]);

    destinationRoutes = destinations.map((d) => ({
      url: `${siteConfig.url}/destinations/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    packageRoutes = packages.map((p) => ({
      url: `${siteConfig.url}/packages/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

    blogRoutes = blogPosts.map((b) => ({
      url: `${siteConfig.url}/blog/${b.slug}`,
      lastModified: new Date(b.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));
  } catch {
    // DB unreachable at build time — dynamic routes omitted from sitemap.
  }

  return [...staticRoutes, ...destinationRoutes, ...packageRoutes, ...blogRoutes];
}

