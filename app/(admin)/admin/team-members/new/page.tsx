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

// Helper function to validate URL
function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Helper function to validate JSON
function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Zod schema for form validation
const teamMemberSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  role: z
    .string()
    .min(1, "Role is required")
    .max(100, "Role must be less than 100 characters"),
  avatar_url: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || isValidUrl(val),
      "Please enter a valid URL"
    ),
  socials_json: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || isValidJson(val),
      "Please enter valid JSON"
    ),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
  is_active: z.boolean(),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

export default function NewTeamMemberPage() {
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      avatar_url: "",
      socials_json: "",
      sort_order: 0,
      is_active: true,
    },
    mode: "onBlur",
  });

  const isActive = watch("is_active");

  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      const { error } = await supabase.from("team_members").insert({
        name: data.name,
        role: data.role,
        avatar_url: data.avatar_url || null,
        socials_json: data.socials_json || null,
        sort_order: data.sort_order,
        is_active: data.is_active,
      });

      if (error) {
        console.error("Error creating team member:", error);
        toast.error("Failed to create team member. Please try again.");
        return;
      }

      toast.success("Team member created successfully!");
      router.push("/admin/team");
    } catch (error) {
      console.error("Error creating team member:", error);
      toast.error("Failed to create team member. Please try again.");
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
          <Link href="/admin/team">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Team Member
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

            {/* Role Field */}
            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="role"
                type="text"
                placeholder="e.g., Senior Developer"
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "role-error" : undefined}
                className={`h-11 ${
                  errors.role
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                    : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                }`}
                {...register("role")}
              />
              {errors.role && (
                <p id="role-error" className="text-sm text-red-500">
                  {errors.role.message}
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
                  URL to the team member&apos;s profile picture
                </p>
              )}
            </div>

            {/* Socials JSON Field */}
            <div className="space-y-2">
              <Label
                htmlFor="socials_json"
                className="text-sm font-medium text-gray-700"
              >
                Social Links (JSON)
              </Label>
              <Textarea
                id="socials_json"
                placeholder='{"linkedin": "https://linkedin.com/in/...", "twitter": "https://twitter.com/..."}'
                rows={3}
                disabled={isSubmitting}
                aria-invalid={!!errors.socials_json}
                aria-describedby={
                  errors.socials_json
                    ? "socials_json-error"
                    : "socials_json-helper"
                }
                className={`resize-none ${
                  errors.socials_json
                    ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                    : "border-gray-200 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                }`}
                {...register("socials_json")}
              />
              {errors.socials_json ? (
                <p id="socials_json-error" className="text-sm text-red-500">
                  {errors.socials_json.message}
                </p>
              ) : (
                <p id="socials_json-helper" className="text-sm text-gray-500">
                  JSON object with social media links
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
                    This team member will be visible on the public site
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
                <Link href="/admin/team">Cancel</Link>
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
                  "Create Team Member"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
