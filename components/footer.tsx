import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-purple-900 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">SyncScope</h3>
            <p className="text-sm text-purple-200">
              Plataforma SaaS de Auditoría y Optimización para Equipos de Desarrollo
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Funcionalidades
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-purple-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-purple-200">
          <div>Proyecto final de grado</div>
          <div>SyncScope</div>
          <div>2025-26</div>
        </div>
      </div>
    </footer>
  )
}