import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Card - Spans 2 columns on large screens */}
      <Card className="lg:col-span-2 p-6 border-2 border-purple-200">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="w-48 h-56 rounded-lg" />
          </div>

          {/* Profile Info Skeleton */}
          <div className="flex-1 space-y-6">
            {/* Top Section - Company, Email, Phone */}
            <div className="space-y-2 text-sm">
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-5 w-36" />
              </div>
            </div>

            {/* Bottom Section - Personal Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-gray-200">
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>

            {/* Edit Button Skeleton */}
            <div className="flex justify-end pt-4">
              <Skeleton className="h-10 w-20 rounded-md" />
            </div>
          </div>
        </div>
      </Card>

      {/* Activity Card Skeleton */}
      <Card className="p-6 border-2 border-yellow-300 bg-yellow-50/50 flex flex-col">
        <Skeleton className="h-6 w-40 mb-4" />

        <div className="space-y-3 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-sm">
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          ))}
        </div>

        {/* Ver más button skeleton */}
        <div className="pt-6 mt-auto">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </Card>
    </div>
  )
}
