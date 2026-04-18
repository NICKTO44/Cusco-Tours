import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const OWNER_EMAIL = 'masccatourscusco@gmail.com'
const FROM_EMAIL = 'Cusco Mascca Tours <contacto@cuscomasccatour.com>'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      serviceName,
      date,
      people,
      hotel,
      pickupTime,
      totalUsd,
      notes,
      paidWithPaypal = false,
    } = body

    const serviceLabel = serviceType === 'tour' ? 'Tour' : 'Movilidad Privada'

    const paymentBadge = paidWithPaypal
      ? `<div style="background: #e8f0fe; border: 1px solid #4a90d9; border-radius: 8px; padding: 14px 20px; margin: 20px 0; display: flex; align-items: center; gap: 10px;">
           <span style="font-size: 22px;">💳</span>
           <div>
             <p style="margin: 0; font-weight: bold; color: #1a56db;">Pago confirmado con PayPal</p>
             <p style="margin: 4px 0 0; font-size: 13px; color: #374151;">El cliente ya realizó el pago. Total cobrado: <strong>$${totalUsd} USD</strong></p>
           </div>
         </div>`
      : `<div style="background: #fff8e1; border: 1px solid #f4a261; border-radius: 8px; padding: 14px 20px; margin: 20px 0;">
           <p style="margin: 0; font-weight: bold; color: #b45309;">⏳ Pago pendiente</p>
           <p style="margin: 4px 0 0; font-size: 13px; color: #374151;">El cliente confirmó por WhatsApp. Coordinar pago.</p>
         </div>`

    const paymentBadgeClient = paidWithPaypal
      ? `<div style="background: #e8f5e9; border: 1px solid #2d6a4f; border-radius: 8px; padding: 14px 20px; margin: 20px 0;">
           <p style="margin: 0; font-weight: bold; color: #2d6a4f;">✅ Pago confirmado con PayPal</p>
           <p style="margin: 4px 0 0; font-size: 13px; color: #374151;">Tu pago de <strong>$${totalUsd} USD</strong> fue procesado exitosamente. ¡Nos vemos pronto!</p>
         </div>`
      : `<div style="background: #fff8e1; border: 1px solid #f4a261; border-radius: 8px; padding: 14px 20px; margin: 20px 0;">
           <p style="margin: 0; font-weight: bold; color: #b45309;">⏳ Reserva pendiente de pago</p>
           <p style="margin: 4px 0 0; font-size: 13px; color: #374151;">Nos pondremos en contacto contigo para coordinar el pago.</p>
         </div>`

    // Email al cliente
    await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: paidWithPaypal
        ? `✅ Pago confirmado — Cusco Mascca Tours`
        : `📋 Reserva recibida — Cusco Mascca Tours`,
        replyTo: OWNER_EMAIL,

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2d6a4f; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0;">Cusco Mascca Tours</h1>
          </div>
          <div style="padding: 32px; background: #f9f9f9;">
            <h2 style="color: #2d6a4f;">¡Hola, ${clientName}!</h2>
            <p>${paidWithPaypal
              ? 'Tu pago fue procesado exitosamente. ¡Gracias por reservar con nosotros!'
              : 'Hemos recibido tu solicitud. Nos pondremos en contacto contigo pronto para confirmar los detalles.'
            }</p>

            ${paymentBadgeClient}

            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #2d6a4f;">
              <h3 style="color: #2d6a4f; margin-top: 0;">Detalles de tu reserva</h3>
              <p><strong>Servicio:</strong> ${serviceLabel} — ${serviceName}</p>
              ${date ? `<p><strong>Fecha:</strong> ${date}</p>` : ''}
              ${people ? `<p><strong>Personas:</strong> ${people}</p>` : ''}
              ${hotel ? `<p><strong>Hotel recogida:</strong> ${hotel}</p>` : ''}
              ${pickupTime ? `<p><strong>Hora recogida:</strong> ${pickupTime}</p>` : ''}
              ${totalUsd ? `<p><strong>Total:</strong> $${totalUsd} USD</p>` : ''}
              ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
            </div>

            <div style="background: #e8f5e9; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0;"><strong>¿Preguntas?</strong> Escríbenos por WhatsApp:</p>
              <p style="margin: 8px 0 0;">
                <a href="https://wa.me/51927591622" style="color: #2d6a4f; font-weight: bold;">+51 927 591 622</a>
              </p>
            </div>
          </div>
          <div style="background: #2d6a4f; padding: 16px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">© 2025 Cusco Mascca Tours — info@cuscomasccatour.com</p>
          </div>
        </div>
      `,
    })

    // Email al dueño
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: paidWithPaypal
        ? `💳 PAGO RECIBIDO — ${clientName} — $${totalUsd} USD`
        : `🔔 Nueva reserva — ${clientName}`,
        replyTo: clientEmail,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2d6a4f; padding: 24px;">
            <h1 style="color: white; margin: 0;">Nueva Reserva</h1>
          </div>
          <div style="padding: 32px; background: #f9f9f9;">

            ${paymentBadge}

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