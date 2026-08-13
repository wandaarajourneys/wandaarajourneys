import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTestimonialForAdmin } from "@/lib/admin/actions/testimonials";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata: Metadata = { title: "Edit Testimonial" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonialForAdmin(id).catch(() => null);
  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">Edit Testimonial</h1>
      <div className="mt-6">
        <TestimonialForm id={testimonial.id} initial={testimonial} />
      </div>
    </div>
  );
}
