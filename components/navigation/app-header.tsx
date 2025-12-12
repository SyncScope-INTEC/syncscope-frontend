"use client"

import { persistor } from "@/lib/store"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { logout } from "@/lib/store/slices/authSlice"
import { toast } from "sonner"

export function AppHeader() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, refreshToken, sessionToken } = useAppSelector((state) => state.auth)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdown cuando se hace click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = async () => {
    try {
      if (refreshToken && sessionToken) {
        await dispatch(logout({ refreshToken, sessionToken })).unwrap()
      }

      // Purgar completamente el persist
      await persistor.purge()

      toast.success("Sesión cerrada")
      router.push("/")
    } catch (_error) {
      // Aún si falla, limpiar todo
      await persistor.purge()
      toast.error("Error al cerrar sesión")
      router.push("/")
    }
  }

  const handleMenuItemClick = (action: () => void) => {
    setIsDropdownOpen(false)
    action()
  }

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 rounded-lg flex items-center justify-center">
            <Image
              src="/favicon.png"
              alt="SyncScope Logo"
              width={50}
              height={50}
              className="w-full h-auto"
            />
          </div>
          <span className="text-gray-900 font-semibold text-lg">SyncScope</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <span className="text-gray-900 font-medium">Empleados</span>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-brand-dark hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </Button>

            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-900 hover:bg-gray-100 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-brand-foreground font-semibold text-sm">
                  {user?.first_name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden md:block text-gray-900">{user?.first_name || "Usuario"}</span>
                {user?.company_name && (
                  <span className="hidden lg:block text-xs text-gray-500">({user.company_name})</span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-gray-900 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </Button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[100]">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      onClick={() => handleMenuItemClick(() => router.push("/admin/profile"))}
                      className="w-full justify-start gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none h-auto font-normal"
                    >
                      <User className="w-4 h-4" />
                      <span>Perfil</span>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => handleMenuItemClick(() => router.push("/admin/settings"))}
                      className="w-full justify-start gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none h-auto font-normal"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Ajustes</span>
                    </Button>

                    {/* New Menu Item for Alerts History */}
                    <Button
                      variant="ghost"
                      onClick={() => handleMenuItemClick(() => router.push("/admin/alerts-history"))}
                      className="w-full justify-start gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none h-auto font-normal"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Historial de Alertas</span>
                    </Button>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 my-1"></div>

                  {/* Logout */}
                  <Button
                    variant="ghost"
                    onClick={() => handleMenuItemClick(handleLogout)}
                    className="w-full justify-start gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-600 rounded-none h-auto font-normal"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
