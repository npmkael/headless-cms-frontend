"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  FileText,
  Loader2,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronLeft,
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

// Types
export type Service = Tables<"services">;

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

export function ServicesEditor({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialServices[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previousSelectedId, setPreviousSelectedId] = useState<string | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  // Form state for selected service
  const [formData, setFormData] = useState<Partial<Service>>({});

  const selectedService = services.find((s) => s.id === selectedId);

  // Filter services by search
  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load form data when selection changes
  useEffect(() => {
    if (isCreateMode || isEditMode) {
      // Don't update form data when in create or edit mode
      return;
    }
    if (selectedService) {
      setFormData({
        title: selectedService.title,
        description: selectedService.description,
        icon_url: selectedService.icon_url,
        sort_order: selectedService.sort_order,
        is_active: selectedService.is_active,
      });
      setImageError(false);
    }
  }, [selectedId, selectedService, isCreateMode, isEditMode]);

  // Handle form field changes (only allowed in edit or create mode)
  const handleFieldChange = (
    field: keyof Service,
    value: string | number | boolean | null
  ) => {
    if (!isEditMode && !isCreateMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Enter edit mode
  const handleStartEdit = () => {
    setIsEditMode(true);
  };

  // Save edits to existing service
  const handleSaveEdit = async () => {
    if (!selectedId) return;

    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Description is required");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("services")
      .update({
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon_url: formData.icon_url || null,
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
      setServices((prev) =>
        prev.map((s) =>
          s.id === selectedId
            ? {
                ...s,
                title: formData.title!.trim(),
                description: formData.description!.trim(),
                icon_url: formData.icon_url || null,
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
    if (selectedService) {
      setFormData({
        title: selectedService.title,
        description: selectedService.description,
        icon_url: selectedService.icon_url,
        sort_order: selectedService.sort_order,
        is_active: selectedService.is_active,
      });
    }
    setIsEditMode(false);
  };

  // Enter create mode for new service
  const handleCreateNew = () => {
    setPreviousSelectedId(selectedId);
    setSelectedId(null);
    setIsCreateMode(true);
    setFormData({
      title: "",
      description: "",
      icon_url: null,
      sort_order: services.length,
      is_active: false,
    });
    setImageError(false);
  };

  // Save new service to database
  const handleSaveNew = async () => {
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Description is required");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    const newService = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      icon_url: formData.icon_url || null,
      sort_order: formData.sort_order ?? services.length,
      is_active: formData.is_active ?? false,
    };

    const { data, error } = await supabase
      .from("services")
      .insert(newService)
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error("Failed to create service");
    } else if (data) {
      setServices((prev) => [...prev, data]);
      setSelectedId(data.id);
      setIsCreateMode(false);
      setPreviousSelectedId(null);
      toast.success("Service created successfully");
    }

    setIsSaving(false);
  };

  // Cancel create mode
  const handleCancelCreate = () => {
    setIsCreateMode(false);
    setSelectedId(previousSelectedId || services[0]?.id || null);
    setPreviousSelectedId(null);
    setFormData({});
  };

  // Delete service
  const handleDelete = (service: Service) => {
    setDeleteTarget(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      console.error(error);
      toast.error("Failed to delete service");
    } else {
      const updatedServices = services.filter((s) => s.id !== deleteTarget.id);
      setServices(updatedServices);

      // Select another service if we deleted the currently selected one
      if (selectedId === deleteTarget.id) {
        setSelectedId(updatedServices[0]?.id || null);
      }

      toast.success("Service deleted successfully");
    }

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // Handle selecting a service on mobile
  const handleSelectService = (serviceId: string) => {
    if (isCreateMode) {
      if (formData.title || formData.description) {
        if (!confirm("Discard unsaved changes?")) return;
      }
      setIsCreateMode(false);
      setPreviousSelectedId(null);
    }

    if (isEditMode) {
      if (!confirm("Discard unsaved changes?")) return;
      setIsEditMode(false);
    }

    setSelectedId(serviceId);
    setShowDetailOnMobile(true);
  };

  // Handle back button on mobile
  const handleBackToList = () => {
    if (isCreateMode) {
      if (formData.title || formData.description) {
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
      {/* Left Sidebar - Service List */}
      <div
        className={`w-full md:w-80 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col min-h-0 ${
          showDetailOnMobile ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Services</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCreateNewMobile}
            disabled={isCreateMode}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-white"
            />
          </div>
        </div>

        {/* Service List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredServices.length === 0 && !isCreateMode ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FileText className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No services found</p>
            </div>
          ) : (
            <div className="py-1">
              {/* New Service entry when in create mode */}
              {isCreateMode && (
                <div className="w-full flex items-start gap-3 px-4 py-3 text-left bg-blue-50 border-l-2 border-blue-500">
                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-blue-100">
                    <div className="flex h-full w-full items-center justify-center">
                      <Plus className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {formData.title || "New Service"}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {formData.description || "Enter description..."}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                        New
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    // Don't switch if clicking on already selected service (desktop only)
                    if (
                      service.id === selectedId &&
                      !isCreateMode &&
                      showDetailOnMobile
                    )
                      return;
                    handleSelectService(service.id);
                  }}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-100 ${
                    selectedId === service.id && !isCreateMode
                      ? "bg-blue-50 border-l-2 border-blue-500"
                      : "border-l-2 border-transparent"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-200">
                    {service.icon_url ? (
                      <Image
                        src={service.icon_url}
                        alt={service.title}
                        fill
                        className="object-cover"
                        onError={() => {}}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {service.is_active ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Edit Form */}
      <div
        className={`flex-1 flex flex-col overflow-hidden min-h-0 ${
          showDetailOnMobile ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedService || isCreateMode ? (
          <>
            {/* Header with title and status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
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
                    ? formData.title || "New Service"
                    : formData.title || selectedService?.title}
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
                        selectedService && handleDelete(selectedService)
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
                    placeholder="Enter service title"
                    disabled={!isEditMode && !isCreateMode}
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    rows={4}
                    placeholder="Enter service description"
                    className={`resize-none ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    disabled={!isEditMode && !isCreateMode}
                  />
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
                      Make this service visible on the public site
                    </p>
                  </div>
                </div>

                {/* Timestamps - only show for existing services */}
                {!isCreateMode && selectedService && (
                  <div className="pt-5 sm:pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 text-gray-700">
                          {selectedService.created_at
                            ? new Date(
                                selectedService.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last updated:</span>
                        <span className="ml-2 text-gray-700">
                          {selectedService.updated_at
                            ? formatTimeAgo(selectedService.updated_at)
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
          // Empty state when no service is selected
          <div className="flex flex-1 flex-col items-center justify-center p-4">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
            <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900 text-center">
              No service selected
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center">
              Select a service from the list or create a new one
            </p>
            <Button
              onClick={handleCreateNewMobile}
              className="mt-4 bg-black hover:bg-gray-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Service
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
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
