"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

// Form data type for controlled inputs
interface FormData {
  name: string;
  role_company: string;
  message: string;
  avatar_url: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
}

interface FormErrors {
  name?: string;
  role_company?: string;
  message?: string;
  avatar_url?: string;
  rating?: string;
  sort_order?: string;
}

export default function NewTestimonialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    role_company: "",
    message: "",
    avatar_url: "",
    rating: 5,
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
      case "name":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "Name is required";
        }
        if (typeof value === "string" && value.length > 100) {
          return "Name must be less than 100 characters";
        }
        break;
      case "role_company":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "Role/Company is required";
        }
        if (typeof value === "string" && value.length > 150) {
          return "Role/Company must be less than 150 characters";
        }
        break;
      case "message":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "Message is required";
        }
        if (typeof value === "string" && value.length > 1000) {
          return "Message must be less than 1000 characters";
        }
        break;
      case "avatar_url":
        if (typeof value === "string" && value.trim() !== "") {
          try {
            new URL(value);
          } catch {
            return "Please enter a valid URL";
          }
        }
        break;
      case "rating":
        if (typeof value === "number" && (value < 1 || value > 5)) {
          return "Rating must be between 1 and 5";
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
      name: validateField("name", formData.name),
      role_company: validateField("role_company", formData.role_company),
      message: validateField("message", formData.message),
      avatar_url: validateField("avatar_url", formData.avatar_url),
      rating: validateField("rating", formData.rating),
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

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      role_company: true,
      message: true,
      avatar_url: true,
      rating: true,
      sort_order: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("testimonials").insert({
        name: formData.name,
        role_company: formData.role_company,
        message: formData.message,
        avatar_url: formData.avatar_url || null,
        rating: formData.rating,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
      });

      if (error) {
        console.error("Error creating testimonial:", error);
        toast.error("Failed to create testimonial. Please try again.");
        return;
      }

      toast.success("Testimonial created successfully!");
      router.push("/admin/testimonials");
    } catch (error) {
      console.error("Error creating testimonial:", error);
      toast.error("Failed to create testimonial. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.role_company.trim() !== "" &&
    formData.message.trim() !== "";

  return (
    <div className="px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <Link href="/admin/testimonials">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Testimonials
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Testimonial
        </h1>
      </div>

      {/* Form Card */}
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur("name")}
                placeholder="e.g., John Doe"
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`h-11 ${
                  errors.name
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                    : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                }`}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Role/Company Field */}
            <div className="space-y-2">
              <Label
                htmlFor="role_company"
                className="text-sm font-medium text-gray-700"
              >
                Role / Company <span className="text-red-500">*</span>
              </Label>
              <Input
                id="role_company"
                name="role_company"
                type="text"
                value={formData.role_company}
                onChange={handleInputChange}
                onBlur={() => handleBlur("role_company")}
                placeholder="e.g., CEO at Acme Inc."
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.role_company}
                aria-describedby={
                  errors.role_company ? "role_company-error" : undefined
                }
                className={`h-11 ${
                  errors.role_company
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                    : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                }`}
              />
              {errors.role_company && (
                <p id="role_company-error" className="text-sm text-red-500">
                  {errors.role_company}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="text-sm font-medium text-gray-700"
              >
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onBlur={() => handleBlur("message")}
                placeholder="What did they say about your service?"
                rows={4}
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={`resize-none ${
                  errors.message
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                    : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                }`}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-red-500">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Avatar URL Field */}
            <div className="space-y-2">
              <Label
                htmlFor="avatar_url"
                className="text-sm font-medium text-gray-700"
              >
                Avatar URL
              </Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                type="text"
                value={formData.avatar_url}
                onChange={handleInputChange}
                onBlur={() => handleBlur("avatar_url")}
                placeholder="https://example.com/avatar.jpg"
                disabled={isSubmitting}
                aria-invalid={!!errors.avatar_url}
                aria-describedby={
                  errors.avatar_url ? "avatar_url-error" : "avatar_url-helper"
                }
                className={`h-11 ${
                  errors.avatar_url
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                    : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                }`}
              />
              {errors.avatar_url ? (
                <p id="avatar_url-error" className="text-sm text-red-500">
                  {errors.avatar_url}
                </p>
              ) : (
                <p id="avatar_url-helper" className="text-sm text-gray-500">
                  URL to the person&apos;s profile picture
                </p>
              )}
            </div>

            {/* Rating Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Rating <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    disabled={isSubmitting}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {formData.rating} / 5
                </span>
              </div>
              {errors.rating && (
                <p className="text-sm text-red-500">{errors.rating}</p>
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
                    This testimonial will be visible on the public site
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
                <Link href="/admin/testimonials">Cancel</Link>
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
                  "Create Testimonial"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
