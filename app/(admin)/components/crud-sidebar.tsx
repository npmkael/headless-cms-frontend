"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface CrudSidebarItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  isActive?: boolean | null;
}

export interface CrudSidebarProps<T extends CrudSidebarItem> {
  /** Title displayed in the sidebar header */
  title: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Text shown when no items are found */
  emptyText?: string;
  /** Default title for new item in create mode */
  newItemTitle?: string;
  /** Default description placeholder for new item */
  newItemDescription?: string;
  /** List of items to display */
  items: T[];
  /** Currently selected item ID */
  selectedId: string | null;
  /** Whether in create mode */
  isCreateMode: boolean;
  /** Whether the detail view is shown on mobile */
  showDetailOnMobile: boolean;
  /** Form data for create mode display */
  formTitle?: string;
  formDescription?: string;
  /** Callback when an item is selected */
  onSelectItem: (id: string) => void;
  /** Callback when create new is clicked */
  onCreateNew: () => void;
  /** Custom render function for status badge */
  renderStatus?: (item: T) => React.ReactNode;
  /** Custom render function for thumbnail fallback icon */
  renderFallbackIcon?: () => React.ReactNode;
}

export function CrudSidebar<T extends CrudSidebarItem>({
  title,
  searchPlaceholder = "Search...",
  emptyText = "No items found",
  newItemTitle = "New Item",
  newItemDescription = "Enter description...",
  items,
  selectedId,
  isCreateMode,
  showDetailOnMobile,
  formTitle,
  formDescription,
  onSelectItem,
  onCreateNew,
  renderStatus,
  renderFallbackIcon,
}: CrudSidebarProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items by search
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false)
  );

  // Default status renderer
  const defaultRenderStatus = (item: CrudSidebarItem) => {
    if (item.isActive === true) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
        Draft
      </span>
    );
  };

  // Default fallback icon renderer
  const defaultRenderFallbackIcon = () => (
    <FileText className="h-5 w-5 text-gray-400" />
  );

  const statusRenderer = renderStatus || defaultRenderStatus;
  const fallbackIconRenderer = renderFallbackIcon || defaultRenderFallbackIcon;

  return (
    <div
      className={`w-full md:w-80 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col min-h-0 ${
        showDetailOnMobile ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="shrink-0 flex items-center h-[65px] justify-between border-b border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onCreateNew}
          disabled={isCreateMode}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="shrink-0 p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-white"
          />
        </div>
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filteredItems.length === 0 && !isCreateMode ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <FileText className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">{emptyText}</p>
          </div>
        ) : (
          <div className="py-1">
            {/* New Item entry when in create mode */}
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
                    {formTitle || newItemTitle}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {formDescription || newItemDescription}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                      New
                    </span>
                  </div>
                </div>
              </div>
            )}

            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  // Don't switch if clicking on already selected item (desktop only)
                  if (
                    item.id === selectedId &&
                    !isCreateMode &&
                    showDetailOnMobile
                  )
                    return;
                  onSelectItem(item.id);
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-100 ${
                  selectedId === item.id && !isCreateMode
                    ? "bg-blue-50 border-l-2 border-blue-500"
                    : "border-l-2 border-transparent"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-200">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      onError={() => {}}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {fallbackIconRenderer()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    {statusRenderer(item)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
