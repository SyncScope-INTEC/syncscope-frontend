'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Mail, FolderKanban, User } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">
            Gestiona usuarios, invitaciones y proyectos de tu empresa
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Invitaciones</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              <span className="hidden sm:inline">Proyectos</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Usuarios de la empresa</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Gestiona los miembros de tu equipo
                  </p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Users className="w-4 h-4 mr-2" />
                  Invitar usuario
                </Button>
              </div>
              
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tabla de usuarios próximamente...</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Invitaciones pendientes</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Gestiona las invitaciones enviadas
                </p>
              </div>
              
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tabla de invitaciones próximamente...</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Proyectos</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Gestiona los proyectos de tu empresa
                  </p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <FolderKanban className="w-4 h-4 mr-2" />
                  Crear proyecto
                </Button>
              </div>
              
              <div className="text-center py-12 text-gray-500">
                <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Lista de proyectos próximamente...</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Configuración del perfil</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Actualiza tu información personal
                </p>
              </div>
              
              <div className="text-center py-12 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Configuración de perfil próximamente...</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
