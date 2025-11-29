"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Activity {
  id: string
  title: string
  description: string
  date: string
  time: string
}

interface ActivityCardProps {
  activities?: Activity[]
  onViewMore?: () => void
}

export function ActivityCard({ activities = [], onViewMore }: ActivityCardProps) {
  return (
    <Card className="p-6 border border-yellow-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Próximas actividades</h3>
        {onViewMore && (
          <Button
            onClick={onViewMore}
            variant="outline"
            className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent"
          >
            Ver más
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay actividades próximas</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex justify-between items-start pb-4 border-b border-gray-200 last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500">{activity.date}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
