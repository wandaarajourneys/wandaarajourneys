"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { packageSchema, type PackageInput } from "@/lib/validation/admin/package";
import { activityOptions } from "@/lib/enumMap";
import { createPackage, updatePackage } from "@/lib/admin/actions/packages";
import { listDestinationOptions } from "@/lib/admin/actions/destinations";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { GalleryField } from "@/components/admin/GalleryField";
import { TagListInput } from "@/components/admin/TagListInput";

const activities = activityOptions();
const difficulties = ["Easy", "Moderate", "Challenging"] as const;

const emptyValues: PackageInput = {
  slug: "",
  name: "",
  destinationSlugs: [],
  durationDays: 1,
  durationNights: 0,
  summary: "",
  description: "",
  heroImage: "",
  gallery: [],
  itinerary: [{ day: 1, title: "", description: "" }],
  inclusions: [],
  exclusions: [],
  pricing: { peak: { label: "", perPersonKES: 0 }, offPeak: { label: "", perPersonKES: 0 } },
  groupMinSize: 4,
  groupDiscountPercent: 10,
  difficulty: "Easy",
  activityTypes: [],
  rating: 5,
  reviewCount: 0,
  featured: false,
};

export function PackageForm({ id, initial }: { id?: string; initial?: PackageInput }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [destinationOptions, setDestinationOptions] = useState<{ slug: string; name: string }[]>([]);

  useEffect(() => {
    listDestinationOptions().then(setDestinationOptions);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PackageInput>({
    resolver: zodResolver(packageSchema),
    defaultValues: initial ?? emptyValues,
  });

  const { fields: itineraryFields, append: appendDay, remove: removeDay } = useFieldArray({
    control,
    name: "itinerary",
  });

  const selectedActivities = watch("activityTypes");
  const selectedDestinations = watch("destinationSlugs");

  async function onSubmit(data: PackageInput) {
    setSubmitting(true);
    setFormError(null);
    const result = id ? await updatePackage(id, data) : await createPackage(data);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error);
      return;
    }
    toast.success(id ? "Package updated." : "Package created.");
    router.push("/admin/packages");
    router.refresh();
  }

  function toggleActivity(activity: string) {
    const set = new Set(selectedActivities);
    if (set.has(activity as (typeof activities)[number])) set.delete(activity as (typeof activities)[number]);
    else set.add(activity as (typeof activities)[number]);
    setValue("activityTypes", Array.from(set), { shouldValidate: true });
  }

  function toggleDestination(slug: string) {
    const set = new Set(selectedDestinations);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    setValue("destinationSlugs", Array.from(set), { shouldValidate: true });
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
          <input id="name" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("name")} />
          {errors.name ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium text-teal-800">Slug</label>
          <input id="slug" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm font-mono outline-none focus-visible:border-terracotta-400" {...register("slug")} />
          {errors.slug ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.slug.message}</p> : null}
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-teal-800">Linked Destinations</span>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {destinationOptions.map((d) => (
            <button
              type="button"
              key={d.slug}
              onClick={() => toggleDestination(d.slug)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedDestinations?.includes(d.slug) ? "bg-teal-700 text-white" : "bg-sand-100 text-teal-800 hover:bg-sand-200"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
        {errors.destinationSlugs ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.destinationSlugs.message}</p> : null}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div>
          <label htmlFor="durationDays" className="text-sm font-medium text-teal-800">Days</label>
          <input id="durationDays" type="number" min={1} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("durationDays", { valueAsNumber: true })} />
        </div>
        <div>
          <label htmlFor="durationNights" className="text-sm font-medium text-teal-800">Nights</label>
          <input id="durationNights" type="number" min={0} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("durationNights", { valueAsNumber: true })} />
        </div>
        <div>
          <label htmlFor="difficulty" className="text-sm font-medium text-teal-800">Difficulty</label>
          <select id="difficulty" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("difficulty")}>
            {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm font-medium text-teal-800">
            <input type="checkbox" className="h-4 w-4 rounded border-teal-700/30" {...register("featured")} />
            Featured
          </label>
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
                selectedActivities?.includes(activity) ? "bg-teal-700 text-white" : "bg-sand-100 text-teal-800 hover:bg-sand-200"
              }`}
            >
              {activity}
            </button>
          ))}
        </div>
        {errors.activityTypes ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.activityTypes.message}</p> : null}
      </div>

      <div>
        <label htmlFor="summary" className="text-sm font-medium text-teal-800">Summary</label>
        <input id="summary" className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("summary")} />
        {errors.summary ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.summary.message}</p> : null}
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-teal-800">Description</label>
        <textarea id="description" rows={5} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("description")} />
        {errors.description ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.description.message}</p> : null}
      </div>

      <Controller control={control} name="heroImage" render={({ field }) => (
        <ImageUploadField label="Hero Image" value={field.value} onChange={field.onChange} error={errors.heroImage?.message} />
      )} />

      <Controller control={control} name="gallery" render={({ field }) => (
        <GalleryField label="Gallery" images={field.value} onChange={field.onChange} error={errors.gallery?.message} />
      )} />

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-teal-800">Itinerary</span>
          <button
            type="button"
            onClick={() => appendDay({ day: itineraryFields.length + 1, title: "", description: "" })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:underline"
          >
            <Plus size={13} /> Add Day
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {itineraryFields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-teal-700/10 p-4">
              <div className="flex items-start gap-3">
                <input
                  type="number"
                  min={1}
                  className="w-16 rounded-lg border border-teal-700/20 bg-white px-2 py-2 text-sm text-center outline-none focus-visible:border-terracotta-400"
                  {...register(`itinerary.${index}.day`, { valueAsNumber: true })}
                />
                <div className="flex-1 space-y-2">
                  <input
                    placeholder="Day title"
                    className="w-full rounded-lg border border-teal-700/20 bg-white px-3 py-2 text-sm outline-none focus-visible:border-terracotta-400"
                    {...register(`itinerary.${index}.title`)}
                  />
                  {errors.itinerary?.[index]?.title?.message ? (
                    <p className="text-sm text-terracotta-600">{errors.itinerary[index]?.title?.message}</p>
                  ) : null}
                  <textarea
                    placeholder="Day description"
                    rows={2}
                    className="w-full rounded-lg border border-teal-700/20 bg-white px-3 py-2 text-sm outline-none focus-visible:border-terracotta-400"
                    {...register(`itinerary.${index}.description`)}
                  />
                  {errors.itinerary?.[index]?.description?.message ? (
                    <p className="text-sm text-terracotta-600">{errors.itinerary[index]?.description?.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeDay(index)}
                  disabled={itineraryFields.length <= 1}
                  className="rounded-full p-1.5 text-teal-700/50 hover:bg-terracotta-50 hover:text-terracotta-600 transition-colors disabled:opacity-30"
                  aria-label={`Remove day ${index + 1}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {errors.itinerary?.message ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.itinerary.message}</p> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Controller control={control} name="inclusions" render={({ field }) => (
          <TagListInput label="Inclusions" items={field.value} onChange={field.onChange} placeholder="e.g. All meals" error={errors.inclusions?.message} />
        )} />
        <Controller control={control} name="exclusions" render={({ field }) => (
          <TagListInput label="Exclusions" items={field.value} onChange={field.onChange} placeholder="e.g. International flights" error={errors.exclusions?.message} />
        )} />
      </div>

      <div>
        <span className="text-sm font-medium text-teal-800">Seasonal Pricing</span>
        <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-teal-700/10 p-4 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700/50">Peak Season</p>
            <input placeholder="Label, e.g. Jul–Oct" className="w-full rounded-lg border border-teal-700/20 bg-white px-3 py-2 text-sm outline-none focus-visible:border-terracotta-400" {...register("pricing.peak.label")} />
            <input type="number" min={0} placeholder="Price per person (KES)" className="w-full rounded-lg border border-teal-700/20 bg-white px-3 py-2 text-sm outline-none focus-visible:border-terracotta-400" {...register("pricing.peak.perPersonKES", { valueAsNumber: true })} />
          </div>
          <div className="rounded-lg border border-teal-700/10 p-4 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700/50">Off-Peak Season</p>
            <input placeholder="Label, e.g. Off-Peak" className="w-full rounded-lg border border-teal-700/20 bg-white px-3 py-2 text-sm outline-none focus-visible:border-terracotta-400" {...register("pricing.offPeak.label")} />
            <input type="number" min={0} placeholder="Price per person (KES)" className="w-full rounded-lg border border-teal-700/20 bg-white px-3 py-2 text-sm outline-none focus-visible:border-terracotta-400" {...register("pricing.offPeak.perPersonKES", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div>
          <label htmlFor="groupMinSize" className="text-sm font-medium text-teal-800">Group Min. Size</label>
          <input id="groupMinSize" type="number" min={1} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("groupMinSize", { valueAsNumber: true })} />
        </div>
        <div>
          <label htmlFor="groupDiscountPercent" className="text-sm font-medium text-teal-800">Group Discount %</label>
          <input id="groupDiscountPercent" type="number" min={0} max={90} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("groupDiscountPercent", { valueAsNumber: true })} />
        </div>
        <div>
          <label htmlFor="rating" className="text-sm font-medium text-teal-800">Rating</label>
          <input id="rating" type="number" min={0} max={5} step={0.1} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("rating", { valueAsNumber: true })} />
        </div>
        <div>
          <label htmlFor="reviewCount" className="text-sm font-medium text-teal-800">Review Count</label>
          <input id="reviewCount" type="number" min={0} className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400" {...register("reviewCount", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60">
          {submitting ? "Saving..." : id ? "Save Changes" : "Create Package"}
        </button>
        <button type="button" onClick={() => router.push("/admin/packages")} className="rounded-full border border-teal-700/20 px-6 py-2.5 text-sm font-semibold text-teal-800 hover:border-teal-700/40 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
