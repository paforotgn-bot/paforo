import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, phone, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // If Resend API key is configured, send email
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Paforo Web <noreply@paforo.com>',
        to: [process.env.CONTACT_TO_EMAIL || 'paforotgn@gmail.com'],
        replyTo: email,
        subject: `Nuevo contacto: ${name} - ${service || 'General'}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Empresa:</strong> ${company || 'No indicada'}</p>
          <p><strong>Teléfono:</strong> ${phone || 'No indicado'}</p>
          <p><strong>Servicio:</strong> ${service || 'No indicado'}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
        `,
      });
    } else {
      // Log to console in development
      console.log('Contact form submission:', { name, email, company, phone, service, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
