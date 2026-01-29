"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { TablesInsert } from "@/lib/database.types";

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

// Type for Supabase insert
type CaseStudyInsert = TablesInsert<"case_studies">;

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const supabase = createClient();

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
      const { error } = await supabase.from("case_studies").insert({
        title: formData.title,
        short_description: formData.short_description,
        cover_image_url: formData.cover_image_url || null,
        link_url: formData.link_url || null,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      });

      if (error) {
        console.error("Error creating case study:", error);
        toast.error("Failed to create case study. Please try again.");
        return;
      }

      toast.success("Case study created successfully!");
      router.push("/admin/case-studies");
    } catch (error) {
      console.error("Error creating case study:", error);
      toast.error("Failed to create case study. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title.trim() !== "" && formData.short_description.trim() !== "";

  return (
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Case Study</h1>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  className="mt-0.5 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="is_active"
                    className="text-sm font-medium text-gray-900 cursor-pointer"
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
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                <Link href="/admin/case-studies">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Case Study"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
