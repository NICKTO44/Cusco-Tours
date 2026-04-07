import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const OWNER_EMAIL = 'kamito1809@gmail.com'
const FROM_EMAIL = 'Mascca Tours Cusco <onboarding@resend.dev>'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { clientName, clientEmail, clientPhone, serviceType, serviceName, date, people, hotel, pickupTime, totalUsd, notes } = body

    const serviceLabel = serviceType === 'tour' ? 'Tour' : 'Movilidad Privada'

    await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: `✅ Confirmación de reserva — Mascca Tours Cusco`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2d6a4f; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">Mascca Tours Cusco</h1>
          </div>
          <div style="padding: 32px; background: #f9f9f9;">
            <h2 style="color: #2d6a4f;">¡Reserva recibida, ${clientName}!</h2>
            <p>Hemos recibido tu solicitud de reserva. Nos pondremos en contacto contigo pronto para confirmar los detalles.</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #2d6a4f;">
              <h3 style="color: #2d6a4f; margin-top: 0;">Detalles de tu reserva</h3>
              <p><strong>Servicio:</strong> ${serviceLabel} — ${serviceName}</p>
              ${date ? `<p><strong>Fecha:</strong> ${date}</p>` : ''}
              ${people ? `<p><strong>Personas:</strong> ${people}</p>` : ''}
              ${hotel ? `<p><strong>Hotel recogida:</strong> ${hotel}</p>` : ''}
              ${pickupTime ? `<p><strong>Hora recogida:</strong> ${pickupTime}</p>` : ''}
              ${totalUsd ? `<p><strong>Total estimado:</strong> $${totalUsd} USD</p>` : ''}
              ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
            </div>
            <div style="background: #e8f5e9; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0;"><strong>¿Preguntas?</strong> Escríbenos por WhatsApp:</p>
              <p style="margin: 8px 0 0;"><a href="https://wa.me/51927591622" style="color: #2d6a4f; font-weight: bold;">+51 927 591 622</a></p>
            </div>
          </div>
          <div style="background: #2d6a4f; padding: 16px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">© 2025 Mascca Tours Cusco — info@masccatourscusco.com</p>
          </div>
        </div>
      `,
    })

    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `🔔 Nueva reserva — ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2d6a4f; padding: 24px;">
            <h1 style="color: white; margin: 0;">Nueva Reserva</h1>
          </div>
          <div style="padding: 32px; background: #f9f9f9;">
            <div style="background: white; border-radius: 8px; padding: 20px; border-left: 4px solid #f4a261;">
              <h3 style="color: #2d6a4f; margin-top: 0;">Datos del cliente</h3>
              <p><strong>Nombre:</strong> ${clientName}</p>
              <p><strong>Email:</strong> ${clientEmail}</p>
              <p><strong>Teléfono:</strong> ${clientPhone}</p>
            </div>
            <div style="background: white; border-radius: 8px; padding: 20px; margin-top: 16px; border-left: 4px solid #2d6a4f;">
              <h3 style="color: #2d6a4f; margin-top: 0;">Detalles del servicio</h3>
              <p><strong>Tipo:</strong> ${serviceLabel}</p>
              <p><strong>Servicio:</strong> ${serviceName}</p>
              ${date ? `<p><strong>Fecha:</strong> ${date}</p>` : ''}
              ${people ? `<p><strong>Personas:</strong> ${people}</p>` : ''}
              ${hotel ? `<p><strong>Hotel:</strong> ${hotel}</p>` : ''}
              ${pickupTime ? `<p><strong>Hora:</strong> ${pickupTime}</p>` : ''}
              ${totalUsd ? `<p><strong>Total:</strong> $${totalUsd} USD</p>` : ''}
              ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 })
  }
}
