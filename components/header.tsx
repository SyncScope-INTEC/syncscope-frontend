"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useAppSelector } from "@/lib/store/hooks"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const handleLoginClick = () => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    } else {
      router.push('/auth/admin-login')
    }
  }

  return (
    <header className="w-full">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-10 rounded-lg flex items-center justify-center">
            <Image
              src="/favicon.png"
              alt="SyncScope Logo"
              width={50}
              height={50}
              className="w-full h-auto"
            />
          </div>
          <span className="font-semibold text-xl">SyncScope</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
            Paquetes
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-purple-600 transition-colors">
            Servicios
          </Link>
          <Link href="/faq" className="text-gray-700 hover:text-purple-600 transition-colors">
            Saber más
          </Link>
        </nav>
        <Button
          variant="outline"
          className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
          onClick={handleLoginClick}
        >
          {isAuthenticated ? 'Dashboard' : 'Iniciar sesión'}
        </Button>
      </div>
    </header>
  )
}