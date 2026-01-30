"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/lib/database.types";

type WorkingProcess = Tables<"working_processes">;

export async function createWorkingProcess(data: {
  title: string;
  description: string;
  step_no: number;
  sort_order: number;
  is_active: boolean;
}): Promise<{ data: WorkingProcess | null; error: string | null }> {
  const { data: process, error } = await supabaseAdmin
    .from("working_processes")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Error creating working process:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/admin/working-processes");
  revalidatePath("/");
  return { data: process, error: null };
}

export async function updateWorkingProcess(
  id: string,
  data: {
    title: string;
    description: string;
    step_no: number;
    sort_order: number;
    is_active: boolean;
  }
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("working_processes")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating working process:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/working-processes");
  revalidatePath("/");
  return { error: null };
}

export async function deleteWorkingProcess(
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("working_processes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting working process:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/working-processes");
  revalidatePath("/");
  return { error: null };
}
