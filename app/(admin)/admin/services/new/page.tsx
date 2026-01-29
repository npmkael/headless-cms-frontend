"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
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
const serviceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  icon_url: z.string().optional(),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_active: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function NewServicePage() {
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      icon_url: "",
      sort_order: 0,
      is_active: true,
    },
    mode: "onBlur",
  });

  const isActive = watch("is_active");

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const { error } = await supabase.from("services").insert({
        title: data.title,
        description: data.description,
        icon_url: data.icon_url || null,
        sort_order: data.sort_order,
        is_active: data.is_active,
      });

      if (error) {
        console.error("Error creating service:", error);
        toast.error("Failed to create service. Please try again.");
        return;
      }

      toast.success("Service created successfully!");
      router.push("/admin/services");
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Failed to create service. Please try again.");
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
          <Link href="/admin/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Service</h1>
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
                placeholder="e.g., Web Development"
                disabled={isSubmitting}
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
                placeholder="Describe your service in detail..."
                rows={5}
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
                {...register("description")}
              />
              {errors.description && (
                <p id="description-error" className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Icon URL Field */}
            <div className="space-y-2">
              <Label
                htmlFor="icon_url"
                className="text-sm font-medium text-gray-700"
              >
                Icon URL
              </Label>
              <Input
                id="icon_url"
                type="text"
                placeholder="https://example.com/icon.png"
                disabled={isSubmitting}
                className="h-11 border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                {...register("icon_url")}
              />
              <p className="text-sm text-gray-500">
                Optional: URL to service icon/image
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
                    This service will be visible on the public site
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
                <Link href="/admin/services">Cancel</Link>
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
                  "Create Service"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
