"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";

// Team Member type from database
type TeamMember = Tables<"team_members">;

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

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
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

  // Fetch team member data
  useEffect(() => {
    const fetchTeamMember = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("id", memberId)
          .single();

        if (error) {
          console.error("Error fetching team member:", error);
          toast.error("Failed to load team member data");
          router.push("/admin/team");
          return;
        }

        if (!data) {
          toast.error("Team member not found");
          router.push("/admin/team");
          return;
        }

        setTeamMember(data);
        setFormData({
          name: data.name,
          role: data.role,
          avatar_url: data.avatar_url || "",
          socials_json: data.socials_json || "",
          sort_order: data.sort_order,
          is_active: data.is_active ?? true,
        });
      } catch (error) {
        console.error("Error fetching team member:", error);
        toast.error("Failed to load team member data");
        router.push("/admin/team");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMember();
  }, [memberId, router, supabase]);

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
      const { error } = await supabase
        .from("team_members")
        .update({
          name: formData.name,
          role: formData.role,
          avatar_url: formData.avatar_url || null,
          socials_json: formData.socials_json || null,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", memberId);

      if (error) {
        console.error("Error updating team member:", error);
        toast.error("Failed to update team member. Please try again.");
        return;
      }

      toast.success("Team member updated successfully!");
      router.push("/admin/team");
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);

      if (error) {
        console.error("Error deleting team member:", error);
        toast.error("Failed to delete team member. Please try again.");
        setIsDeleteDialogOpen(false);
        return;
      }

      toast.success("Team member deleted successfully!");
      router.push("/admin/team");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member. Please try again.");
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" && formData.role.trim() !== "";

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
            <Link href="/admin/team">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Team Member</h1>
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm text-gray-500">Loading team member...</p>
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
            <Link href="/admin/team">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Team Member</h1>
          {teamMember && (
            <p className="mt-1 text-sm text-gray-500">
              Editing: {teamMember.name}
            </p>
          )}
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
                  disabled={isSubmitting || isDeleting}
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
                  disabled={isSubmitting || isDeleting}
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
                  disabled={isSubmitting || isDeleting}
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
                  disabled={isSubmitting || isDeleting}
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
                      This team member will be visible on the public site
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
                  onClick={() => setIsDeleteDialogOpen(true)}
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
                    <Link href="/admin/team">Cancel</Link>
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
                      "Update Team Member"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{teamMember?.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
