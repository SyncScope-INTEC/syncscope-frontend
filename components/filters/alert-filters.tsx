"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"
import { useState } from "react"

interface AlertFiltersProps {
  onFilterChange?: (filters: { severity: string; status: string; search: string }) => void
}

export function AlertFilters({ onFilterChange }: AlertFiltersProps) {
  const [filters, setFilters] = useState({
    severity: "",
    status: "",
    search: "",
  })

  const severityOptions = [
    { value: "critical", label: "Crítico" },
    { value: "high", label: "Alto" },
    { value: "medium", label: "Medio" },
    { value: "low", label: "Bajo" },
  ]

  const statusOptions = [
    { value: "unresolved", label: "Sin resolver" },
    { value: "acknowledged", label: "Reconocido" },
    { value: "resolved", label: "Resuelto" },
  ]

  const handleSeverityToggle = (severity: string) => {
    const newFilters = { ...filters, severity: filters.severity === severity ? "" : severity }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleStatusToggle = (status: string) => {
    const newFilters = { ...filters, status: filters.status === status ? "" : status }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      {/* Severity Filters */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm text-gray-600 mr-2">Severidad:</span>
        {severityOptions.map((option) => (
          <Badge
            key={option.value}
            onClick={() => handleSeverityToggle(option.value)}
            className={`cursor-pointer ${filters.severity === option.value
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {option.label}
          </Badge>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-sm text-gray-600 mr-2">Estado:</span>
        {statusOptions.map((option) => (
          <Badge
            key={option.value}
            onClick={() => handleStatusToggle(option.value)}
            className={`cursor-pointer ${filters.status === option.value
                ? "bg-brand-dark text-white hover:bg-brand-darker"
                : "bg-brand text-brand-foreground hover:bg-brand-hover"
              }`}
          >
            {option.label}
          </Badge>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-2 w-full md:w-auto">
        <Input
          placeholder="Buscar alertas..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border-purple-300"
        />
        <Button size="icon" variant="outline" className="bg-brand hover:bg-brand-hover text-brand-foreground">
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
