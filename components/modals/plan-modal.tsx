"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planDescription: string
  price: string
  benefits: string[]
  onStart: () => void
}

export function PlanModal({ isOpen, onClose, planName, planDescription, price, benefits, onStart }: PlanModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-purple-200 rounded-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-2 text-purple-600">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-sm font-medium">Box - Paquetes</span>
          </div>
          <div className="text-left space-y-2">
            <DialogTitle className="text-xl font-bold text-gray-900">{planName}</DialogTitle>
            <p className="text-sm text-gray-600">{planDescription}</p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-left">
            <span className="text-3xl font-bold text-gray-900">{price}</span>
            <span className="text-gray-600">/mes</span>
          </div>

          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={onStart}
              className="bg-transparent text-brand-dark hover:bg-brand-light font-medium"
              variant="ghost"
            >
              Iniciar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
