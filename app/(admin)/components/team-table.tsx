"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Users, Loader2 } from "lucide-react";
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
export type TeamMember = Tables<"team_members">;

export function TeamTable({
  initialTeamMembers,
}: {
  initialTeamMembers: TeamMember[];
}) {
  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>(initialTeamMembers);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Calculate stats
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter((m) => m.is_active).length;
  const inactiveMembers = teamMembers.filter((m) => !m.is_active).length;

  // Handle delete
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
      setTeamMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
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

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your team members</p>
        </div>
        <Button asChild className="bg-black">
          <Link href="/admin/team/new">
            <Plus className="h-4 w-4" />
            Add Team Member
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {totalMembers}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Total Members
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {activeMembers}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Active Members
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {inactiveMembers}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Inactive Members
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
                Member
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Role
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
            {teamMembers.map((member) => (
              <TableRow
                key={member.id}
                className="transition-colors hover:bg-gray-50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {member.avatar_url ? (
                      <Image
                        src={member.avatar_url}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold text-gray-900">
                      {member.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{member.role}</TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {member.sort_order}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-muted-foreground px-1.5"
                  >
                    {member.is_active ? "Active" : "Inactive"}
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
                        <Link href={`/admin/team/${member.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(member)}
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
        {teamMembers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No team members
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new team member.
            </p>
            <Button asChild className="mt-4 bg-indigo-600 hover:bg-indigo-700">
              <Link href="/admin/team/new">
                <Plus className="h-4 w-4" />
                Add Team Member
              </Link>
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
    </>
  );
}
