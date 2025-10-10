"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}

export function DetailsModal({ isOpen, onClose, title, description }: DetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-2 border-purple-200 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-purple-600 mb-4">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-sm font-medium">Box - details</span>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
