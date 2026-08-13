import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata: Metadata = { title: "New Testimonial" };

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">New Testimonial</h1>
      <div className="mt-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
