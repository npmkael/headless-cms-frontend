"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Tables, TablesUpdate } from "@/lib/database.types";

// Case Study type from database
type CaseStudy = Tables<"case_studies">;
type CaseStudyUpdate = TablesUpdate<"case_studies">;

// Form data type for controlled inputs
interface FormData {
  title: string;
  short_description: string;
  cover_image_url: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
}

interface FormErrors {
  title?: string;
  short_description?: string;
  sort_order?: string;
}

export default function EditCaseStudyPage() {
  const router = useRouter();
  const params = useParams();
  const caseStudyId = params.id as string;

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    short_description: "",
    cover_image_url: "",
    link_url: "",
    sort_order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState(false);

  // Modal refs for accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const supabase = createClient();

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
        setFormData({
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
  }, [caseStudyId, router, supabase]);

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

  const validateField = (
    name: keyof FormData,
    value: string | number | boolean
  ): string | undefined => {
    switch (name) {
      case "title":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "Title is required";
        }
        if (typeof value === "string" && value.length > 100) {
          return "Title must be less than 100 characters";
        }
        break;
      case "short_description":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "Short description is required";
        }
        if (typeof value === "string" && value.length > 500) {
          return "Short description must be less than 500 characters";
        }
        break;
      case "sort_order":
        if (typeof value === "number" && value < 0) {
          return "Sort order must be 0 or greater";
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      title: validateField("title", formData.title),
      short_description: validateField(
        "short_description",
        formData.short_description
      ),
      sort_order: validateField("sort_order", formData.sort_order),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? parseInt(value) || 0 : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Reset image error when URL changes
    if (name === "cover_image_url") {
      setImageError(false);
    }

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name as keyof FormData, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const value = formData[name as keyof FormData];
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      short_description: true,
      sort_order: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("case_studies")
        .update({
          title: formData.title,
          short_description: formData.short_description,
          cover_image_url: formData.cover_image_url || null,
          link_url: formData.link_url || null,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
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
    } finally {
      setIsSubmitting(false);
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

  const isFormValid =
    formData.title.trim() !== "" && formData.short_description.trim() !== "";

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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("title")}
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
                />
                {errors.title && (
                  <p id="title-error" className="text-sm text-red-500">
                    {errors.title}
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
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("short_description")}
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
                />
                {errors.short_description && (
                  <p
                    id="short_description-error"
                    className="text-sm text-red-500"
                  >
                    {errors.short_description}
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
                  name="cover_image_url"
                  type="text"
                  value={formData.cover_image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={isSubmitting || isDeleting}
                  className="h-11 border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                />
                <p className="text-sm text-gray-500">
                  Optional: URL to case study cover image
                </p>
                {/* Image Preview */}
                {formData.cover_image_url && !imageError && (
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      Preview:
                    </p>
                    <div className="relative inline-block overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2">
                      <Image
                        src={formData.cover_image_url}
                        alt="Cover preview"
                        width={200}
                        height={120}
                        className="h-30 w-50 object-cover rounded"
                        onError={() => setImageError(true)}
                        unoptimized
                      />
                    </div>
                  </div>
                )}
                {formData.cover_image_url && imageError && (
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
                  name="link_url"
                  type="text"
                  value={formData.link_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/case-study"
                  disabled={isSubmitting || isDeleting}
                  className="h-11 border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
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
                  name="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("sort_order")}
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
                />
                {errors.sort_order ? (
                  <p className="text-sm text-red-500">{errors.sort_order}</p>
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
                    checked={formData.is_active}
                    onCheckedChange={handleCheckboxChange}
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
                    disabled={isSubmitting || isDeleting || !isFormValid}
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
