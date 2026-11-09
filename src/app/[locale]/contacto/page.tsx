import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Section } from '@/components/ui/section';
import { ContactForm } from '@/components/forms/contact-form';
import { COPY } from '@/content/copy';
import { NAP, type Locale } from '@/lib/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  return generatePageMetadata({
    title: COPY.contact.title[l],
    description: COPY.contact.lede[l],
    locale: l,
    path: '/contacto',
  });
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const dict = await getDictionary(l);

  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-[minmax(0,32ch)_minmax(0,52ch)] md:gap-20">
        <div>
          <h1 className="display-sm">{COPY.contact.title[l]}</h1>
          <p className="lede mt-6">{COPY.contact.lede[l]}</p>

          <div className="mt-10 flex flex-col gap-2">
            <a href={`mailto:${NAP.email}`} className="label hover:!text-paper">
              {NAP.email}
            </a>
            <a
              href={`tel:${NAP.phone.replace(/\s/g, '')}`}
              className="label hover:!text-paper"
            >
              {NAP.phone}
            </a>
          </div>
        </div>

        <ContactForm dict={dict} />
      </div>
    </Section>
  );
}
