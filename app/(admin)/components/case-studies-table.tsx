"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Loader2 } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/lib/database.types";

// Types
export type CaseStudy = Tables<"case_studies">;

export function CaseStudiesTable({
  initialCaseStudies,
}: {
  initialCaseStudies: CaseStudy[];
}) {
  const [caseStudies, setCaseStudies] =
    useState<CaseStudy[]>(initialCaseStudies);
  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Calculate stats
  const totalCaseStudies = caseStudies.length;
  const activeCaseStudies = caseStudies.filter((s) => s.is_active).length;
  const inactiveCaseStudies = caseStudies.filter((s) => !s.is_active).length;

  // Handle delete
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
      setCaseStudies((prev) => prev.filter((s) => s.id !== deleteTarget.id));
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

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Studies</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your case studies</p>
        </div>
        <Button asChild className="bg-black">
          <Link href="/admin/case-studies/new">
            <Plus className="h-4 w-4" />
            Add Case Study
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {totalCaseStudies}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Total Case Studies
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {activeCaseStudies}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Active Case Studies
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {inactiveCaseStudies}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Inactive Case Studies
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
                Title
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Short Description
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Sort Order
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
            {caseStudies.map((caseStudy) => (
              <TableRow
                key={caseStudy.id}
                className="transition-colors hover:bg-gray-50"
              >
                <TableCell className="font-semibold text-gray-900">
                  {caseStudy.title}
                </TableCell>
                <TableCell className="max-w-xs">
                  <p
                    className="truncate text-gray-500"
                    title={caseStudy.short_description ?? ""}
                  >
                    {caseStudy.short_description}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {caseStudy.sort_order}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-muted-foreground px-1.5"
                  >
                    {caseStudy.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                      >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/case-studies/${caseStudy.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(caseStudy)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {caseStudies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No case studies
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new case study.
            </p>
            <Button asChild className="mt-4 bg-indigo-600 hover:bg-indigo-700">
              <Link href="/admin/case-studies/new">
                <Plus className="h-4 w-4" />
                Add Case Study
              </Link>
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
    </>
  );
}
