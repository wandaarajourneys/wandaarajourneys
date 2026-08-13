"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { blogPostSchema, type BlogPostInput } from "@/lib/validation/admin/blogPost";
import { createBlogPost, updateBlogPost } from "@/lib/admin/actions/blog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { TagListInput } from "@/components/admin/TagListInput";

const emptyValues: BlogPostInput = {
  slug: "",
  title: "",
  excerpt: "",
  content: [""],
  coverImage: "",
  author: "Wandaara Editorial Team",
  tags: [],
  readingTime: "5 min read",
  status: "DRAFT",
};

export function BlogPostForm({ originalSlug, initial }: { originalSlug?: string; initial?: BlogPostInput }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initial ?? emptyValues,
  });

  const content = watch("content");

  async function onSubmit(data: BlogPostInput) {
    setSubmitting(true);
    setFormError(null);
    const result = originalSlug ? await updateBlogPost(originalSlug, data) : await createBlogPost(data);
    setSubmitting(false);
    if (!result.success) {
      setFormError(result.error);
      return;
    }
    toast.success(originalSlug ? "Post updated." : "Post created.");
    router.push("/admin/blog");
    router.refresh();
  }

  function updateParagraph(index: number, value: string) {
    const next = [...content];
    next[index] = value;
    setValue("content", next, { shouldValidate: true });
  }

  function addParagraph() {
    setValue("content", [...content, ""], { shouldValidate: true });
  }

  function removeParagraph(index: number) {
    setValue("content", content.filter((_, i) => i !== index), { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl" noValidate>
      {formError ? (
        <div role="alert" className="rounded-lg border border-terracotta-300 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700">
          {formError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-teal-800">Title</label>
          <input id="title" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("title")} />
          {errors.title ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.title.message}</p> : null}
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium text-teal-800">Slug</label>
          <input id="slug" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm font-mono outline-none focus-visible:border-terracotta-400" {...register("slug")} />
          {errors.slug ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.slug.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="text-sm font-medium text-teal-800">Excerpt</label>
        <textarea id="excerpt" rows={2} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("excerpt")} />
        {errors.excerpt ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.excerpt.message}</p> : null}
      </div>

      <Controller control={control} name="coverImage" render={({ field }) => (
        <ImageUploadField label="Cover Image" value={field.value} onChange={field.onChange} error={errors.coverImage?.message} />
      )} />

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-teal-800">Content</span>
          <button type="button" onClick={addParagraph} className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:underline">
            <Plus size={13} /> Add Paragraph
          </button>
        </div>
        <div className="mt-2 space-y-2.5">
          {content.map((paragraph, index) => {
            const itemError = errors.content?.[index]?.message;
            return (
              <div key={index}>
                <div className="flex items-start gap-2">
                  <textarea
                    rows={3}
                    value={paragraph}
                    onChange={(e) => updateParagraph(index, e.target.value)}
                    aria-invalid={!!itemError}
                    className="flex-1 rounded-lg border border-teal-700/20 bg-white px-3 py-2 text-sm outline-none focus-visible:border-terracotta-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(index)}
                    disabled={content.length <= 1}
                    className="rounded-full p-1.5 text-teal-700/50 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors disabled:opacity-30"
                    aria-label={`Remove paragraph ${index + 1}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                {itemError ? <p className="mt-1 text-sm text-terracotta-600">{itemError}</p> : null}
              </div>
            );
          })}
        </div>
        {errors.content?.message ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.content.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="author" className="text-sm font-medium text-teal-800">Author</label>
          <input id="author" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("author")} />
        </div>
        <div>
          <label htmlFor="readingTime" className="text-sm font-medium text-teal-800">Reading Time</label>
          <input id="readingTime" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("readingTime")} />
        </div>
        <div>
          <label htmlFor="status" className="text-sm font-medium text-teal-800">Status</label>
          <select id="status" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("status")}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <Controller control={control} name="tags" render={({ field }) => (
        <TagListInput label="Tags" items={field.value} onChange={field.onChange} placeholder="e.g. Safari" error={errors.tags?.message} />
      )} />

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60">
          {submitting ? "Saving..." : originalSlug ? "Save Changes" : "Create Post"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")} className="rounded-full border border-teal-700/20 px-6 py-2.5 text-sm font-semibold text-teal-800 hover:border-teal-700/40 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
