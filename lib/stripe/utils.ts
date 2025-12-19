import Stripe from 'stripe'

/**
 * Genera un password seguro aleatorio
 */
export function generateSecurePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'

  const allChars = lowercase + uppercase + numbers + symbols

  let password = ''
  // Asegurar al menos un carácter de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Llenar el resto
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Mezclar el password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Extrae el valor de un custom field de Stripe
 */
export function getCustomFieldValue(
  session: Stripe.Checkout.Session,
  key: string
): string | null {
  if (!session.custom_fields) return null

  const field = session.custom_fields.find((f) => f.key === key)
  if (!field) return null

  // @ts-ignore - Stripe types can be complex
  if (field.text) return field.text.value
  // @ts-ignore
  if (field.dropdown) return field.dropdown.value
  // @ts-ignore
  if (field.numeric) return field.numeric.value?.toString()

  return null
}

/**
 * Valida que un email sea válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Formatea un monto de Stripe (en centavos) a dólares
 */
export function formatStripeAmount(amount: number): string {
  return `$${(amount / 100).toFixed(2)}`
}

/**
 * Envía un email de bienvenida con password temporal
 * TODO: Implementar con tu servicio de email (SendGrid, Resend, etc)
 */
export async function sendWelcomeEmail(
  email: string,
  password: string,
  name: string
): Promise<void> {
  console.log('📧 Email de bienvenida (implementar con servicio real):')
  console.log(`To: ${email}`)
  console.log(`Subject: Bienvenido a SyncScope`)
  console.log(`Body:
    Hola ${name},
    
    Tu cuenta ha sido creada exitosamente.
    
    Email: ${email}
    Password temporal: ${password}
    
    Por favor inicia sesión y cambia tu password.
    
    Saludos,
    Equipo SyncScope
  `)

  // TODO: Implementar con servicio de email real
  // Ejemplo con Resend:
  // await resend.emails.send({
  //   from: 'SyncScope <noreply@syncscope.com>',
  //   to: email,
  //   subject: 'Bienvenido a SyncScope',
  //   html: `...`
  // })
}
