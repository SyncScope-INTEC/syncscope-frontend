"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormField, FormContainer } from "@/components/forms/form-fields"
import { useState } from "react"

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DemoFormData) => void
}

interface DemoFormData {
  email: string
  password: string
  confirmPassword: string
  companyName: string
  phone: string
  position: string
  teamSize: string
}

export function DemoModal({ isOpen, onClose, onSubmit }: DemoModalProps) {
  const [formData, setFormData] = useState<DemoFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    phone: "",
    position: "",
    teamSize: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (field: keyof DemoFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            Solicitar Demo de SyncScope
          </DialogTitle>
          <p className="text-gray-600 text-center">
            Complete el formulario para acceder a una demostración personalizada
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={updateField("email")}
              />
              <FormField
                label="Nombre de la empresa"
                placeholder="Nombre de su empresa"
                value={formData.companyName}
                onChange={updateField("companyName")}
              />
              <FormField
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={updateField("password")}
              />
              <FormField
                label="Confirmar contraseña"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={updateField("confirmPassword")}
              />
              <FormField
                label="Teléfono"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={updateField("phone")}
              />
              <FormField
                label="Cargo/Posición"
                placeholder="Ej: CTO, Gerente de Desarrollo"
                value={formData.position}
                onChange={updateField("position")}
              />
              <FormField
                label="Tamaño del equipo"
                placeholder="Ej: 5-10 desarrolladores"
                value={formData.teamSize}
                onChange={updateField("teamSize")}
                className="md:col-span-2"
              />
            </div>
          </FormContainer>

          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
              Solicitar Demo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
