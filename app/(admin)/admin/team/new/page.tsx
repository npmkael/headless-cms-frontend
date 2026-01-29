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

// Form data type for controlled inputs
interface FormData {
  name: string;
  role: string;
  avatar_url: string;
  socials_json: string;
  sort_order: number;
  is_active: boolean;
}

interface FormErrors {
  name?: string;
  role?: string;
  avatar_url?: string;
  socials_json?: string;
  sort_order?: string;
}

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    role: "",
    avatar_url: "",
    socials_json: "",
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
      case "role":
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return "Role is required";
        }
        if (typeof value === "string" && value.length > 100) {
          return "Role must be less than 100 characters";
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
      case "socials_json":
        if (typeof value === "string" && value.trim() !== "") {
          try {
            JSON.parse(value);
          } catch {
            return "Please enter valid JSON";
          }
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
      role: validateField("role", formData.role),
      avatar_url: validateField("avatar_url", formData.avatar_url),
      socials_json: validateField("socials_json", formData.socials_json),
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
      name: true,
      role: true,
      avatar_url: true,
      socials_json: true,
      sort_order: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("team_members").insert({
        name: formData.name,
        role: formData.role,
        avatar_url: formData.avatar_url || null,
        socials_json: formData.socials_json || null,
        sort_order: formData.sort_order,
        is_active: formData.is_active,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" && formData.role.trim() !== "";

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
                name="role"
                type="text"
                value={formData.role}
                onChange={handleInputChange}
                onBlur={() => handleBlur("role")}
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
              />
              {errors.role && (
                <p id="role-error" className="text-sm text-red-500">
                  {errors.role}
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
                name="socials_json"
                value={formData.socials_json}
                onChange={handleInputChange}
                onBlur={() => handleBlur("socials_json")}
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
              />
              {errors.socials_json ? (
                <p id="socials_json-error" className="text-sm text-red-500">
                  {errors.socials_json}
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
                disabled={isSubmitting || !isFormValid}
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
