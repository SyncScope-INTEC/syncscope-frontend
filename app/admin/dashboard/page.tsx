"use client"

import { AppHeader } from "@/components/navigation/app-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ExternalLink, Github } from "lucide-react"
import Image from "next/image"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <AppHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Empresa team</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🦊</span>
            </div>
            <Github className="w-8 h-8 text-gray-900" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employees Section */}
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Empleados
                <ExternalLink className="w-4 h-4 text-purple-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Julia Perez", role: "Project Manager", status: "Activo", color: "text-purple-500" },
                { name: "Julio Perez", role: "Project Manager", status: "Activo", color: "text-purple-500" },
                { name: "Julia Perez", role: "Project Manager", status: "Inactivo", color: "text-gray-400" },
                { name: "Julio Perez", role: "Project Manager", status: "Inactivo", color: "text-gray-400" },
                { name: "Julia Perez", role: "Project Manager", status: "Activo", color: "text-purple-500" },
              ].map((employee, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                    <Image
                      src="/placeholder.svg?key=admin"
                      alt={employee.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{employee.name}</p>
                    <p className="text-xs text-gray-600">{employee.role}</p>
                  </div>
                  <Badge variant="secondary" className={`text-xs ${employee.color}`}>
                    {employee.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status and Projects */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card className="border-2 border-purple-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Estado actual</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeDasharray="70, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">70%</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">Proyecto 002</p>
              </CardContent>
            </Card>

            {/* Performance Card */}
            <Card className="bg-purple-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">30%</div>
                    <div className="text-sm opacity-90">Más rendimiento esta semana</div>
                  </div>
                  <Clock className="w-8 h-8 opacity-75" />
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Proyectos
                  <ExternalLink className="w-4 h-4 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Proyecto 002</p>
                    <p className="text-xs text-gray-600">19, Julio, 2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Proyecto 003</p>
                    <p className="text-xs text-gray-600">19, Julio, 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Section */}
          <Card className="border-2 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Actividad</CardTitle>
              <Button variant="outline" size="sm" className="text-green-600 border-green-600 bg-transparent">
                Ver más
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Year Selector */}
              <div className="flex gap-2">
                {["2016", "2017", "2018", "2019"].map((year) => (
                  <Badge key={year} variant="secondary" className="text-xs">
                    {year}
                  </Badge>
                ))}
              </div>

              {/* Month Headers */}
              <div className="grid grid-cols-6 gap-1 text-xs text-gray-600 mb-2">
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
              </div>

              {/* Activity Grid */}
              <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 42 }, (_, i) => {
                  const colors = [
                    "bg-gray-100",
                    "bg-pink-200",
                    "bg-blue-300",
                    "bg-blue-500",
                    "bg-cyan-300",
                    "bg-blue-600",
                  ]
                  const randomColor = colors[Math.floor(Math.random() * colors.length)]
                  return <div key={i} className={`w-3 h-3 rounded-sm ${randomColor}`}></div>
                })}
              </div>

              <div className="flex justify-between text-xs text-gray-600">
                <span>Contribuciones</span>
                <span>Menos</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-100 rounded-sm"></div>
                  <div className="w-2 h-2 bg-pink-200 rounded-sm"></div>
                  <div className="w-2 h-2 bg-blue-300 rounded-sm"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                </div>
                <span>Más</span>
              </div>

              {/* Recent Updates */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Última actualización</h4>
                <div className="space-y-2">
                  {[
                    {
                      text: "Se creó un nuevo proyecto",
                      author: "Julia Perez",
                      time: "19, Mayo, 2025",
                      timeDetail: "2:00 PM",
                    },
                    {
                      text: "Se creó un nuevo proyecto",
                      author: "Julia Perez",
                      time: "19, Mayo, 2025",
                      timeDetail: "2:00 PM",
                    },
                    {
                      text: "Se creó un nuevo proyecto",
                      author: "Julia Perez",
                      time: "19, Mayo, 2025",
                      timeDetail: "2:00 PM",
                    },
                  ].map((update, index) => (
                    <div key={index} className="flex justify-between items-start text-xs">
                      <div>
                        <p className="text-gray-900">{update.text}</p>
                        <p className="text-gray-600">{update.author}</p>
                      </div>
                      <div className="text-right text-gray-600">
                        <p>{update.time}</p>
                        <p>{update.timeDetail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Stats */}
              <div className="flex gap-2">
                <Badge className="bg-green-500 text-white text-xs">7h 43m Tiempo promedio de actividad</Badge>
                <Badge className="bg-purple-100 text-purple-700 text-xs">3 proyectos En progreso</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
