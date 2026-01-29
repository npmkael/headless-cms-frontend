"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, MessageSquareQuote, Loader2, Star } from "lucide-react";
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
export type Testimonial = Tables<"testimonials">;

export function TestimonialsTable({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Calculate stats
  const totalTestimonials = testimonials.length;
  const activeTestimonials = testimonials.filter((t) => t.is_active).length;
  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + (t.rating ?? 0), 0) /
          testimonials.filter((t) => t.rating !== null).length
        ).toFixed(1)
      : "0";

  // Handle delete
  const handleDelete = (testimonial: Testimonial) => {
    setDeleteTarget(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      console.error(error);
      toast.error("Failed to delete testimonial");
    } else {
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
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

  // Render stars for rating
  const renderRating = (rating: number | null) => {
    if (rating === null) return <span className="text-gray-400">-</span>;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage customer testimonials
          </p>
        </div>
        <Button asChild className="bg-black">
          <Link href="/admin/testimonials/new">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {totalTestimonials}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Total Testimonials
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {activeTestimonials}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Active Testimonials
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {averageRating}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Average Rating
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
                Author
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Message
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Rating
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
            {testimonials.map((testimonial) => (
              <TableRow
                key={testimonial.id}
                className="transition-colors hover:bg-gray-50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar_url ? (
                      <Image
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.role_company}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p
                    className="truncate text-gray-500"
                    title={testimonial.message}
                  >
                    {testimonial.message}
                  </p>
                </TableCell>
                <TableCell>{renderRating(testimonial.rating)}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {testimonial.sort_order}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-muted-foreground px-1.5"
                  >
                    {testimonial.is_active ? "Active" : "Inactive"}
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
                        <Link
                          href={`/admin/testimonials/${testimonial.id}/edit`}
                        >
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(testimonial)}
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
        {testimonials.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquareQuote className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No testimonials
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new testimonial.
            </p>
            <Button asChild className="mt-4 bg-indigo-600 hover:bg-indigo-700">
              <Link href="/admin/testimonials/new">
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Link>
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
    </>
  );
}
