import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { getBlogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Travel Blog",
  description: "Travel tips, planning guides, and stories from Wandaara Tours' guides across Kenya and East Africa.",
};

// Prisma queries run at request time on Vercel (SSR), not at build time.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="py-16">
      <div className="container-page">
        <SectionHeading
          eyebrow="Travel Blog"
          title="Tips, Guides & Stories"
          description="Practical advice from our guides — packing lists, timing guides, and honest comparisons."
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-sand-100 px-2.5 py-1 text-xs text-teal-700/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 font-display text-lg text-teal-800 text-balance">{post.title}</h3>
                  <p className="mt-2 text-sm text-teal-700/70 line-clamp-2">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-teal-700/50">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.readingTime}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
