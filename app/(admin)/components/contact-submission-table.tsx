"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Mail, Inbox, Archive, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { toast } from "sonner";
import type { Tables } from "@/lib/database.types";
import { updateContactSubmissionStatus } from "../actions";

// Types
export type ContactSubmission = Tables<"contact_submissions">;

type StatusFilter = "all" | "new" | "read" | "archived";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  read: "bg-gray-100 text-gray-700 border-gray-200",
  archived: "bg-amber-100 text-amber-700 border-amber-200",
};

const statusLabels: Record<string, string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
};

export function ContactSubmissionsTable({
  initialSubmissions,
}: {
  initialSubmissions: ContactSubmission[];
}) {
  const [submissions, setSubmissions] =
    useState<ContactSubmission[]>(initialSubmissions);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Filter submissions by status
  const filteredSubmissions =
    statusFilter === "all"
      ? submissions
      : submissions.filter((s) => s.status === statusFilter);

  // Calculate stats
  const totalSubmissions = submissions.length;
  const newSubmissions = submissions.filter((s) => s.status === "new").length;
  const readSubmissions = submissions.filter((s) => s.status === "read").length;
  const archivedSubmissions = submissions.filter(
    (s) => s.status === "archived"
  ).length;

  // View submission details
  const handleViewDetails = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailDialogOpen(true);

    // Mark as read if it's new
    if (submission.status === "new") {
      await updateStatus(submission.id, "read");
    }
  };

  // Update submission status
  const updateStatus = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(id);

    try {
      const { error } = await updateContactSubmissionStatus(id, newStatus);

      if (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status");
        return;
      }

      // Update local state
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );

      // Update selected submission if it's the one being updated
      if (selectedSubmission?.id === id) {
        setSelectedSubmission((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }

      toast.success(`Status updated to ${statusLabels[newStatus]}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  // Get status badge
  const getStatusBadge = (status: string | null) => {
    const normalizedStatus = status || "new";
    return (
      <Badge
        variant="outline"
        className={`${statusColors[normalizedStatus] || statusColors.new} px-2`}
      >
        {statusLabels[normalizedStatus] || "New"}
      </Badge>
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Contact Submissions
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage contact form submissions
          </p>
        </div>
        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Submissions</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {totalSubmissions}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Total Submissions
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold tabular-nums text-blue-600 @[250px]/card:text-5xl">
              {newSubmissions}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              New (Unread)
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {readSubmissions}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Read
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {archivedSubmissions}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Archived
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Data Table */}
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Message
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Date
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((submission) => (
              <TableRow
                key={submission.id}
                className={`transition-colors hover:bg-gray-50 ${
                  submission.status === "new" ? "bg-blue-50/30" : ""
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {submission.status === "new" && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    <span
                      className={`font-medium ${
                        submission.status === "new"
                          ? "text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {submission.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {submission.email}
                  </a>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p
                    className="truncate text-gray-500"
                    title={submission.message}
                  >
                    {submission.message}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatDate(submission.created_at)}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(submission.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleViewDetails(submission)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                          size="icon"
                          disabled={isUpdatingStatus === submission.id}
                        >
                          {isUpdatingStatus === submission.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <IconDotsVertical />
                          )}
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        {submission.status !== "new" && (
                          <DropdownMenuItem
                            onClick={() => updateStatus(submission.id, "new")}
                          >
                            <Inbox className="mr-2 h-4 w-4" />
                            Mark as New
                          </DropdownMenuItem>
                        )}
                        {submission.status !== "read" && (
                          <DropdownMenuItem
                            onClick={() => updateStatus(submission.id, "read")}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Mark as Read
                          </DropdownMenuItem>
                        )}
                        {submission.status !== "archived" && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(submission.id, "archived")
                            }
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {filteredSubmissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              {statusFilter === "all"
                ? "No submissions yet"
                : `No ${statusFilter} submissions`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === "all"
                ? "Contact form submissions will appear here."
                : "Try selecting a different status filter."}
            </p>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Submission
            </DialogTitle>
            <DialogDescription>
              Received {formatDate(selectedSubmission?.created_at ?? null)}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Status
                </span>
                {getStatusBadge(selectedSubmission.status)}
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="mt-1 text-gray-900">{selectedSubmission.name}</p>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1">
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Message
                </label>
                <p className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-gray-900">
                  {selectedSubmission.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t pt-4">
                {selectedSubmission.status !== "new" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus(selectedSubmission.id, "new")}
                    disabled={isUpdatingStatus === selectedSubmission.id}
                  >
                    <Inbox className="mr-2 h-4 w-4" />
                    Mark as New
                  </Button>
                )}
                {selectedSubmission.status !== "read" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus(selectedSubmission.id, "read")}
                    disabled={isUpdatingStatus === selectedSubmission.id}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Mark as Read
                  </Button>
                )}
                {selectedSubmission.status !== "archived" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateStatus(selectedSubmission.id, "archived")
                    }
                    disabled={isUpdatingStatus === selectedSubmission.id}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
