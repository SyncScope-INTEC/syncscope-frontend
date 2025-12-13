import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileCardSkeleton() {
  return (
    <Card className="p-6 border border-purple-200">
      <div className="flex gap-6">
        {/* Profile Image Skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="w-32 h-40 rounded-lg" />
        </div>

        {/* Profile Info Skeleton */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
          {/* Last Name */}
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-5 w-28" />
          </div>
          {/* GitHub User */}
          <div>
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-5 w-32" />
          </div>
          {/* GitLab User */}
          <div>
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-5 w-32" />
          </div>
          {/* Timezone */}
          <div>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-5 w-16" />
          </div>
          {/* Status */}
          <div>
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
          {/* Created Date */}
          <div>
            <Skeleton className="h-3 w-28 mb-1" />
            <Skeleton className="h-5 w-32" />
          </div>
          {/* Last Updated */}
          <div>
            <Skeleton className="h-3 w-32 mb-1" />
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Company - Full width */}
          <div className="col-span-2">
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-5 w-40" />
          </div>
          {/* Email - Full width */}
          <div className="col-span-2">
            <Skeleton className="h-3 w-32 mb-1" />
            <Skeleton className="h-5 w-56" />
          </div>
          {/* Phone - Full width */}
          <div className="col-span-2">
            <Skeleton className="h-3 w-28 mb-1" />
            <Skeleton className="h-5 w-36" />
          </div>

          {/* Edit Button */}
          <div className="col-span-2 mt-4">
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </Card>
  )
}
