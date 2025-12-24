import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsSkeletonProps {
  className?: string
  count?: number
}

export function StatsSkeleton({ className, count = 3 }: StatsSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6 border-2 border-yellow-200 animate-pulse">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </Card>
      ))}
    </div>
  )
}
