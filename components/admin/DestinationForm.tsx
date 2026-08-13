"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { destinationSchema, type DestinationInput } from "@/lib/validation/admin/destination";
import { regionOptions, activityOptions } from "@/lib/enumMap";
import { createDestination, updateDestination } from "@/lib/admin/actions/destinations";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { GalleryField } from "@/components/admin/GalleryField";
import { TagListInput } from "@/components/admin/TagListInput";

const regions = regionOptions();
const activities = activityOptions();

export function DestinationForm({ id, initial }: { id?: string; initial?: DestinationInput }) {
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
  } = useForm<DestinationInput>({
    resolver: zodResolver(destinationSchema),
    defaultValues: initial ?? {
      slug: "",
      name: "",
      country: "",
      region: "Coast",
      activityTypes: [],
      tagline: "",
      description: "",
      heroImage: "",
      gallery: [],
      highlights: [],
      bestTimeToVisit: "",
    },
  });

  const selectedActivities = watch("activityTypes");

  async function onSubmit(data: DestinationInput) {
    setSubmitting(true);
    setFormError(null);
    const result = id ? await updateDestination(id, data) : await createDestination(data);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error);
      return;
    }
    toast.success(id ? "Destination updated." : "Destination created.");
    router.push("/admin/destinations");
    router.refresh();
  }

  function toggleActivity(activity: string) {
    const set = new Set(selectedActivities);
    if (set.has(activity as (typeof activities)[number])) set.delete(activity as (typeof activities)[number]);
    else set.add(activity as (typeof activities)[number]);
    setValue("activityTypes", Array.from(set), { shouldValidate: true });
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
          <label htmlFor="name" className="text-sm font-medium text-teal-800">Name</label>
          <input
            id="name"
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
            {...register("name")}
          />
          {errors.name ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium text-teal-800">Slug</label>
          <input
            id="slug"
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm font-mono outline-none focus-visible:border-terracotta-400"
            {...register("slug")}
          />
          {errors.slug ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.slug.message}</p> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="country" className="text-sm font-medium text-teal-800">Country</label>
          <input
            id="country"
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
            {...register("country")}
          />
          {errors.country ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.country.message}</p> : null}
        </div>
        <div>
          <label htmlFor="region" className="text-sm font-medium text-teal-800">Region</label>
          <select
            id="region"
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
            {...register("region")}
          >
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-teal-800">Activity Types</span>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {activities.map((activity) => (
            <button
              type="button"
              key={activity}
              onClick={() => toggleActivity(activity)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedActivities?.includes(activity)
                  ? "bg-teal-700 text-white"
                  : "bg-sand-100 text-teal-800 hover:bg-sand-200"
              }`}
            >
              {activity}
            </button>
          ))}
        </div>
        {errors.activityTypes ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.activityTypes.message}</p> : null}
      </div>

      <div>
        <label htmlFor="tagline" className="text-sm font-medium text-teal-800">Tagline</label>
        <input
          id="tagline"
          className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          {...register("tagline")}
        />
        {errors.tagline ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.tagline.message}</p> : null}
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-teal-800">Description</label>
        <textarea
          id="description"
          rows={5}
          className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          {...register("description")}
        />
        {errors.description ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.description.message}</p> : null}
      </div>

      <div>
        <label htmlFor="bestTimeToVisit" className="text-sm font-medium text-teal-800">Best Time to Visit</label>
        <input
          id="bestTimeToVisit"
          className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          {...register("bestTimeToVisit")}
        />
        {errors.bestTimeToVisit ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.bestTimeToVisit.message}</p> : null}
      </div>

      <Controller
        control={control}
        name="heroImage"
        render={({ field }) => (
          <ImageUploadField label="Hero Image" value={field.value} onChange={field.onChange} error={errors.heroImage?.message} />
        )}
      />

      <Controller
        control={control}
        name="gallery"
        render={({ field }) => (
          <GalleryField label="Gallery" images={field.value} onChange={field.onChange} error={errors.gallery?.message} />
        )}
      />

      <Controller
        control={control}
        name="highlights"
        render={({ field }) => (
          <TagListInput
            label="Highlights"
            items={field.value}
            onChange={field.onChange}
            placeholder="e.g. Big Five game drives at dawn and dusk"
            error={errors.highlights?.message}
          />
        )}
      />

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving..." : id ? "Save Changes" : "Create Destination"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/destinations")}
          className="rounded-full border border-teal-700/20 px-6 py-2.5 text-sm font-semibold text-teal-800 hover:border-teal-700/40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
