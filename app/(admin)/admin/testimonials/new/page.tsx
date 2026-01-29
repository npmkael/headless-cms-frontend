"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Star } from "lucide-react";
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

// Zod schema for form validation
const testimonialSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  role_company: z
    .string()
    .min(1, "Role/Company is required")
    .max(150, "Role/Company must be less than 150 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
  avatar_url: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || isValidUrl(val),
      "Please enter a valid URL"
    ),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_active: z.boolean(),
});

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export default function NewTestimonialPage() {
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      role_company: "",
      message: "",
      avatar_url: "",
      rating: 5,
      sort_order: 0,
      is_active: true,
    },
  });

  const isActive = watch("is_active");
  const rating = watch("rating");

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      const { error } = await supabase.from("testimonials").insert({
        name: data.name,
        role_company: data.role_company,
        message: data.message,
        avatar_url: data.avatar_url || null,
        rating: data.rating,
        sort_order: data.sort_order,
        is_active: data.is_active,
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
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                type="text"
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
                {...register("name")}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-500">
                  {errors.name.message}
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
                type="text"
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
                {...register("role_company")}
              />
              {errors.role_company && (
                <p id="role_company-error" className="text-sm text-red-500">
                  {errors.role_company.message}
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
                {...register("message")}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-red-500">
                  {errors.message.message}
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
                type="text"
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
                {...register("avatar_url")}
              />
              {errors.avatar_url ? (
                <p id="avatar_url-error" className="text-sm text-red-500">
                  {errors.avatar_url.message}
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
                    onClick={() => setValue("rating", star)}
                    disabled={isSubmitting}
                    className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (rating as number)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {rating as number} / 5
                </span>
              </div>
              {errors.rating && (
                <p className="text-sm text-red-500">{errors.rating.message}</p>
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
                type="number"
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
                {...register("sort_order")}
              />
              {errors.sort_order ? (
                <p className="text-sm text-red-500">
                  {errors.sort_order.message}
                </p>
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
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    setValue("is_active", checked === true)
                  }
                  disabled={isSubmitting}
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
                disabled={isSubmitting || !isValid}
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
