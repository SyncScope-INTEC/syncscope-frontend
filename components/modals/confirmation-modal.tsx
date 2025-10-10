"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  type: "success" | "cancel" | "password-success"
  message?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function ConfirmationModal({ isOpen, onClose, type, message, onConfirm, onCancel }: ConfirmationModalProps) {
  if (type === "success" || type === "password-success") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-none shadow-lg">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <p className="text-center text-gray-700 font-medium">{message || "La solicitud fue enviada con éxito."}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (type === "cancel") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-none shadow-lg">
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 text-center">¿Seguro que desea cancelar?</h3>
            <div className="flex gap-3">
              <Button
                onClick={onCancel || onClose}
                variant="outline"
                className="px-6 py-2 border-purple-200 text-purple-600 hover:bg-purple-50 rounded-full bg-transparent"
              >
                No
              </Button>
              <Button
                onClick={onConfirm}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
              >
                Sí
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}
