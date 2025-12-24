import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Employees Section */}
      <Card className="border-2 border-brand-light animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Status and Projects */}
      <div className="space-y-6">
        {/* Current Status */}
        <Card className="border-2 border-purple-200 animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card className="bg-purple-500 animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-8 bg-purple-400 rounded w-16"></div>
                <div className="h-4 bg-purple-400 rounded w-32"></div>
              </div>
              <div className="w-8 h-8 bg-purple-400 rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="border-2 border-purple-200 animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity Section */}
      <Card className="border-2 border-brand-light animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Year Selector */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-12"></div>
            ))}
          </div>

          {/* Activity Grid */}
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm"></div>
            ))}
          </div>

          {/* Recent Updates */}
          <div className="space-y-4">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="flex gap-2 flex-wrap">
            <div className="h-6 bg-gray-200 rounded w-40"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
