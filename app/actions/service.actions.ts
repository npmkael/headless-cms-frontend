"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/lib/database.types";

type Service = Tables<"services">;

export async function createService(data: {
  title: string;
  description: string;
  icon_url: string | null;
  sort_order: number;
  is_active: boolean;
}): Promise<{ data: Service | null; error: string | null }> {
  const { data: service, error } = await supabaseAdmin
    .from("services")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Error creating service:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  return { data: service, error: null };
}

export async function updateService(
  id: string,
  data: {
    title: string;
    description: string;
    icon_url: string | null;
    sort_order: number;
    is_active: boolean;
  },
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("services")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating service:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  return { error: null };
}

export async function deleteService(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin.from("services").delete().eq("id", id);

  if (error) {
    console.error("Error deleting service:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/");
  return { error: null };
}
