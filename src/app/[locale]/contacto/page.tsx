import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { ContactForm } from '@/components/forms/contact-form';
import { NAP } from '@/lib/constants';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: locale === 'en' ? 'Contact' : locale === 'ca' ? 'Contacte' : 'Contacto',
    description: locale === 'en'
      ? 'Contact Paforo. Tell us about your project and we will get back to you within 24 hours.'
      : 'Contacta con Paforo. Cuéntanos tu proyecto y te responderemos en menos de 24 horas.',
    locale: locale as Locale,
    path: '/contacto',
  });
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.nav.contact, href: `/${locale}/contacto` },
          ]}
        />
      </Container>

      <Section>
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {dict.contact.title}
            </h1>
            <p className="mt-4 text-lg text-muted">{dict.contact.subtitle}</p>
          </div>

          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ContactForm dict={dict} />
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-section p-6 space-y-6">
                <div>
                  <h3 className="font-bold mb-2">Email</h3>
                  <a href={`mailto:${NAP.email}`} className="text-sm text-violet hover:underline">
                    {NAP.email}
                  </a>
                </div>
                <div>
                  <h3 className="font-bold mb-2">
                    {locale === 'en' ? 'Phone' : locale === 'ca' ? 'Telèfon' : 'Teléfono'}
                  </h3>
                  <a href={`tel:${NAP.phone}`} className="text-sm text-violet hover:underline">
                    {NAP.phone}
                  </a>
                </div>
                <div>
                  <h3 className="font-bold mb-2">
                    {locale === 'en' ? 'Location' : locale === 'ca' ? 'Ubicació' : 'Ubicación'}
                  </h3>
                  <p className="text-sm text-muted">
                    {NAP.address.addressLocality}, {NAP.address.addressRegion}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">
                    {locale === 'en' ? 'Schedule' : locale === 'ca' ? 'Horari' : 'Horario'}
                  </h3>
                  <p className="text-sm text-muted">
                    {locale === 'en' ? 'Mon - Fri: 9:00 - 18:00' : 'Lun - Vie: 9:00 - 18:00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
