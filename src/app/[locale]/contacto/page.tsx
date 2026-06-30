import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Section } from '@/components/ui/section';
import { ContactBlock } from '@/components/sections/contact-block';
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
      <Section>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {dict.contact.title}
            </h1>
            <p className="mt-4 text-lg text-muted">{dict.contact.subtitle}</p>
          </div>

          <ContactBlock locale={locale as Locale} dict={dict} />
        </div>
      </Section>
    </>
  );
}
