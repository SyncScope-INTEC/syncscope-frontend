"use client"

import { AppHeader } from "@/components/navigation/app-header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Filter } from "lucide-react"
import Image from "next/image"

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <AppHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenida, Julia</h1>
          <p className="text-gray-600 text-lg">Project Manager</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Badge className="bg-green-600 text-white px-4 py-2 rounded-full">Fecha</Badge>
          <Badge className="bg-green-600 text-white px-4 py-2 rounded-full">Proyecto</Badge>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Filter className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee Profile Card */}
          <Card className="lg:col-span-2 border-2 border-purple-200">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src="/professional-woman-smiling.png"
                      alt="Julia Pérez"
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Julia Pérez</h2>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Número identificador:</span> 000000000
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Compañía:</span> Nike
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Correo electrónico:</span> JPerez@nike.com
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Número telefónico:</span> 000-0000-000
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Nombre:</span> Julia
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Usuario GitHub:</span> Julia2
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Zona horaria:</span> UTC -4
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Fecha de creación:</span> 02/05/2025
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Apellido:</span> Pérez
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Usuario GitLab:</span> PJulia02
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Estado:</span> Activo
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Última actualización:</span> 09/07/2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Progress */}
          <div className="space-y-6">
            <Card className="border-2 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg"></div>
                  <div>
                    <h3 className="font-bold text-gray-900">Proyecto 002</h3>
                    <p className="text-sm text-gray-600">19, Julio, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Progreso del proyecto</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray="77, 100"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">77%</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span>Inicio</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span>Planificación</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Diseño</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <span>Construcción</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Equipo de trabajo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Julio Perez", role: "UI/UX Designer", time: "Hoy, 12:00PM" },
              { name: "Julio Perez", role: "UI/UX Designer", time: "Hoy, 12:00PM" },
              { name: "Julio Perez", role: "Developer", time: "Hoy, 12:00PM" },
              { name: "Julio Perez", role: "Developer", time: "Hoy, 12:00PM" },
              { name: "Julio Perez", role: "Developer", time: "Hoy, 12:00PM" },
              { name: "Julio Perez", role: "Developer", time: "Hoy, 12:00PM" },
            ].map((member, index) => (
              <Card key={index} className="border-2 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                        <Image
                          src="/professional-person.png"
                          alt={member.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Última actividad:</p>
                      <p className="text-sm font-medium text-gray-900">{member.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
