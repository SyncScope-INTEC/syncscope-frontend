"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"

interface Alert {
  id: string
  title: string
  employee: string
  date: string
  severity: "alto" | "medio" | "bajo"
}

interface AlertsTableProps {
  alerts?: Alert[]
  isLoading?: boolean
}

export function AlertsTable({ alerts = [], isLoading = false }: AlertsTableProps) {

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "alto":
        return "bg-red-100 text-red-700"
      case "medio":
        return "bg-yellow-100 text-yellow-700"
      case "bajo":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando alertas...</div>
  }

  if (alerts.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState title="Sin alertas" description="No hay alertas registradas en este momento" />
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-1/3">Alerta</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-1/4">Empleado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-1/4">Fecha</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 w-1/6">Severidad</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{alert.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{alert.employee}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{alert.date}</td>
                <td className="px-6 py-4 text-center">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
