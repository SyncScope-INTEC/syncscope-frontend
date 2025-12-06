"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DemoModal({ isOpen, onClose, onSuccess }: DemoModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envío con animación de carga
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsLoading(false)
    onClose()
    setEmail("")
    onSuccess()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-3xl border-none p-12">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              ¿Te interesa conocer mas sobre{" "}
              <span className="bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
                SyncScope
              </span>
              ?
            </h2>
            <p className="text-gray-600 text-lg">
              Envíanos tu correo y estaremos en contacto
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="demo-email" className="text-gray-900 font-medium text-lg">
                Correo electrónico
              </Label>
              <Input
                id="demo-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="px-6 py-6 text-lg border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:ring-purple-400"
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="px-12 py-6 text-lg font-bold rounded-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-gray-900"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  "Enviar solicitud"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
