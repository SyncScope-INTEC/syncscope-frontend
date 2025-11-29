"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProfileCardProps {
  firstName: string
  lastName: string
  role: string
  email: string
  phone: string
  identifier: string
  company: string
  gitHubUser: string
  gitLabUser: string
  timezone: string
  status: string
  createdDate: string
  lastUpdated: string
  profileImage?: string
  onEdit?: () => void
  showEditButton?: boolean
}

export function ProfileCard({
  firstName,
  lastName,
  role,
  email,
  phone,
  identifier,
  company,
  gitHubUser,
  gitLabUser,
  timezone,
  status,
  createdDate,
  lastUpdated,
  profileImage,
  onEdit,
  showEditButton = false,
}: ProfileCardProps) {
  return (
    <Card className="p-6 border border-purple-200">
      <div className="flex gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-32 h-40 bg-gray-300 rounded-lg overflow-hidden relative">
            {profileImage ? (
              <Image
                src={profileImage || "/placeholder.svg"}
                alt={`${firstName} ${lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-4xl font-bold">
                {firstName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Nombre</p>
            <p className="font-semibold text-gray-900">{firstName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Apellido</p>
            <p className="font-semibold text-gray-900">{lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Usuario GitHub</p>
            <p className="font-semibold text-gray-900">{gitHubUser}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Usuario GitLab</p>
            <p className="font-semibold text-gray-900">{gitLabUser}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Zona horaria</p>
            <p className="font-semibold text-gray-900">{timezone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Estado</p>
            <p className="font-semibold text-gray-900">{status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fecha de creación</p>
            <p className="font-semibold text-gray-900">{createdDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Última actualización</p>
            <p className="font-semibold text-gray-900">{lastUpdated}</p>
          </div>

          {/* Additional Info */}
          <div className="col-span-2">
            <p className="text-xs text-gray-500 mb-1">Número identificador</p>
            <p className="font-semibold text-gray-900">{identifier}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 mb-1">Compañía</p>
            <p className="font-semibold text-gray-900">{company}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 mb-1">Correo electrónico</p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500 mb-1">Número telefónico</p>
            <p className="font-semibold text-gray-900">{phone}</p>
          </div>

          {/* Edit Button */}
          {showEditButton && (
            <div className="col-span-2 mt-4">
              <Button
                onClick={onEdit}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent"
              >
                Editar
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
