import { ContactForm } from '@/components/forms/contact-form';
import { NAP } from '@/lib/constants';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

const WHATSAPP_NUMBER = '34639748955';

interface ContactBlockProps {
  locale: Locale;
  dict: Dictionary;
}

function t(locale: Locale, es: string, en: string, ca: string) {
  return locale === 'en' ? en : locale === 'ca' ? ca : es;
}

export function ContactBlock({ locale, dict }: ContactBlockProps) {
  const waText = encodeURIComponent(
    t(
      locale,
      'Hola, me gustaría más información sobre vuestros servicios.',
      'Hi, I would like more information about your services.',
      'Hola, m\'agradaria més informació sobre els vostres serveis.'
    )
  );

  const details = [
    {
      label: 'Email',
      value: NAP.email,
      href: `mailto:${NAP.email}`,
      icon: (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 5L2 7" />
        </>
      ),
    },
    {
      label: t(locale, 'Teléfono', 'Phone', 'Telèfon'),
      value: NAP.phone,
      href: `tel:${NAP.phone.replace(/\s/g, '')}`,
      icon: (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      ),
    },
    {
      label: t(locale, 'Horario', 'Schedule', 'Horari'),
      value: t(locale, 'Lun - Vie: 9:00 - 18:00', 'Mon - Fri: 9:00 - 18:00', 'Dl - Dv: 9:00 - 18:00'),
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </>
      ),
    },
    {
      label: t(locale, 'Ubicación', 'Location', 'Ubicació'),
      value: `${NAP.address.addressLocality}, ${NAP.address.addressRegion}`,
      icon: (
        <>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
    },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
      {/* Left: direct contact */}
      <div className="space-y-8 lg:col-span-1">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            {t(locale, '¿Prefieres escribirnos directamente?', 'Prefer to reach us directly?', "Prefereixes escriure'ns directament?")}
          </h3>
          <p className="mt-3 text-muted">
            {t(
              locale,
              'Sin compromiso y sin letra pequeña. Te respondemos en menos de 24 horas.',
              'No strings attached, no fine print. We reply within 24 hours.',
              'Sense compromís ni lletra petita. Et responem en menys de 24 hores.'
            )}
          </p>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-xl bg-[#25D366] px-5 py-3.5 font-semibold text-white shadow-sm transition-transform duration-300 hover:scale-[1.03]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          {t(locale, 'Escríbenos por WhatsApp', 'Message us on WhatsApp', "Escriu-nos per WhatsApp")}
        </a>

        <div className="space-y-4">
          {details.map((d) => {
            const content = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    {d.icon}
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-semibold">{d.label}</span>
                  <span className="block text-sm text-muted">{d.value}</span>
                </span>
              </>
            );
            return d.href ? (
              <a key={d.label} href={d.href} className="flex items-center gap-4 transition-colors hover:text-violet">
                {content}
              </a>
            ) : (
              <div key={d.label} className="flex items-center gap-4">
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: form */}
      <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6 md:p-8 lg:col-span-2">
        <ContactForm dict={dict} />
      </div>
    </div>
  );
}
