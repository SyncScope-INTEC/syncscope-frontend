"use client"

import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <header className="w-full bg-gray-900 border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <span className="text-white font-medium">Empleados</span>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-green-400 hover:bg-gray-800">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-green-400 hover:bg-gray-800">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
