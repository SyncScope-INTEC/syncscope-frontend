import { NextRequest, NextResponse } from 'next/server'
import { getStripe, STRIPE_CONFIG } from '@/lib/stripe/config'
import { generateSecurePassword, getCustomFieldValue, sendWelcomeEmail } from '@/lib/stripe/utils'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verificar el evento de Stripe
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_CONFIG.webhookSecret
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Manejar el evento de checkout completado
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Extraer datos del cliente
      const email = session.customer_details?.email || ''
      const phone = session.customer_details?.phone || ''
      const firstName = getCustomFieldValue(session, 'first_name') || ''
      const lastName = getCustomFieldValue(session, 'last_name') || ''
      const companyName = getCustomFieldValue(session, 'company_name') || ''
      const role = getCustomFieldValue(session, 'role') || 'developer'
      const timezone = getCustomFieldValue(session, 'timezone') || 'America/Bogota'
      const plan = session.metadata?.plan || 'starter'

      // Verificar si el usuario ya existe
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL
      if (!authUrl) {
        console.error('NEXT_PUBLIC_AUTH_URL not configured')
        return NextResponse.json({ received: true })
      }

      try {
        // Intentar verificar si el usuario existe
        const checkResponse = await fetch(`${authUrl}/auth/verify-email/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })

        // Si el usuario ya existe (status 200), no hacer nada
        if (checkResponse.ok) {
          console.log(`User ${email} already exists, skipping webhook registration`)
          return NextResponse.json({ received: true })
        }
      } catch (error) {
        // Si falla la verificación, continuar con el registro
        console.log('Could not verify user existence, proceeding with registration')
      }

      // Generar password temporal
      const tempPassword = generateSecurePassword()

      // Crear usuario en el backend
      try {
        const registerResponse = await fetch(`${authUrl}/auth/register/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            phone_number: phone,
            password: tempPassword,
            password_confirm: tempPassword,
            company_name: companyName,
            role,
            plan,
          }),
        })

        if (!registerResponse.ok) {
          const errorData = await registerResponse.json()
          console.error('Failed to register user via webhook:', errorData)
          // No retornar error para que Stripe no reintente
          return NextResponse.json({ received: true })
        }

        // Enviar email de bienvenida
        await sendWelcomeEmail(email, tempPassword, `${firstName} ${lastName}`)

        console.log(`✅ User ${email} registered successfully via webhook`)
      } catch (error: any) {
        console.error('Error registering user via webhook:', error.message)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
