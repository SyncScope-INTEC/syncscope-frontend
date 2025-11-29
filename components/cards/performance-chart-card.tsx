"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PerformanceChartCardProps {
  data?: any
}

export function PerformanceChartCard({ data }: PerformanceChartCardProps) {
  // Data de la API o mock
  const chartData = data?.weekly_performance || [
    { day: "L", value: 65 },
    { day: "M", value: 78 },
    { day: "M", value: 72 },
    { day: "J", value: 85 },
    { day: "V", value: 68 },
    { day: "S", value: 90 },
    { day: "D", value: 75 },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento esta semana</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}