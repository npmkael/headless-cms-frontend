"use client";

import { useState } from "react";
import Link from "next/link";
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
  description: string;
  step_no: number;
  sort_order: number;
  is_active: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  step_no?: string;
  sort_order?: string;
}

// Type for Supabase insert
type WorkingProcessInsert = TablesInsert<"working_processes">;

export default function NewWorkingProcessPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    step_no: 1,
    sort_order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      case "description":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "Description is required";
        }
        if (typeof value === "string" && value.length > 500) {
          return "Description must be less than 500 characters";
        }
        break;
      case "step_no":
        if (typeof value === "number" && value < 1) {
          return "Step number must be at least 1";
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
      description: validateField("description", formData.description),
      step_no: validateField("step_no", formData.step_no),
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
      description: true,
      step_no: true,
      sort_order: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("working_processes").insert({
        title: formData.title,
        description: formData.description,
        step_no: formData.step_no,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      });

      if (error) {
        console.error("Error creating working process:", error);
        toast.error("Failed to create working process. Please try again.");
        return;
      }

      toast.success("Working process created successfully!");
      router.push("/admin/working-processes");
    } catch (error) {
      console.error("Error creating working process:", error);
      toast.error("Failed to create working process. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title.trim() !== "" && formData.description.trim() !== "";

  return (
    <div className="px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <Link href="/admin/working-processes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Working Processes
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Working Process
        </h1>
      </div>

      {/* Form Card */}
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step Number Field */}
            <div className="space-y-2">
              <Label
                htmlFor="step_no"
                className="text-sm font-medium text-gray-700"
              >
                Step Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="step_no"
                name="step_no"
                type="number"
                value={formData.step_no}
                onChange={handleInputChange}
                onBlur={() => handleBlur("step_no")}
                min={1}
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.step_no}
                aria-describedby="step_no-helper"
                className={`h-11 w-32 ${
                  errors.step_no
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                    : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                }`}
              />
              {errors.step_no ? (
                <p className="text-sm text-red-500">{errors.step_no}</p>
              ) : (
                <p id="step_no-helper" className="text-sm text-gray-500">
                  The step number displayed to users (e.g., Step 1, Step 2)
                </p>
              )}
            </div>

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
                placeholder="e.g., Discovery & Research"
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

            {/* Description Field */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={() => handleBlur("description")}
                placeholder="Describe this step in your process..."
                rows={4}
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                className={`resize-none ${
                  errors.description
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                    : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                }`}
              />
              {errors.description && (
                <p id="description-error" className="text-sm text-red-500">
                  {errors.description}
                </p>
              )}
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
                  Lower numbers appear first in the list
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
                    This process step will be visible on the public site
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
                <Link href="/admin/working-processes">Cancel</Link>
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
                  "Create Process"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
