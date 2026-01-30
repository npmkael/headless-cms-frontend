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
  Users,
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
export type TeamMember = Tables<"team_members">;

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

export function TeamMembersEditor({
  initialTeamMembers,
}: {
  initialTeamMembers: TeamMember[];
}) {
  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>(initialTeamMembers);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialTeamMembers[0]?.id || null
  );
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previousSelectedId, setPreviousSelectedId] = useState<string | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  // Form state for selected team member
  const [formData, setFormData] = useState<Partial<TeamMember>>({});

  const selectedMember = teamMembers.find((m) => m.id === selectedId);

  // Map team members to sidebar items
  const sidebarItems: CrudSidebarItem[] = teamMembers.map((member) => ({
    id: member.id,
    title: member.name,
    description: member.role,
    imageUrl: member.avatar_url,
    isActive: member.is_active,
  }));

  // Load form data when selection changes
  useEffect(() => {
    if (isCreateMode || isEditMode) {
      // Don't update form data when in create or edit mode
      return;
    }
    if (selectedMember) {
      setFormData({
        name: selectedMember.name,
        role: selectedMember.role,
        avatar_url: selectedMember.avatar_url,
        socials_json: selectedMember.socials_json,
        sort_order: selectedMember.sort_order,
        is_active: selectedMember.is_active,
      });
    }
  }, [selectedId, selectedMember, isCreateMode, isEditMode]);

  // Handle form field changes (only allowed in edit or create mode)
  const handleFieldChange = (
    field: keyof TeamMember,
    value: string | number | boolean | null
  ) => {
    if (!isEditMode && !isCreateMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Enter edit mode
  const handleStartEdit = () => {
    setIsEditMode(true);
  };

  // Save edits to existing team member
  const handleSaveEdit = async () => {
    if (!selectedId) return;

    if (!formData.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.role?.trim()) {
      toast.error("Role is required");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("team_members")
      .update({
        name: formData.name.trim(),
        role: formData.role.trim(),
        avatar_url: formData.avatar_url || null,
        socials_json: formData.socials_json || null,
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
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === selectedId
            ? {
                ...m,
                name: formData.name!.trim(),
                role: formData.role!.trim(),
                avatar_url: formData.avatar_url || null,
                socials_json: formData.socials_json || null,
                sort_order: formData.sort_order ?? 0,
                is_active: formData.is_active ?? false,
                updated_at: new Date().toISOString(),
              }
            : m
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
    if (selectedMember) {
      setFormData({
        name: selectedMember.name,
        role: selectedMember.role,
        avatar_url: selectedMember.avatar_url,
        socials_json: selectedMember.socials_json,
        sort_order: selectedMember.sort_order,
        is_active: selectedMember.is_active,
      });
    }
    setIsEditMode(false);
  };

  // Enter create mode for new team member
  const handleCreateNew = () => {
    setPreviousSelectedId(selectedId);
    setSelectedId(null);
    setIsCreateMode(true);
    setFormData({
      name: "",
      role: "",
      avatar_url: null,
      socials_json: null,
      sort_order: teamMembers.length,
      is_active: false,
    });
  };

  // Save new team member to database
  const handleSaveNew = async () => {
    if (!formData.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.role?.trim()) {
      toast.error("Role is required");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    const newMember = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      avatar_url: formData.avatar_url || null,
      socials_json: formData.socials_json || null,
      sort_order: formData.sort_order ?? teamMembers.length,
      is_active: formData.is_active ?? false,
    };

    const { data, error } = await supabase
      .from("team_members")
      .insert(newMember)
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error("Failed to create team member");
    } else if (data) {
      setTeamMembers((prev) => [...prev, data]);
      setSelectedId(data.id);
      setIsCreateMode(false);
      setPreviousSelectedId(null);
      toast.success("Team member created successfully");
    }

    setIsSaving(false);
  };

  // Cancel create mode
  const handleCancelCreate = () => {
    setIsCreateMode(false);
    setSelectedId(previousSelectedId || teamMembers[0]?.id || null);
    setPreviousSelectedId(null);
    setFormData({});
  };

  // Delete team member
  const handleDelete = (member: TeamMember) => {
    setDeleteTarget(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      console.error(error);
      toast.error("Failed to delete team member");
    } else {
      const updatedMembers = teamMembers.filter(
        (m) => m.id !== deleteTarget.id
      );
      setTeamMembers(updatedMembers);

      // Select another member if we deleted the currently selected one
      if (selectedId === deleteTarget.id) {
        setSelectedId(updatedMembers[0]?.id || null);
      }

      toast.success("Team member deleted successfully");
    }

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // Handle selecting a member on mobile
  const handleSelectMember = (memberId: string) => {
    if (isCreateMode) {
      if (formData.name || formData.role) {
        if (!confirm("Discard unsaved changes?")) return;
      }
      setIsCreateMode(false);
      setPreviousSelectedId(null);
    }

    if (isEditMode) {
      if (!confirm("Discard unsaved changes?")) return;
      setIsEditMode(false);
    }

    setSelectedId(memberId);
    setShowDetailOnMobile(true);
  };

  // Handle back button on mobile
  const handleBackToList = () => {
    if (isCreateMode) {
      if (formData.name || formData.role) {
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
      {/* Left Sidebar - Team Member List */}
      <CrudSidebar
        title="Team Members"
        searchPlaceholder="Search members..."
        emptyText="No team members found"
        newItemTitle="New Member"
        newItemDescription="Enter role..."
        items={sidebarItems}
        selectedId={selectedId}
        isCreateMode={isCreateMode}
        showDetailOnMobile={showDetailOnMobile}
        formTitle={formData.name || ""}
        formDescription={formData.role || ""}
        onSelectItem={handleSelectMember}
        onCreateNew={handleCreateNewMobile}
        renderFallbackIcon={() => <Users className="h-5 w-5 text-gray-400" />}
      />

      {/* Right Panel - Edit Form */}
      <div
        className={`flex-1 flex flex-col overflow-hidden min-h-0 ${
          showDetailOnMobile ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedMember || isCreateMode ? (
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
                    ? formData.name || "New Member"
                    : formData.name || selectedMember?.name}
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
                        selectedMember && handleDelete(selectedMember)
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
                    placeholder="Enter team member name"
                    disabled={!isEditMode && !isCreateMode}
                  />
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-sm font-medium text-gray-700"
                  >
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={formData.role || ""}
                    onChange={(e) => handleFieldChange("role", e.target.value)}
                    className={`h-10 ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    placeholder="Enter role (e.g., CEO, Designer)"
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
                    URL to the team member&apos;s profile photo
                  </p>
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
                    value={formData.socials_json || ""}
                    onChange={(e) =>
                      handleFieldChange("socials_json", e.target.value)
                    }
                    rows={4}
                    placeholder='{"twitter": "https://twitter.com/...", "linkedin": "https://linkedin.com/..."}'
                    className={`resize-none font-mono text-sm ${
                      !isEditMode && !isCreateMode ? "bg-gray-50" : ""
                    }`}
                    disabled={!isEditMode && !isCreateMode}
                  />
                  <p className="text-xs text-gray-500">
                    JSON object with social media links (twitter, linkedin,
                    github, etc.)
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
                      Make this team member visible on the public site
                    </p>
                  </div>
                </div>

                {/* Timestamps - only show for existing members */}
                {!isCreateMode && selectedMember && (
                  <div className="pt-5 sm:pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Created:</span>
                        <span className="ml-2 text-gray-700">
                          {selectedMember.created_at
                            ? new Date(
                                selectedMember.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last updated:</span>
                        <span className="ml-2 text-gray-700">
                          {selectedMember.updated_at
                            ? formatTimeAgo(selectedMember.updated_at)
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
          // Empty state when no member is selected
          <div className="flex flex-1 flex-col items-center justify-center p-4">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" />
            <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900 text-center">
              No team member selected
            </h3>
            <p className="mt-1 text-sm text-gray-500 text-center">
              Select a team member from the list or create a new one
            </p>
            <Button
              onClick={handleCreateNewMobile}
              className="mt-4 bg-black hover:bg-gray-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
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
