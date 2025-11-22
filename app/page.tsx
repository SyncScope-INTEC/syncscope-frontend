"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto text-center">
        <div className="relative">
          {/* Background circle */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 md:w-[600px] md:h-[600px] border-2 border-purple-200 rounded-full opacity-50"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-balance">
              Más allá del código:
              <br />
              <span className="text-gray-800">rendimiento en tiempo real</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-balance">
              Plataforma SaaS de Auditoría u Optimización para Equipos de Desarrollo
            </p>

            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg rounded-full"
              onClick={() => router.push('/faq')}
            >
              Conoce cómo funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Empleados Card */}
          <Card className="p-6 border-green-200 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Empleados</h3>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                👥
              </Badge>
            </div>
            <div className="space-y-3">
              {[
                { name: "Julia Perez", role: "Project Manager", status: "Activo", active: true },
                { name: "Julio Perez", role: "Project Manager", status: "Activo", active: true },
                { name: "Julia Perez", role: "Project Manager", status: "Inactivo", active: false },
                { name: "Julio Perez", role: "Project Manager", status: "Inactivo", active: false },
                { name: "Julia Perez", role: "Project Manager", status: "Activo", active: true },
              ].map((employee, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.role}</p>
                    </div>
                  </div>
                  <Badge
                    variant={employee.active ? "default" : "secondary"}
                    className={employee.active ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}
                  >
                    {employee.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Estado Actual Card */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado actual</h3>
              <div className="flex items-center justify-center">
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
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      strokeDasharray="70, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">70%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">Proyecto 002</p>
            </Card>

            <Card className="p-6 bg-purple-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">30%</div>
                  <div className="text-sm opacity-90">Más rendimiento esta semana</div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actividad Card */}
          <Card className="p-6 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Actividad</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-transparent"
                onClick={() => router.push('/admin/dashboard')}
              >
                Ver más
              </Button>
            </div>

            {/* Year selector */}
            <div className="flex space-x-2 mb-4">
              {["2016", "2017", "2018", "2019"].map((year) => (
                <Badge key={year} variant="outline" className="text-xs">
                  {year}
                </Badge>
              ))}
            </div>

            {/* Calendar heatmap */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 84 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${
                      Math.random() > 0.7
                        ? "bg-blue-500"
                        : Math.random() > 0.5
                          ? "bg-blue-300"
                          : Math.random() > 0.3
                            ? "bg-pink-300"
                            : "bg-gray-200"
                    }`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Contribuciones</span>
                <span>Menos</span>
                <span>Más</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-2">Última actualización</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">Se creó un nuevo proyecto</p>
                    <p className="text-gray-500">Julia Perez</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>19, Mayo, 2025</p>
                    <p>2:00 PM</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">Se creó un nuevo proyecto</p>
                    <p className="text-gray-500">Julia Perez</p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>19, Mayo, 2025</p>
                    <p>2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Team Productivity Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/images/team-illustration.png"
                alt="Team working illustration"
                width={500}
                height={400}
                className="w-full h-auto"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-balance">
                Escala la productividad de tu equipo sin perder el control
              </h2>

              <p className="text-lg text-gray-600 text-balance">
                Elige el plan que se ajusta a tus necesidades y gestiona equipos grandes con facilidad.
              </p>

              <Button 
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full"
                onClick={() => router.push('/pricing')}
              >
                Explorar planes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-bold text-green-600">-30%</div>
            <p className="text-gray-600">Revisión manual</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold text-green-600">80%</div>
            <p className="text-gray-600">Adopción en 1er mes</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-bold text-green-600">-</div>
            <p className="text-gray-600">Menos bugs en producción</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Confían en nosotros</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 bg-white border-purple-100 hover:border-purple-200 transition-colors">
              <div className="flex items-center justify-center h-16 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="356.39" viewBox="135.5 361.38 1000 356.39">
                  <path d="M245.8075 717.62406c-29.79588-1.1837-54.1734-9.3368-73.23459-24.4796-3.63775-2.8928-12.30611-11.5663-15.21427-15.2245-7.72958-9.7193-12.98467-19.1785-16.48977-29.6734-10.7857-32.3061-5.23469-74.6989 15.87753-121.2243 18.0765-39.8316 45.96932-79.3366 94.63252-134.0508 7.16836-8.0511 28.51526-31.5969 28.65302-31.5969.051 0-1.11225 2.0153-2.57652 4.4694-12.65304 21.1938-23.47957 46.158-29.37751 67.7703-9.47448 34.6785-8.33163 64.4387 3.34693 87.5151 8.05611 15.898 21.86731 29.6684 37.3979 37.2806 27.18874 13.3214 66.9948 14.4235 115.60699 3.2245 3.34694-.7755 169.19363-44.801 368.55048-97.8366 199.35686-53.0408 362.49439-96.4029 362.51989-96.3672.056.046-463.16259 198.2599-703.62654 301.0914-38.08158 16.2806-48.26521 20.3928-66.16827 26.6785-45.76525 16.0714-86.76008 23.7398-119.89779 22.4235z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Nike</h3>
            </Card>

            <Card className="p-8 bg-white border-purple-100 hover:border-purple-200 transition-colors">
              <div className="flex items-center justify-center h-16 mb-4">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                  <path d="M8.5 7.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5-1.567 3.5-3.5-3.5zm7 9c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Chanel</h3>
            </Card>

            <Card className="p-8 bg-white border-purple-100 hover:border-purple-200 transition-colors">
              <div className="flex items-center justify-center h-16 mb-4">
                <svg className="w-16 h-12" viewBox="0 0 64 48" fill="currentColor">
                  <path d="M8 0L0 24l8 24h16l8-24L24 0H8zm32 0l-8 24 8 24h16l8-24-8-24H40z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Adidas</h3>
            </Card>
          </div>

          <p className="text-gray-600 mt-8">+15 empresas ya están optimizando su productividad con SyncScope</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}