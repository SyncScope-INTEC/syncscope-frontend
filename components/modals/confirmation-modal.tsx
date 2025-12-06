"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  type: "success" | "cancel"
  message?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export function ConfirmationModal({ isOpen, onClose, type, message, onConfirm, onCancel }: ConfirmationModalProps) {
  if (type === "success") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl border-none p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Check Icon */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center">
              <Check className="w-16 h-16 text-white stroke-[3]" />
            </div>

            {/* Message */}
            <p className="text-center text-gray-900 text-lg font-medium">
              {message || "La solicitud fue enviada con éxito."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (type === "cancel") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl border-none p-12">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Title */}
            <h2 className="text-center text-gray-900 text-2xl font-bold">
              ¿Seguro que desea cancelar?
            </h2>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Button
                onClick={onCancel || onClose}
                variant="outline"
                className="px-12 py-6 rounded-full border-2 border-purple-400 text-purple-600 hover:bg-purple-50 text-lg font-medium"
              >
                No
              </Button>
              <Button
                onClick={onConfirm}
                className="px-12 py-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium"
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
