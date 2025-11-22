import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronDown, CheckCircle, Clock, BarChart3, Bell, Link, Lightbulb } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <Header />

      {/* Hero Section */}
      <section className="relative px-6 py-16 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
            Preguntas Frecuentes sobre Seguridad y Uso
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Conoce cómo SyncScope protege tus datos y mejora la experiencia de tus equipos de desarrollo.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="space-y-4">
          {[
            "¿Cómo protege SyncScope la información de mi equipo?",
            "¿SyncScope funciona con equipos remotos o híbridos?",
            "¿Qué integraciones están disponibles actualmente?",
            "¿Cómo protegen la privacidad y los datos de mi equipo?",
            "¿Tienen soporte técnico disponible?",
          ].map((question, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
                <ChevronDown className="w-5 h-5 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Funcionalidades Clave</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Auditoría de Código Automatizada</h3>
            <p className="text-gray-600">
              Evalúa en segundos la calidad del código y detecta problemas de seguridad sin intervención manual.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Monitoreo de Tiempos en Tiempo Real</h3>
            <p className="text-gray-600">
              Registra automáticamente cuánto tiempo dedica cada miembro a tareas específicas dentro de su flujo de
              trabajo.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reportes Inteligentes de Productividad</h3>
            <p className="text-gray-600">
              Genera informes accionables para tomar decisiones basadas en datos concretos, no suposiciones.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sistema de Alertas Proactivas</h3>
            <p className="text-gray-600">
              Recibe notificaciones ante caídas de rendimiento, acumulación de bugs o desviaciones del sprint.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Link className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Integración con GitHub, GitLab y Jira</h3>
            <p className="text-gray-600">
              Conecta tus herramientas actuales y centraliza todo en un solo panel, sin cambiar de entorno.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Análisis Predictivo de Proyectos</h3>
            <p className="text-gray-600">
              Detecta patrones de comportamiento que podrían afectar la entrega y sugiere acciones preventivas.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Notes Section */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Notas legales</h2>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            SyncScope es una plataforma en desarrollo con fines académicos y de prueba. Su uso actual no constituye un
            servicio comercial formal ni está destinado a reemplazar herramientas certificadas en entornos de
            producción.
          </p>

          <p>
            La información generada por la plataforma es referencial y no debe ser utilizada como única fuente para
            decisiones críticas sin validación humana.
          </p>

          <p>
            Los datos proporcionados por los usuarios (como correo, repositorios y métricas) serán tratados con estricta
            confidencialidad y no serán compartidos con terceros sin consentimiento explícito.
          </p>

          <p>
            SyncScope no se hace responsable por daños derivados del mal uso de la aplicación, integraciones incorrectas
            o interpretación errónea de los reportes generados.
          </p>

          <p>
            Todos los nombres, logos e interfaces mostradas son propiedad intelectual de sus respectivos autores. Su
            reproducción total o parcial sin autorización está prohibida.
          </p>

          <p>Al utilizar esta plataforma, aceptas nuestros Términos de Uso y Política de Privacidad.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
