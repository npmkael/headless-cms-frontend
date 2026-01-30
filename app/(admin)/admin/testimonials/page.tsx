import { createClient } from "@/lib/supabase/server";
import {
  TestimonialsEditor,
  type Testimonial,
} from "../../components/testimonials-editor";

export default async function TestimonialsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching testimonials:", error);
  }

  const testimonials: Testimonial[] = data ?? [];

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-var(--header-height)-32px)]">
      <TestimonialsEditor initialTestimonials={testimonials} />
    </div>
  );
}
