"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/lib/database.types";

// Types
type Service = Tables<"services">;
type CaseStudy = Tables<"case_studies">;
type WorkingProcess = Tables<"working_processes">;
type TeamMember = Tables<"team_members">;
type Testimonial = Tables<"testimonials">;
type ContactSubmission = Tables<"contact_submissions">;

// ============================================================================
// FILE UPLOAD ACTIONS
// ============================================================================

export async function uploadImage(
  file: File,
  bucket: string = "cms-images"
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = fileName;

    // Convert File to ArrayBuffer then to Buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return {
      url: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteImageFromStorage(
  url: string,
  bucket: string = "service-icons"
): Promise<{ error: string | null }> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) {
      return { error: "Invalid URL format" };
    }
    const filePath = urlParts[1];

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Error in deleteImageFromStorage:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// SERVICES ACTIONS
// ============================================================================

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
  }
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
  id: string
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

// ============================================================================
// CASE STUDIES ACTIONS
// ============================================================================

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
  }
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
  id: string
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

// ============================================================================
// WORKING PROCESSES ACTIONS
// ============================================================================

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

// ============================================================================
// TEAM MEMBERS ACTIONS
// ============================================================================

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
  }
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
  id: string
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

// ============================================================================
// TESTIMONIALS ACTIONS
// ============================================================================

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
  }
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
  id: string
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

// ============================================================================
// CONTACT SUBMISSIONS ACTIONS
// ============================================================================

export async function updateContactSubmissionStatus(
  id: string,
  status: string
): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin
    .from("contact_submissions")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating contact submission status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/contact-submissions");
  return { error: null };
}
