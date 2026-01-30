import { Skeleton } from "@/components/ui/skeleton";

export default function TeamMembersLoading() {
  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-var(--header-height)-32px)]">
      <div className="flex h-full min-h-0 overflow-hidden bg-white">
        {/* Left Sidebar - Team Member List Skeleton */}
        <div className="w-full md:w-80 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-7 w-7" />
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <Skeleton className="h-9 w-full" />
          </div>

          {/* Team Member List Items */}
          <div className="flex-1 overflow-hidden py-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 border-l-2 border-transparent"
              >
                <Skeleton className="h-12 w-12 shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Edit Form Skeleton */}
        <div className="flex-1 hidden md:flex flex-col overflow-hidden min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-hidden p-6">
            <div className="max-w-2xl space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Avatar URL */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-48" />
              </div>

              {/* Socials JSON */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-3 w-64" />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3 pt-2">
                <Skeleton className="h-4 w-4" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>

              {/* Timestamps */}
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
