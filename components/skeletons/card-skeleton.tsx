import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardSkeletonProps {
  className?: string
  variant?: "default" | "compact" | "tall"
}

export function CardSkeleton({ className, variant = "default" }: CardSkeletonProps) {
  const heights = {
    default: "h-48",
    compact: "h-32",
    tall: "h-64"
  }

  return (
    <Card className={cn("p-6 border-2 border-purple-200 animate-pulse", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </div>

        {/* Content */}
        <div className={cn("bg-gray-200 rounded", heights[variant])}></div>

        {/* Footer */}
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </Card>
  )
}
