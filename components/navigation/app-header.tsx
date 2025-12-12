"use client"

import { persistor } from "@/lib/store"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, User, Settings, LogOut, ChevronDown, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { logout } from "@/lib/store/slices/authSlice"
import { alertsService } from "@/lib/services/alertsService"
import { toast } from "sonner"

export function AppHeader() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, refreshToken, sessionToken } = useAppSelector((state) => state.auth)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [alerts, setAlerts] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Cargar alertas
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const alertsData = await alertsService.getAllAlerts()
        const activeAlerts = alertsData?.results?.filter(
          (alert: any) => !alert.is_resolved && !alert.is_muted
        ) || []

        setAlerts(activeAlerts)
        setUnreadCount(activeAlerts.filter((a: any) => !a.is_acknowledged).length)
      } catch (error) {
        console.error('Error fetching alerts:', error)
        setAlerts([])
        setUnreadCount(0)
      }
    }

    if (user) {
      fetchAlerts()
      // Actualizar cada 30 segundos
      const interval = setInterval(fetchAlerts, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  // Cerrar dropdowns cuando se hace click afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    if (isDropdownOpen || isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen, isNotificationsOpen])

  const handleLogout = async () => {
    try {
      if (refreshToken && sessionToken) {
        await dispatch(logout({ refreshToken, sessionToken })).unwrap()
      }

      await persistor.purge()
      toast.success("Sesión cerrada")
      router.push("/")
    } catch (_error) {
      await persistor.purge()
      toast.error("Error al cerrar sesión")
      router.push("/")
    }
  }

  const handleClearAllAlerts = async () => {
    try {
      for (const alert of alerts) {
        if (!alert.is_acknowledged) {
          await alertsService.acknowledgeAlert(alert.id, user?.id || '', 'Cleared from notifications')
        }
      }

      setAlerts([])
      setUnreadCount(0)
      toast.success('Todas las notificaciones han sido limpiadas')
      setIsNotificationsOpen(false)
    } catch (error) {
      console.error('Error clearing alerts:', error)
      toast.error('Error al limpiar notificaciones')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      default:
        return 'text-blue-600'
    }
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
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-brand-dark hover:bg-gray-100"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]">
                  <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                    {alerts.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAllAlerts}
                        className="text-xs text-purple-600 hover:text-purple-700 h-auto py-1"
                      >
                        Limpiar todo
                      </Button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {alerts.length > 0 ? (
                      alerts.slice(0, 5).map((alert) => (
                        <div
                          key={alert.id}
                          className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                          onClick={() => {
                            setIsNotificationsOpen(false)
                            router.push('/admin/alerts-history')
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <AlertCircle className={`w-4 h-4 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {alert.title}
                              </p>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {alert.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(alert.created_at).toLocaleString('es-ES', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No hay notificaciones</p>
                      </div>
                    )}
                  </div>

                  {alerts.length > 5 && (
                    <div className="px-4 py-2 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-purple-600 hover:text-purple-700"
                        onClick={() => {
                          setIsNotificationsOpen(false)
                          router.push('/admin/alerts-history')
                        }}
                      >
                        Ver todas las alertas
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Dropdown */}
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
                  className={`w-4 h-4 text-gray-900 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
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
                      onClick={() => {
                        setIsDropdownOpen(false)
                        router.push("/admin/profile")
                      }}
                      className="w-full justify-start gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none h-auto font-normal"
                    >
                      <User className="w-4 h-4" />
                      <span>Perfil</span>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsDropdownOpen(false)
                        router.push("/admin/settings")
                      }}
                      className="w-full justify-start gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none h-auto font-normal"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Ajustes</span>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsDropdownOpen(false)
                        router.push("/admin/alerts-history")
                      }}
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
                    onClick={() => {
                      setIsDropdownOpen(false)
                      handleLogout()
                    }}
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
