"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github } from "lucide-react"
import Link from "next/link"

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Decorative Elements */}
          <div className="relative">
            {/* Background curves */}
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 800 600" fill="none">
                <path
                  d="M-100 300 Q200 100 400 300 T800 300"
                  stroke="#a3e635"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.3"
                />
                <path d="M800 200 Q600 400 400 200 T0 200" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.3" />
              </svg>
            </div>

            <div className="relative z-10 text-center py-20">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
                Inicia sesión en SyncScope
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-balance">
                Accede a tu panel de métricas, auditorías y productividad en segundos.
              </p>

              {/* Form */}
              <div className="max-w-md mx-auto space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left block text-gray-900 font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-left block text-gray-900 font-medium">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-0"
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-green-500 hover:text-green-600 text-sm">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Login Buttons */}
                <div className="flex gap-4">
                  <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2">
                    <Github className="w-5 h-5" />
                    Iniciar con Github
                  </Button>

                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium">
                    Iniciar sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
