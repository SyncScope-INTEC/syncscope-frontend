"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import Image from "next/image"

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  companyName: string
  companyLogo?: string
}

export function ClientModal({ isOpen, onClose, companyName, companyLogo }: ClientModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-white border-2 border-purple-200 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-purple-600 mb-4">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-sm font-medium">Box - clientes</span>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center relative">
            {companyLogo ? (
              <Image
                src={companyLogo || "/placeholder.svg"}
                alt={companyName}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded"></div>
            )}
          </div>
          <p className="text-center text-gray-900 font-medium">{companyName}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
