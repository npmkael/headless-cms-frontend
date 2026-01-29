"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, Pencil, Trash2 } from "lucide-react";
import {
  IconFileText,
  IconCircleCheck,
  IconCircleX,
  IconDotsVertical,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface Service {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
  status: "active" | "inactive";
}

// Mock data
const initialServices: Service[] = [
  {
    id: "1",
    title: "Web Development",
    description:
      "Custom web applications built with modern technologies including React, Next.js, and Node.js for scalable solutions",
    sortOrder: 1,
    status: "active",
  },
  {
    id: "2",
    title: "Mobile Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android using React Native and Flutter",
    sortOrder: 2,
    status: "active",
  },
  {
    id: "3",
    title: "UI/UX Design",
    description:
      "Beautiful interfaces and user experiences crafted with attention to detail and user research",
    sortOrder: 3,
    status: "inactive",
  },
  {
    id: "4",
    title: "Cloud Solutions",
    description:
      "Scalable infrastructure and cloud architecture using AWS, Azure, and Google Cloud Platform",
    sortOrder: 4,
    status: "active",
  },
];

// Delete Confirmation Dialog
function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">Delete Service</h3>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete &quot;{serviceName}&quot;? This action
          cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  // Calculate stats
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status === "active").length;
  const inactiveServices = services.filter(
    (s) => s.status === "inactive"
  ).length;

  // Handle delete
  const handleDelete = (service: Service) => {
    setDeleteTarget(service);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your service offerings
          </p>
        </div>
        <Button asChild className="bg-black">
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {totalServices}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Total Services
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {activeServices}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Active Services
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-5xl">
              {inactiveServices}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Active Services
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
                Description
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
            {services.map((service) => (
              <TableRow
                key={service.id}
                className="transition-colors hover:bg-gray-50"
              >
                <TableCell className="font-semibold text-gray-900">
                  {service.title}
                </TableCell>
                <TableCell className="max-w-xs">
                  <p
                    className="truncate text-gray-500"
                    title={service.description}
                  >
                    {service.description}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {service.sortOrder}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="text-muted-foreground px-1.5"
                  >
                    {service.status === "active" ? "Active" : "Inactive"}
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
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
        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No services
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new service.
            </p>
            <Button asChild className="mt-4 bg-indigo-600 hover:bg-indigo-700">
              <Link href="/admin/services/new">
                <Plus className="h-4 w-4" />
                Add Service
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        isOpen={deleteTarget !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        serviceName={deleteTarget?.title ?? ""}
      />
    </div>
  );
}
