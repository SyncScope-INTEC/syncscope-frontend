"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Check } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export function SuccessModal({ isOpen, onClose, message = "La solicitud fue enviada con éxito." }: SuccessModalProps) {
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
            {message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
