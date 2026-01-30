"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/lib/database.types";

type TeamMember = Tables<"team_members">;

export async function createTeamMember(data: {
  name: string;
  role: string;
  avatar_url: string | null;
  socials_json: string | null;
  sort_order: number;
  is_active: boolean;
}): Promise<{ data: TeamMember | null; error: string | null }> {
  const { data: member, error } = await supabaseAdmin
    .from("team_members")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("Error creating team member:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/admin/team-members");
  revalidatePath("/");
  return { data: member, error: null };
}

export async function updateTeamMember(
  id: string,
  data: {
    name: string;
    role: string;
    avatar_url: string | null;
    socials_json: string | null;
    sort_order: number;
    is_active: boolean;
  },
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("team_members")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating team member:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/team-members");
  revalidatePath("/");
  return { error: null };
}

export async function deleteTeamMember(
  id: string,
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("team_members")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting team member:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/team-members");
  revalidatePath("/");
  return { error: null };
}
