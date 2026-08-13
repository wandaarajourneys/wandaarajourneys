"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { testimonialSchema, type TestimonialInput } from "@/lib/validation/admin/testimonial";
import { createTestimonial, updateTestimonial } from "@/lib/admin/actions/testimonials";
import { listPackageOptions } from "@/lib/admin/actions/packages";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export function TestimonialForm({ id, initial }: { id?: string; initial?: TestimonialInput }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [packageOptions, setPackageOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    listPackageOptions().then(setPackageOptions);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initial ?? { name: "", location: "", quote: "", rating: 5, photo: "", packageId: "" },
  });

  async function onSubmit(data: TestimonialInput) {
    setSubmitting(true);
    setFormError(null);
    const result = id ? await updateTestimonial(id, data) : await createTestimonial(data);
    setSubmitting(false);
    if (!result.success) {
      setFormError(result.error);
      return;
    }
    toast.success(id ? "Testimonial updated." : "Testimonial created.");
    router.push("/admin/testimonials");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl" noValidate>
      {formError ? (
        <div role="alert" className="rounded-lg border border-terracotta-300 bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700">
          {formError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-teal-800">Name</label>
          <input id="name" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("name")} />
          {errors.name ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="location" className="text-sm font-medium text-teal-800">Location</label>
          <input id="location" placeholder="City, Country" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("location")} />
          {errors.location ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.location.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="quote" className="text-sm font-medium text-teal-800">Quote</label>
        <textarea id="quote" rows={4} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("quote")} />
        {errors.quote ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.quote.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="rating" className="text-sm font-medium text-teal-800">Rating (0–5)</label>
          <input id="rating" type="number" min={0} max={5} step={0.1} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("rating", { valueAsNumber: true })} />
          {errors.rating ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.rating.message}</p> : null}
        </div>
        <div>
          <label htmlFor="packageId" className="text-sm font-medium text-teal-800">Linked Package (optional)</label>
          <select id="packageId" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("packageId")}>
            <option value="">None</option>
            {packageOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Controller
        control={control}
        name="photo"
        render={({ field }) => (
          <ImageUploadField label="Photo (optional)" value={field.value ?? ""} onChange={field.onChange} error={errors.photo?.message} />
        )}
      />

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60">
          {submitting ? "Saving..." : id ? "Save Changes" : "Create Testimonial"}
        </button>
        <button type="button" onClick={() => router.push("/admin/testimonials")} className="rounded-full border border-teal-700/20 px-6 py-2.5 text-sm font-semibold text-teal-800 hover:border-teal-700/40 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
