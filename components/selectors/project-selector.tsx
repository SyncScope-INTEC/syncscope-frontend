'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  name: string
}

interface ProjectSelectorProps {
  projects: Project[]
  selectedProjectId: string | null
  onSelectProject: (projectId: string) => void
  className?: string
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onSelectProject,
  className,
}: ProjectSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {selectedProject ? selectedProject.name : 'Seleccionar proyecto...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar proyecto..." />
          <CommandEmpty>No se encontraron proyectos.</CommandEmpty>
          <CommandGroup>
            {projects.map((project) => (
              <CommandItem
                key={project.id}
                value={project.name}
                onSelect={() => {
                  onSelectProject(project.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedProjectId === project.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
