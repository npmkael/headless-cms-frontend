"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";

// Case Study type from database
type CaseStudy = Tables<"case_studies">;

// Zod schema for form validation
const caseStudySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  short_description: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Short description must be less than 500 characters"),
  cover_image_url: z.string().optional(),
  link_url: z.string().optional(),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_active: z.boolean(),
});

type CaseStudyFormData = z.infer<typeof caseStudySchema>;

export default function EditCaseStudyPage() {
  const router = useRouter();
  const params = useParams();
  const caseStudyId = params.id as string;

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Case study state
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [imageError, setImageError] = useState(false);

  // Modal refs for accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(caseStudySchema),
    defaultValues: {
      title: "",
      short_description: "",
      cover_image_url: "",
      link_url: "",
      sort_order: 0,
      is_active: true,
    },
    mode: "onBlur",
  });

  const isActive = watch("is_active");
  const coverImageUrl = watch("cover_image_url");

  // Reset image error when URL changes
  useEffect(() => {
    setImageError(false);
  }, [coverImageUrl]);

  // Fetch case study data
  useEffect(() => {
    const fetchCaseStudy = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("case_studies")
          .select("*")
          .eq("id", caseStudyId)
          .single();

        if (error) {
          console.error("Error fetching case study:", error);
          toast.error("Failed to load case study data");
          router.push("/admin/case-studies");
          return;
        }

        if (!data) {
          toast.error("Case study not found");
          router.push("/admin/case-studies");
          return;
        }

        setCaseStudy(data);
        reset({
          title: data.title,
          short_description: data.short_description,
          cover_image_url: data.cover_image_url || "",
          link_url: data.link_url || "",
          sort_order: data.sort_order,
          is_active: data.is_active,
        });
      } catch (error) {
        console.error("Error fetching case study:", error);
        toast.error("Failed to load case study data");
        router.push("/admin/case-studies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudy();
  }, [caseStudyId, router, supabase, reset]);

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDeleteModal) {
        setShowDeleteModal(false);
      }
    };

    if (showDeleteModal) {
      document.addEventListener("keydown", handleEscape);
      cancelButtonRef.current?.focus();
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showDeleteModal]);

  // Trap focus within modal
  const handleModalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Tab" && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  const onSubmit = async (data: CaseStudyFormData) => {
    try {
      const { error } = await supabase
        .from("case_studies")
        .update({
          title: data.title,
          short_description: data.short_description,
          cover_image_url: data.cover_image_url || null,
          link_url: data.link_url || null,
          sort_order: data.sort_order,
          is_active: data.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", caseStudyId);

      if (error) {
        console.error("Error updating case study:", error);
        toast.error("Failed to update case study. Please try again.");
        return;
      }

      toast.success("Case study updated successfully!");
      router.push("/admin/case-studies");
    } catch (error) {
      console.error("Error updating case study:", error);
      toast.error("Failed to update case study. Please try again.");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("case_studies")
        .delete()
        .eq("id", caseStudyId);

      if (error) {
        console.error("Error deleting case study:", error);
        toast.error("Failed to delete case study. Please try again.");
        setShowDeleteModal(false);
        return;
      }

      toast.success("Case study deleted successfully!");
      router.push("/admin/case-studies");
    } catch (error) {
      console.error("Error deleting case study:", error);
      toast.error("Failed to delete case study. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <Link href="/admin/case-studies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Case Studies
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Case Study</h1>
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-500">Loading case study...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <Link href="/admin/case-studies">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Case Studies
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Case Study</h1>
          {caseStudy && (
            <p className="mt-1 text-sm text-gray-500">
              Editing: {caseStudy.title}
            </p>
          )}
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., E-commerce Platform Redesign"
                  disabled={isSubmitting || isDeleting}
                  aria-required="true"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  className={`h-11 ${
                    errors.title
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                      : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                  }`}
                  {...register("title")}
                />
                {errors.title && (
                  <p id="title-error" className="text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Short Description Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="short_description"
                  className="text-sm font-medium text-gray-700"
                >
                  Short Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="short_description"
                  placeholder="Brief summary of the case study..."
                  rows={4}
                  disabled={isSubmitting || isDeleting}
                  aria-required="true"
                  aria-invalid={!!errors.short_description}
                  aria-describedby={
                    errors.short_description
                      ? "short_description-error"
                      : undefined
                  }
                  className={`resize-none ${
                    errors.short_description
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                      : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                  }`}
                  {...register("short_description")}
                />
                {errors.short_description && (
                  <p
                    id="short_description-error"
                    className="text-sm text-red-500"
                  >
                    {errors.short_description.message}
                  </p>
                )}
              </div>

              {/* Cover Image URL Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="cover_image_url"
                  className="text-sm font-medium text-gray-700"
                >
                  Cover Image URL
                </Label>
                <Input
                  id="cover_image_url"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  disabled={isSubmitting || isDeleting}
                  className="h-11 border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                  {...register("cover_image_url")}
                />
                <p className="text-sm text-gray-500">
                  Optional: URL to case study cover image
                </p>
                {/* Image Preview */}
                {coverImageUrl && !imageError && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      Preview:
                    </p>
                    <div className="relative inline-block overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
                      <Image
                        src={coverImageUrl}
                        alt="Cover preview"
                        width={200}
                        height={120}
                        className="h-30 w-50 rounded object-cover"
                        onError={() => setImageError(true)}
                        unoptimized
                      />
                    </div>
                  </div>
                )}
                {coverImageUrl && imageError && (
                  <p className="text-sm text-amber-600">
                    Unable to load image preview. Please check the URL.
                  </p>
                )}
              </div>

              {/* Link URL Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="link_url"
                  className="text-sm font-medium text-gray-700"
                >
                  Link URL
                </Label>
                <Input
                  id="link_url"
                  type="text"
                  placeholder="https://example.com/case-study"
                  disabled={isSubmitting || isDeleting}
                  className="h-11 border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                  {...register("link_url")}
                />
                <p className="text-sm text-gray-500">
                  Optional: Link to full case study or external page
                </p>
              </div>

              {/* Sort Order Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="sort_order"
                  className="text-sm font-medium text-gray-700"
                >
                  Sort Order <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sort_order"
                  type="number"
                  min={0}
                  disabled={isSubmitting || isDeleting}
                  aria-required="true"
                  aria-invalid={!!errors.sort_order}
                  aria-describedby="sort_order-helper"
                  className={`h-11 w-32 ${
                    errors.sort_order
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                      : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                  }`}
                  {...register("sort_order")}
                />
                {errors.sort_order ? (
                  <p className="text-sm text-red-500">
                    {errors.sort_order.message}
                  </p>
                ) : (
                  <p id="sort_order-helper" className="text-sm text-gray-500">
                    Lower numbers appear first
                  </p>
                )}
              </div>

              {/* Status Toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={(checked) =>
                      setValue("is_active", checked === true)
                    }
                    disabled={isSubmitting || isDeleting}
                    className="mt-0.5 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="is_active"
                      className="cursor-pointer text-sm font-medium text-gray-900"
                    >
                      Active
                    </Label>
                    <p className="text-sm text-gray-500">
                      This case study will be visible on the public site
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
                {/* Delete Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isSubmitting || isDeleting}
                  className="w-full border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>

                {/* Cancel and Save Buttons */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    disabled={isSubmitting || isDeleting}
                    className="w-full sm:w-auto"
                  >
                    <Link href="/admin/case-studies">Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isDeleting || !isValid}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Case Study"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            ref={modalRef}
            onKeyDown={handleModalKeyDown}
            className="relative z-50 mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center sm:text-left">
              <h3
                id="delete-modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                Delete Case Study?
              </h3>

              <p
                id="delete-modal-description"
                className="mt-2 text-sm text-gray-500"
              >
                Are you sure you want to delete this case study? This action
                cannot be undone.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                ref={cancelButtonRef}
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 sm:w-auto"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Case Study"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
