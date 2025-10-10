import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="font-semibold text-xl">SyncScope</span>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
          Paquetes
        </a>
        <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
          Servicios
        </a>
        <a href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
          Saber más
        </a>
      </nav>

      <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent">
        Iniciar sesión
      </Button>
    </header>
  )
}
