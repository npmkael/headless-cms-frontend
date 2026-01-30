"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronLeft,
  MessageSquareQuote,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import type { Tables } from "@/lib/database.types";
import { CrudSidebar, type CrudSidebarItem } from "./crud-sidebar";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../actions";

// Types
export type Testimonial = Tables<"testimonials">;

function formatTimeAgo(date: string | null): string {
  if (!date) return "";
  const now = new Date();
  const updated = new Date(date);
  const diffMs = now.getTime() - updated.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// Star Rating Component
function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number | null;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => !disabled && setHoverValue(star)}
          onMouseLeave={() => setHoverValue(null)}
          className={`p-0.5 transition-colors ${
            disabled ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              (hoverValue !== null ? star <= hoverValue : star <= (value ?? 0))
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
      {value !== null && (
        <span className="ml-2 text-sm text-gray-500">{value}/5</span>
      )}
    </div>
  );
}

export function TestimonialsEditor({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialTestimonials[0]?.id || null
  );
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previousSelectedId, setPreviousSelectedId] = useState<string | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  // Form state for selected testimonial
  const [formData, setFormData] = useState<Partial<Testimonial>>({});

  const selectedTestimonial = testimonials.find((t) => t.id === selectedId);

  // Map testimonials to sidebar items
  const sidebarItems: CrudSidebarItem[] = testimonials.map((testimonial) => ({
    id: testimonial.id,
    title: testimonial.name,
    description: testimonial.role_company,
    imageUrl: testimonial.avatar_url,
    isActive: testimonial.is_active,
  }));

  // Load form data when selection changes
  useEffect(() => {
    if (isCreateMode || isEditMode) {
      // Don't update form data when in create or edit mode
      return;
    }
    if (selectedTestimonial) {
      setFormData({
        name: selectedTestimonial.name,
        role_company: selectedTestimonial.role_company,
        message: selectedTestimonial.message,
        avatar_url: selectedTestimonial.avatar_url,
        rating: selectedTestimonial.rating,
        sort_order: selectedTestimonial.sort_order,
        is_active: selectedTestimonial.is_active,
      });
    }
  }, [selectedId, selectedTestimonial, isCreateMode, isEditMode]);

  // Handle form field changes (only allowed in edit or create mode)
  const handleFieldChange = (
    field: keyof Testimonial,
    value: string | number | boolean | null
  ) => {
    if (!isEditMode && !isCreateMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Enter edit mode
  const handleStartEdit = () => {
    setIsEditMode(true);
  };

  // Save edits to existing testimonial
  const handleSaveEdit = async () => {
    if (!selectedId) return;

    if (!formData.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.role_company?.trim()) {
      toast.error("Role/Company is required");
      return;
    }
    if (!formData.message?.trim()) {
      toast.error("Message is required");
      return;
    }

    setIsSaving(true);

    const { error } = await updateTestimonial(selectedId, {
      name: formData.name.trim(),
      role_company: formData.role_company.trim(),
      message: formData.message.trim(),
      avatar_url: formData.avatar_url || null,
      rating: formData.rating ?? null,
      sort_order: formData.sort_order ?? 0,
      is_active: formData.is_active ?? false,
    });

    if (error) {
      console.error(error);
      toast.error("Failed to save changes");
    } else {
      // Update local state
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === selectedId
            ? {
                ...t,
                name: formData.name!.trim(),
                role_company: formData.role_company!.trim(),
                message: formData.message!.trim(),
                avatar_url: formData.avatar_url || null,
                rating: formData.rating ?? null,
                sort_order: formData.sort_order ?? 0,
                is_active: formData.is_active ?? false,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );
      setIsEditMode(false);
      toast.success("Changes saved successfully");
    }

    setIsSaving(false);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    // Restore original data
    if (selectedTestimonial) {
      setFormData({
        name: selectedTestimonial.name,
        role_company: selectedTestimonial.role_company,
        message: selectedTestimonial.message,
        avatar_url: selectedTestimonial.avatar_url,
        rating: selectedTestimonial.rating,
        sort_order: selectedTestimonial.sort_order,
        is_active: selectedTestimonial.is_active,
      });
    }
    setIsEditMode(false);
  };

  // Enter create mode for new testimonial
  const handleCreateNew = () => {
    setPreviousSelectedId(selectedId);
    setSelectedId(null);
    setIsCreateMode(true);
    setFormData({
      name: "",
      role_company: "",
      message: "",
      avatar_url: null,
      rating: 5,
      sort_order: testimonials.length,
      is_active: false,
    });
  };

  // Save new testimonial to database
  const handleSaveNew = async () => {
    if (!formData.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.role_company?.trim()) {
      toast.error("Role/Company is required");
      return;
    }
    if (!formData.message?.trim()) {
      toast.error("Message is required");
      return;
    }

    setIsSaving(true);

    const { data, error } = await createTestimonial({
      name: formData.name.trim(),
      role_company: formData.role_company.trim(),
      message: formData.message.trim(),
      avatar_url: formData.avatar_url || null,
      rating: formData.rating ?? null,
      sort_order: formData.sort_order ?? testimonials.length,
      is_active: formData.is_active ?? false,
    });

    if (error) {
      console.error(error);
      toast.error("Failed to create testimonial");
    } else if (data) {
      setTestimonials((prev) => [...prev, data]);
      setSelectedId(data.id);
      setIsCreateMode(false);
      setPreviousSelectedId(null);
      toast.success("Testimonial created successfully");
    }

    setIsSaving(false);
  };

  // Cancel create mode
  const handleCancelCreate = () => {
    setIsCreateMode(false);
    setSelectedId(previousSelectedId || testimonials[0]?.id || null);
    setPreviousSelectedId(null);
    setFormData({});
  };

  // Delete testimonial
  const handleDelete = (testimonial: Testimonial) => {
    setDeleteTarget(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    const { error } = await deleteTestimonial(deleteTarget.id);

    if (error) {
      console.error(error);
      toast.error("Failed to delete testimonial");
    } else {
      const updatedTestimonials = testimonials.filter(
        (t) => t.id !== deleteTarget.id
      );
      setTestimonials(updatedTestimonials);

      // Select another testimonial if we deleted the currently selected one
      if (selectedId === deleteTarget.id) {
        setSelectedId(updatedTestimonials[0]?.id || null);
      }

      toast.success("Testimonial deleted successfully");
    }

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // Handle selecting a testimonial on mobile
  const handleSelectTestimonial = (testimonialId: string) => {
    if (isCreateMode) {
      if (formData.name || formData.message) {
        if (!confirm("Discard unsaved changes?")) return;
      }
      setIsCreateMode(false);
      setPreviousSelectedId(null);
    }

    if (isEditMode) {
      if (!confirm("Discard unsaved changes?")) return;
      setIsEditMode(false);
    }

    setSelectedId(testimonialId);
    setShowDetailOnMobile(true);
  };

  // Handle back button on mobile
  const handleBackToList = () => {
    if (isCreateMode) {
      if (formData.name || formData.message) {
        if (!confirm("Discard unsaved changes?")) return;
      }
      handleCancelCreate();
    }

    if (isEditMode) {
      if (!confirm("Discard unsaved changes?")) return;
      setIsEditMode(false);
    }

    setShowDetailOnMobile(false);
  };

  // Handle create new on mobile
  const handleCreateNewMobile = () => {
    handleCreateNew();
    setShowDetailOnMobile(true);
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-white">
      {/* Left Sidebar - Testimonial List */}
      <CrudSidebar
        title="Testimonials"
        searchPlaceholder="Search testimonials..."
        emptyText="No testimonials found"
        newItemTitle="New Testimonial"
        newItemDescription="Enter details..."
        items={sidebarItems}
        selectedId={selectedId}
        isCreateMode={isCreateMode}
        showDetailOnMobile={showDetailOnMobile}
        formTitle={formData.name || ""}
        formDescription={formData.role_company || ""}
        onSelectItem={handleSelectTestimonial}
        onCreateNew={handleCreateNewMobile}
        renderFallbackIcon={() => (
          <MessageSquareQuote className="h-5 w-5 text-gray-400" />
        )}
      />

      {/* Right Panel - Edit Form */}
      <div
        className={`flex-1 flex flex-col overflow-hidden min-h-0 ${
          showDetailOnMobile ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedTestimonial || isCreateMode ? (
          <>
            {/* Header with title and status */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-3">
                {/* Back button - mobile only */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:hidden shrink-0"
                  onClick={handleBackToList}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  {isCreateMode
                    ? formData.name || "New Testimonial"
                    : formData.name || selectedTestimonial?.name}
                </h1>
                {isCreateMode ? (
                  <Badge
                    variant="outline"
                    className="border-blue-300 text-blue-700 shrink-0"
                  >
                    NEW
                  </Badge>
                ) : formData.is_active ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 shrink-0">
                    PUBLISHED
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="shrink-0">
                    DRAFT
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 sm:gap-4 ml-11 md:ml-0">
                {isCreateMode ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelCreate}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                      onClick={handleSaveNew}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </>
                ) : isEditMode ? (
                  // Edit mode buttons
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  // View mode buttons
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStartEdit}
                      className="flex-1 sm:flex-none"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                      onClick={() =>
                        selectedTestimonial && handleDelete(selectedTestimonial)
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="max-w-2xl space-y-5 sm:space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className={`h-10 ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    placeholder="Enter customer name"
                    disabled={!isEditMode && !isCreateMode}
                  />
                </div>

                {/* Role/Company Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="role_company"
                    className="text-sm font-medium text-gray-700"
                  >
                    Role / Company
                  </Label>
                  <Input
                    id="role_company"
                    value={formData.role_company || ""}
                    onChange={(e) =>
                      handleFieldChange("role_company", e.target.value)
                    }
                    className={`h-10 ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    placeholder="e.g., CEO at Acme Corp"
                    disabled={!isEditMode && !isCreateMode}
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700"
                  >
                    Testimonial Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message || ""}
                    onChange={(e) =>
                      handleFieldChange("message", e.target.value)
                    }
                    rows={4}
                    maxLength={250}
                    placeholder="Enter the testimonial message"
                    className={`resize-none ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    disabled={!isEditMode && !isCreateMode}
                  />

                  <span className="text-xs text-gray-500">
                    {formData.message?.length || 0} / 250 characters
                  </span>
                </div>

                {/* Rating Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Rating
                  </Label>
                  <StarRating
                    value={formData.rating ?? null}
                    onChange={(rating) => handleFieldChange("rating", rating)}
                    disabled={!isEditMode && !isCreateMode}
                  />
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
                    value={formData.avatar_url || ""}
                    onChange={(e) =>
                      handleFieldChange("avatar_url", e.target.value)
                    }
                    className={`h-10 ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    placeholder="https://example.com/avatar.jpg"
                    disabled={!isEditMode && !isCreateMode}
                  />
                  <p className="text-xs text-gray-500">
                    URL to the customer&apos;s profile photo
                  </p>
                </div>

                {/* Sort Order */}
                <div className="space-y-2">
                  <Label
                    htmlFor="sort_order"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sort Order
                  </Label>
                  <Input
                    id="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order || 0}
                    onChange={(e) =>
                      handleFieldChange(
                        "sort_order",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className={`h-10 w-32 ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    disabled={!isEditMode && !isCreateMode}
                  />
                  <p className="text-xs text-gray-500">
                    Lower numbers appear first in the list
                  </p>
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active ?? false}
                    onCheckedChange={(checked) =>
                      handleFieldChange("is_active", checked === true)
                    }
                    disabled={!isEditMode && !isCreateMode}
                  />
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="is_active"
                      className={`text-sm font-medium text-gray-700 ${
                        isEditMode || isCreateMode
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      Published
                    </Label>
                    <p className="text-xs text-gray-500">
                      Make this testimonial visible on the public site
                    </p>
                  </div>
                </div>

                {/* Timestamps - only show for existing testimonials */}
                {!isCreateMode && selectedTestimonial && (
                  <div className="pt-5 sm:pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 text-gray-700">
                          {selectedTestimonial.created_at
                            ? new Date(
                                selectedTestimonial.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last updated:</span>
                        <span className="ml-2 text-gray-700">
                          {selectedTestimonial.updated_at
                            ? formatTimeAgo(selectedTestimonial.updated_at)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Empty state when no testimonial is selected
          <div className="flex flex-1 flex-col items-center justify-center p-4">
            <MessageSquareQuote className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
            <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900 text-center">
              No testimonial selected
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center">
              Select a testimonial from the list or create a new one
            </p>
            <Button
              onClick={handleCreateNewMobile}
              className="mt-4 bg-black hover:bg-gray-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the testimonial from &quot;
              {deleteTarget?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
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
    </div>
  );
}
