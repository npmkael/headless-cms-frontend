import { createClient } from "@/lib/supabase/server";
import { TestimonialsTable } from "../../components/testimonials-table";

export default async function TestimonialsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching testimonials:", error);
  }

  const testimonials = data ?? [];

  return (
    <div className="px-4 lg:px-6">
      <TestimonialsTable initialTestimonials={testimonials} />
    </div>
  );
}
