"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/lib/database.types";

type CaseStudy = Tables<"case_studies">;

export async function createCaseStudy(data: {
  title: string;
  short_description: string;
  cover_image_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}): Promise<{ data: CaseStudy | null; error: string | null }> {
  const { data: caseStudy, error } = await supabaseAdmin
    .from("case_studies")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Error creating case study:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/admin/case-studies");
  revalidatePath("/");
  return { data: caseStudy, error: null };
}

export async function updateCaseStudy(
  id: string,
  data: {
    title: string;
    short_description: string;
    cover_image_url: string | null;
    link_url: string | null;
    sort_order: number;
    is_active: boolean;
  },
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("case_studies")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating case study:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/case-studies");
  revalidatePath("/");
  return { error: null };
}

export async function deleteCaseStudy(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("case_studies")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting case study:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/case-studies");
  revalidatePath("/");
  return { error: null };
}
