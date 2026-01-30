"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/lib/database.types";

type Testimonial = Tables<"testimonials">;

export async function createTestimonial(data: {
  name: string;
  role_company: string;
  message: string;
  avatar_url: string | null;
  rating: number | null;
  sort_order: number;
  is_active: boolean;
}): Promise<{ data: Testimonial | null; error: string | null }> {
  const { data: testimonial, error } = await supabaseAdmin
    .from("testimonials")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Error creating testimonial:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { data: testimonial, error: null };
}

export async function updateTestimonial(
  id: string,
  data: {
    name: string;
    role_company: string;
    message: string;
    avatar_url: string | null;
    rating: number | null;
    sort_order: number;
    is_active: boolean;
  },
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("testimonials")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating testimonial:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { error: null };
}

export async function deleteTestimonial(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting testimonial:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { error: null };
}
