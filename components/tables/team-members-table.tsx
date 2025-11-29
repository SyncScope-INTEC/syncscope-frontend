"use client"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import Image from "next/image"

interface TeamMember {
  id: string
  name: string
  role: string
  lastActivity: string
  image?: string
}

interface TeamMembersTableProps {
  members?: TeamMember[]
  isLoading?: boolean
}

export function TeamMembersTable({ members = [], isLoading = false }: TeamMembersTableProps) {
  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Cargando equipo...</div>
  }

  if (members.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState title="Sin miembros" description="No hay miembros de equipo asociados a este proyecto" />
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {members.map((member) => (
        <Card key={member.id} className="p-4 border border-yellow-200 hover:border-yellow-300 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 relative overflow-hidden">
                {member.image ? (
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{member.name}</h4>
                <p className="text-xs text-gray-600">{member.role}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">{member.lastActivity}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
