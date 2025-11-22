"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface FormFieldProps {
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function FormField({ label, type = "text", placeholder, value, onChange, className = "" }: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [fieldValue, setFieldValue] = useState(value || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setFieldValue(newValue)
    onChange?.(newValue)
  }

  const inputType = type === "password" && showPassword ? "text" : type

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={label} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={label}
          type={inputType}
          placeholder={placeholder}
          value={fieldValue}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}

export function FormContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-4 p-6 border-2 border-dashed border-purple-300 rounded-lg bg-gray-50 ${className}`}>
      <div className="flex items-center gap-2 text-purple-600 mb-4">
        <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
        <span className="text-sm font-medium">Campos</span>
      </div>
      {children}
    </div>
  )
}
