"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Filter, X } from "lucide-react"
import { useState, useEffect } from "react"
import { managementService } from "@/lib/services/managementService"
import { useAppSelector } from "@/lib/store/hooks"

interface DashboardFiltersProps {
  onFilterChange?: (filters: { projects: string[]; date: string | null }) => void
  className?: string
}

export function DashboardFilters({ onFilterChange, className }: DashboardFiltersProps) {
  const { user } = useAppSelector((state) => state.auth)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [filters, setFilters] = useState({
    selectedProjects: [] as string[],
    selectedDate: null as string | null,
  })

  // Cargar proyectos del usuario
  useEffect(() => {
    async function fetchProjects() {
      try {
        const userProjects = await managementService.getUserProjects(user?.id || '')
        setProjects(userProjects || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      }
    }

    if (user) {
      fetchProjects()
    }
  }, [user])

  const handleProjectToggle = (projectId: string) => {
    const newProjects = filters.selectedProjects.includes(projectId)
      ? filters.selectedProjects.filter((id) => id !== projectId)
      : [...filters.selectedProjects, projectId]

    const newFilters = { ...filters, selectedProjects: newProjects }
    setFilters(newFilters)
  }

  const handleDateChange = (date: string | null) => {
    const newFilters = { ...filters, selectedDate: date }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFilterChange?.({
      projects: filters.selectedProjects,
      date: filters.selectedDate,
    })
    setIsFilterOpen(false)
  }

  const handleClearFilters = () => {
    const newFilters = { selectedProjects: [], selectedDate: null }
    setFilters(newFilters)
    onFilterChange?.({ projects: [], date: null })
  }

  const getSelectedProjectNames = () => {
    if (!Array.isArray(projects)) return []
    return projects
      .filter((p) => filters.selectedProjects.includes(p.id))
      .map((p) => p.name)
  }

  return (
    <div className={`relative ${className || ''}`}>
      {/* Filter Bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-[#C8FF00] rounded-full">
        {/* Date Chip */}
        <Badge className="bg-[#C8FF00] text-gray-900 hover:bg-[#b8ef00] px-4 py-1.5 rounded-full font-medium">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          {filters.selectedDate || 'Fecha'}
        </Badge>

        {/* Project Chips */}
        {getSelectedProjectNames().length > 0 ? (
          getSelectedProjectNames().map((name) => (
            <Badge
              key={name}
              className="bg-[#C8FF00] text-gray-900 hover:bg-[#b8ef00] px-4 py-1.5 rounded-full font-medium"
            >
              {name}
            </Badge>
          ))
        ) : (
          <Badge className="bg-[#C8FF00] text-gray-900 hover:bg-[#b8ef00] px-4 py-1.5 rounded-full font-medium">
            Proyecto
          </Badge>
        )}

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

          {/* Date Filter */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Fecha
            </label>
            <div className="flex gap-2">
              <Button
                variant={filters.selectedDate === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleDateChange(null)}
                className={filters.selectedDate === null ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                Actual
              </Button>
              <input
                type="date"
                value={filters.selectedDate || ''}
                onChange={(e) => handleDateChange(e.target.value || null)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Projects Filter */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Proyectos
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <label
                    key={project.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.selectedProjects.includes(project.id)}
                      onChange={() => handleProjectToggle(project.id)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-900">{project.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay proyectos disponibles
                </p>
              )}
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
