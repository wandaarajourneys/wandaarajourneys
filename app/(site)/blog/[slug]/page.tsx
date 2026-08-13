import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/data/blog";

// Force server-side rendering so Prisma runs at request time on Vercel,
// not at build time when a live DB may not be reachable.
export const dynamic = "force-dynamic";

// Allow slugs not known at build time to be rendered on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const blogPosts = await getBlogPosts();
    return blogPosts.map((p) => ({ slug: p.slug }));
  } catch {
    // DB unavailable at build time — Vercel will SSR these pages at request time.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-16">
      <div className="container-page max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 hover:underline"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to Blog
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-sand-100 px-2.5 py-1 text-xs text-teal-700/80">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-4 font-display text-3xl md:text-4xl text-teal-800 text-balance">{post.title}</h1>
        <p className="mt-3 text-sm text-teal-700/60">
          By {post.author} ·{" "}
          {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} ·{" "}
          {post.readingTime}
        </p>

        <div className="relative mt-8 h-72 md:h-96 w-full rounded-2xl overflow-hidden">
          <Image src={post.coverImage} alt={post.title} fill sizes="800px" priority className="object-cover" />
        </div>

        <div className="mt-10 space-y-6 text-lg leading-relaxed text-teal-700/85">
          {post.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-teal-800 p-8 text-center">
          <h2 className="font-display text-2xl text-white">Ready to plan your trip?</h2>
          <p className="mt-2 text-sand-100/80">Our travel specialists reply within 24 hours.</p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors"
          >
            Start Planning
          </Link>
        </div>
      </div>
    </article>
  );
}
