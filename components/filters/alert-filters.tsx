"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"
import { useState } from "react"

interface AlertFiltersProps {
  onFilterChange?: (filters: { status: string; project: string; search: string }) => void
}

export function AlertFilters({ onFilterChange }: AlertFiltersProps) {
  const [filters, setFilters] = useState({
    status: "",
    project: "",
    search: "",
  })

  const statusOptions = ["Equipo interno", "Híbrido"]
  const projectOptions = ["Julio"]

  const handleStatusToggle = (status: string) => {
    const newFilters = { ...filters, status: filters.status === status ? "" : status }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleProjectToggle = (project: string) => {
    const newFilters = { ...filters, project: filters.project === project ? "" : project }
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
      {/* Status Filters */}
      <div className="flex gap-2">
        {statusOptions.map((status) => (
          <Badge
            key={status}
            onClick={() => handleStatusToggle(status)}
            className={`cursor-pointer ${
              filters.status === status ? "bg-green-600 text-white" : "bg-green-400 text-black hover:bg-green-500"
            }`}
          >
            {status}
          </Badge>
        ))}
      </div>

      {/* Project Filters */}
      <div className="flex gap-2">
        {projectOptions.map((project) => (
          <Badge
            key={project}
            onClick={() => handleProjectToggle(project)}
            className={`cursor-pointer ${
              filters.project === project ? "bg-green-600 text-white" : "bg-green-400 text-black hover:bg-green-500"
            }`}
          >
            {project}
          </Badge>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 w-full md:w-auto">
        <Input
          placeholder="Buscar..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="border-purple-300"
        />
        <Button size="icon" variant="outline" className="bg-green-400 hover:bg-green-500 text-black">
          <Search className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="outline">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
