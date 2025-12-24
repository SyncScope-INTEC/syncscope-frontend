import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle, Clock, BarChart3, Bell, Link, Lightbulb } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-brand-light/30">
      <Header />

      {/* Hero Section */}
      <section className="relative px-6 py-16 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-light/50 to-transparent rounded-full blur-3xl"></div>

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
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border border-gray-200 rounded-lg bg-white px-6">
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
              ¿Cómo protege SyncScope la información de mi equipo?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              SyncScope implementa múltiples capas de seguridad para proteger tu información:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Encriptación de extremo a extremo para todos los datos en tránsito</li>
                <li>Almacenamiento seguro con encriptación AES-256</li>
                <li>Autenticación de dos factores (2FA) disponible</li>
                <li>Auditorías de seguridad regulares</li>
                <li>Cumplimiento con estándares GDPR y SOC 2</li>
              </ul>
              Nunca compartimos tus datos con terceros sin tu consentimiento explícito.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border border-gray-200 rounded-lg bg-white px-6">
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
              ¿SyncScope funciona con equipos remotos o híbridos?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              Sí, SyncScope está diseñado específicamente para equipos distribuidos. Funciona perfectamente con:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Equipos 100% remotos</li>
                <li>Equipos híbridos (presencial + remoto)</li>
                <li>Equipos en diferentes zonas horarias</li>
                <li>Colaboradores freelance o contratistas</li>
              </ul>
              El monitoreo automático de tiempo y las integraciones con GitHub/GitLab funcionan independientemente de la ubicación del equipo.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border border-gray-200 rounded-lg bg-white px-6">
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
              ¿Qué integraciones están disponibles actualmente?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              SyncScope se integra con las herramientas más populares de desarrollo:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Control de versiones:</strong> GitHub, GitLab</li>
                <li><strong>Gestión de proyectos:</strong> Jira (próximamente)</li>
                <li><strong>Comunicación:</strong> Slack, Microsoft Teams (próximamente)</li>
                <li><strong>CI/CD:</strong> Jenkins, CircleCI (en desarrollo)</li>
              </ul>
              Estamos constantemente agregando nuevas integraciones basadas en las solicitudes de nuestros usuarios.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border border-gray-200 rounded-lg bg-white px-6">
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
              ¿Cómo protegen la privacidad y los datos de mi equipo?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              La privacidad es nuestra prioridad máxima:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Solo recopilamos métricas de desarrollo necesarias (commits, tiempo de sesión, etc.)</li>
                <li>No monitoreamos contenido de código fuente ni mensajes privados</li>
                <li>Los datos son propiedad exclusiva de tu empresa</li>
                <li>Puedes exportar o eliminar todos tus datos en cualquier momento</li>
                <li>Cumplimos con GDPR, CCPA y otras regulaciones de privacidad</li>
              </ul>
              Transparencia total: puedes revisar exactamente qué datos recopilamos en nuestra política de privacidad.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border border-gray-200 rounded-lg bg-white px-6">
            <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
              ¿Tienen soporte técnico disponible?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 leading-relaxed">
              Ofrecemos diferentes niveles de soporte según tu plan:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Plan Starter:</strong> Soporte por email con respuesta en 24-48 horas</li>
                <li><strong>Plan Growth:</strong> Soporte prioritario por email y chat en horario laboral</li>
                <li><strong>Plan Enterprise:</strong> Soporte premium 24/7, onboarding asistido, y gestor de cuenta dedicado</li>
              </ul>
              Además, todos los planes incluyen acceso a nuestra base de conocimientos, tutoriales en video y documentación completa.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Key Features Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Funcionalidades Clave</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
              <CheckCircle className="w-6 h-6 text-brand-dark" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Auditoría de Código Automatizada</h3>
            <p className="text-gray-600">
              Evalúa en segundos la calidad del código y detecta problemas de seguridad sin intervención manual.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-brand-dark" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Monitoreo de Tiempos en Tiempo Real</h3>
            <p className="text-gray-600">
              Registra automáticamente cuánto tiempo dedica cada miembro a tareas específicas dentro de su flujo de
              trabajo.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-brand-dark" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reportes Inteligentes de Productividad</h3>
            <p className="text-gray-600">
              Genera informes accionables para tomar decisiones basadas en datos concretos, no suposiciones.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
              <Bell className="w-6 h-6 text-brand-dark" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sistema de Alertas Proactivas</h3>
            <p className="text-gray-600">
              Recibe notificaciones ante caídas de rendimiento, acumulación de bugs o desviaciones del sprint.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
              <Link className="w-6 h-6 text-brand-dark" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Integración con GitHub, GitLab y Jira</h3>
            <p className="text-gray-600">
              Conecta tus herramientas actuales y centraliza todo en un solo panel, sin cambiar de entorno.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-brand-light rounded-lg flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-brand-dark" />
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
