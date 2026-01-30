"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/lib/database.types";

type Testimonial = Tables<"testimonials">;
type ContactSubmission = Tables<"contact_submissions">;

export async function uploadImage(
  file: File,
  bucket: string = "cms-images",
): Promise<{ url: string | null; error: string | null }> {
  try {
    console.log("[uploadImage] Starting upload to bucket:", bucket);
    console.log("[uploadImage] File name:", file.name);
    console.log("[uploadImage] File size:", file.size);
    console.log("[uploadImage] File type:", file.type);

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = fileName;

    console.log("[uploadImage] Generated file path:", filePath);

    // Convert File to ArrayBuffer then to Buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("[uploadImage] Buffer size:", buffer.length);

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("[uploadImage] Supabase storage error:", error);
      console.error(
        "[uploadImage] Error details:",
        JSON.stringify(error, null, 2),
      );
      return { url: null, error: `Storage error: ${error.message}` };
    }

    if (!data) {
      console.error("[uploadImage] No data returned from upload");
      return { url: null, error: "No data returned from upload" };
    }

    console.log("[uploadImage] Upload successful, path:", data.path);

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path);

    console.log("[uploadImage] Public URL:", publicUrl);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("[uploadImage] Caught exception:", error);
    return {
      url: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteImageFromStorage(
  url: string,
  bucket: string = "service-icons",
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

export async function updateContactSubmissionStatus(
  id: string,
  status: string,
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
