"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search, X } from "lucide-react"
import { useState } from "react"

interface AlertFiltersProps {
  onFilterChange?: (filters: { severity: string; status: string; search: string }) => void
}

export function AlertFilters({ onFilterChange }: AlertFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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
  }

  const handleStatusToggle = (status: string) => {
    const newFilters = { ...filters, status: filters.status === status ? "" : status }
    setFilters(newFilters)
  }

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFilterChange?.(filters)
    setIsFilterOpen(false)
  }

  const handleClearFilters = () => {
    const newFilters = { severity: "", status: "", search: "" }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const getActiveFiltersText = () => {
    const active = []
    if (filters.severity) {
      const sev = severityOptions.find(s => s.value === filters.severity)
      if (sev) active.push(sev.label)
    }
    if (filters.status) {
      const st = statusOptions.find(s => s.value === filters.status)
      if (st) active.push(st.label)
    }
    return active.length > 0 ? active : ['Filtros']
  }

  return (
    <div className="relative mb-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-[#C8FF00] rounded-full">
        {/* Active Filter Chips */}
        {getActiveFiltersText().map((text, idx) => (
          <Badge
            key={idx}
            className="bg-[#C8FF00] text-gray-900 hover:bg-[#b8ef00] px-4 py-1.5 rounded-full font-medium"
          >
            {text}
          </Badge>
        ))}

        {/* Search Input */}
        <div className="flex-1 flex items-center gap-2 ml-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar alertas..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Filter Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="ml-auto bg-[#C8FF00] hover:bg-[#b8ef00] rounded-full w-10 h-10"
        >
          <Filter className="w-5 h-5 text-gray-900" />
        </Button>
      </div>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filtros</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFilterOpen(false)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Severity Filter */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Severidad
            </label>
            <div className="space-y-2">
              {severityOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="radio"
                    name="severity"
                    checked={filters.severity === option.value}
                    onChange={() => handleSeverityToggle(option.value)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Estado
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="radio"
                    name="status"
                    checked={filters.status === option.value}
                    onChange={() => handleStatusToggle(option.value)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="flex-1"
            >
              Limpiar
            </Button>
            <Button
              size="sm"
              onClick={handleApplyFilters}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Aplicar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
