"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronLeft,
  Image as ImageIcon,
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
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/lib/database.types";
import { CrudSidebar, type CrudSidebarItem } from "./crud-sidebar";

// Types
export type CaseStudy = Tables<"case_studies">;

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

export function CaseStudiesEditor({
  initialCaseStudies,
}: {
  initialCaseStudies: CaseStudy[];
}) {
  const [caseStudies, setCaseStudies] =
    useState<CaseStudy[]>(initialCaseStudies);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialCaseStudies[0]?.id || null
  );
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previousSelectedId, setPreviousSelectedId] = useState<string | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  // Form state for selected case study
  const [formData, setFormData] = useState<Partial<CaseStudy>>({});

  const selectedCaseStudy = caseStudies.find((s) => s.id === selectedId);

  // Map case studies to sidebar items
  const sidebarItems: CrudSidebarItem[] = caseStudies.map((caseStudy) => ({
    id: caseStudy.id,
    title: caseStudy.title,
    description: caseStudy.short_description,
    imageUrl: caseStudy.cover_image_url,
    isActive: caseStudy.is_active,
  }));

  // Load form data when selection changes
  useEffect(() => {
    if (isCreateMode || isEditMode) {
      // Don't update form data when in create or edit mode
      return;
    }
    if (selectedCaseStudy) {
      setFormData({
        title: selectedCaseStudy.title,
        short_description: selectedCaseStudy.short_description,
        cover_image_url: selectedCaseStudy.cover_image_url,
        link_url: selectedCaseStudy.link_url,
        sort_order: selectedCaseStudy.sort_order,
        is_active: selectedCaseStudy.is_active,
      });
    }
  }, [selectedId, selectedCaseStudy, isCreateMode, isEditMode]);

  // Handle form field changes (only allowed in edit or create mode)
  const handleFieldChange = (
    field: keyof CaseStudy,
    value: string | number | boolean | null
  ) => {
    if (!isEditMode && !isCreateMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Enter edit mode
  const handleStartEdit = () => {
    setIsEditMode(true);
  };

  // Save edits to existing case study
  const handleSaveEdit = async () => {
    if (!selectedId) return;

    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.short_description?.trim()) {
      toast.error("Short description is required");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("case_studies")
      .update({
        title: formData.title.trim(),
        short_description: formData.short_description.trim(),
        cover_image_url: formData.cover_image_url || null,
        link_url: formData.link_url || null,
        sort_order: formData.sort_order ?? 0,
        is_active: formData.is_active ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedId);

    if (error) {
      console.error(error);
      toast.error("Failed to save changes");
    } else {
      // Update local state
      setCaseStudies((prev) =>
        prev.map((s) =>
          s.id === selectedId
            ? {
                ...s,
                title: formData.title!.trim(),
                short_description: formData.short_description!.trim(),
                cover_image_url: formData.cover_image_url || null,
                link_url: formData.link_url || null,
                sort_order: formData.sort_order ?? 0,
                is_active: formData.is_active ?? false,
                updated_at: new Date().toISOString(),
              }
            : s
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
    if (selectedCaseStudy) {
      setFormData({
        title: selectedCaseStudy.title,
        short_description: selectedCaseStudy.short_description,
        cover_image_url: selectedCaseStudy.cover_image_url,
        link_url: selectedCaseStudy.link_url,
        sort_order: selectedCaseStudy.sort_order,
        is_active: selectedCaseStudy.is_active,
      });
    }
    setIsEditMode(false);
  };

  // Enter create mode for new case study
  const handleCreateNew = () => {
    setPreviousSelectedId(selectedId);
    setSelectedId(null);
    setIsCreateMode(true);
    setFormData({
      title: "",
      short_description: "",
      cover_image_url: null,
      link_url: null,
      sort_order: caseStudies.length,
      is_active: false,
    });
  };

  // Save new case study to database
  const handleSaveNew = async () => {
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.short_description?.trim()) {
      toast.error("Short description is required");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    const newCaseStudy = {
      title: formData.title.trim(),
      short_description: formData.short_description.trim(),
      cover_image_url: formData.cover_image_url || null,
      link_url: formData.link_url || null,
      sort_order: formData.sort_order ?? caseStudies.length,
      is_active: formData.is_active ?? false,
    };

    const { data, error } = await supabase
      .from("case_studies")
      .insert(newCaseStudy)
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error("Failed to create case study");
    } else if (data) {
      setCaseStudies((prev) => [...prev, data]);
      setSelectedId(data.id);
      setIsCreateMode(false);
      setPreviousSelectedId(null);
      toast.success("Case study created successfully");
    }

    setIsSaving(false);
  };

  // Cancel create mode
  const handleCancelCreate = () => {
    setIsCreateMode(false);
    setSelectedId(previousSelectedId || caseStudies[0]?.id || null);
    setPreviousSelectedId(null);
    setFormData({});
  };

  // Delete case study
  const handleDelete = (caseStudy: CaseStudy) => {
    setDeleteTarget(caseStudy);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("case_studies")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      console.error(error);
      toast.error("Failed to delete case study");
    } else {
      const updatedCaseStudies = caseStudies.filter(
        (s) => s.id !== deleteTarget.id
      );
      setCaseStudies(updatedCaseStudies);

      // Select another case study if we deleted the currently selected one
      if (selectedId === deleteTarget.id) {
        setSelectedId(updatedCaseStudies[0]?.id || null);
      }

      toast.success("Case study deleted successfully");
    }

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // Handle selecting a case study on mobile
  const handleSelectCaseStudy = (caseStudyId: string) => {
    if (isCreateMode) {
      if (formData.title || formData.short_description) {
        if (!confirm("Discard unsaved changes?")) return;
      }
      setIsCreateMode(false);
      setPreviousSelectedId(null);
    }

    if (isEditMode) {
      if (!confirm("Discard unsaved changes?")) return;
      setIsEditMode(false);
    }

    setSelectedId(caseStudyId);
    setShowDetailOnMobile(true);
  };

  // Handle back button on mobile
  const handleBackToList = () => {
    if (isCreateMode) {
      if (formData.title || formData.short_description) {
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
      {/* Left Sidebar - Case Study List */}
      <CrudSidebar
        title="Case Studies"
        searchPlaceholder="Search case studies..."
        emptyText="No case studies found"
        newItemTitle="New Case Study"
        newItemDescription="Enter description..."
        items={sidebarItems}
        selectedId={selectedId}
        isCreateMode={isCreateMode}
        showDetailOnMobile={showDetailOnMobile}
        formTitle={formData.title || ""}
        formDescription={formData.short_description || ""}
        onSelectItem={handleSelectCaseStudy}
        onCreateNew={handleCreateNewMobile}
        renderFallbackIcon={() => (
          <ImageIcon className="h-5 w-5 text-gray-400" />
        )}
      />

      {/* Right Panel - Edit Form */}
      <div
        className={`flex-1 flex flex-col overflow-hidden min-h-0 ${
          showDetailOnMobile ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedCaseStudy || isCreateMode ? (
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
                    ? formData.title || "New Case Study"
                    : formData.title || selectedCaseStudy?.title}
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
                        selectedCaseStudy && handleDelete(selectedCaseStudy)
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
                {/* Title Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title || ""}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className={`h-10 ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    placeholder="Enter case study title"
                    disabled={!isEditMode && !isCreateMode}
                  />
                </div>

                {/* Short Description Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="short_description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Short Description
                  </Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description || ""}
                    onChange={(e) =>
                      handleFieldChange("short_description", e.target.value)
                    }
                    rows={3}
                    placeholder="Enter a brief description"
                    className={`resize-none ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    disabled={!isEditMode && !isCreateMode}
                  />
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
                    value={formData.cover_image_url || ""}
                    onChange={(e) =>
                      handleFieldChange("cover_image_url", e.target.value)
                    }
                    className={`h-10 ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    placeholder="https://example.com/image.jpg"
                    disabled={!isEditMode && !isCreateMode}
                  />
                  <p className="text-xs text-gray-500">
                    URL to the cover image for this case study
                  </p>
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
                    value={formData.link_url || ""}
                    onChange={(e) =>
                      handleFieldChange("link_url", e.target.value)
                    }
                    className={`h-10 ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    placeholder="https://example.com/case-study"
                    disabled={!isEditMode && !isCreateMode}
                  />
                  <p className="text-xs text-gray-500">
                    External link to the full case study
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
                      Make this case study visible on the public site
                    </p>
                  </div>
                </div>

                {/* Timestamps - only show for existing case studies */}
                {!isCreateMode && selectedCaseStudy && (
                  <div className="pt-5 sm:pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 text-gray-700">
                          {selectedCaseStudy.created_at
                            ? new Date(
                                selectedCaseStudy.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last updated:</span>
                        <span className="ml-2 text-gray-700">
                          {selectedCaseStudy.updated_at
                            ? formatTimeAgo(selectedCaseStudy.updated_at)
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
          // Empty state when no case study is selected
          <div className="flex flex-1 flex-col items-center justify-center p-4">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
            <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900 text-center">
              No case study selected
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center">
              Select a case study from the list or create a new one
            </p>
            <Button
              onClick={handleCreateNewMobile}
              className="mt-4 bg-black hover:bg-gray-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Case Study
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Case Study</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
              This action cannot be undone.
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
