import { generatePageMetadata } from '@/lib/seo/metadata';
import { Section } from '@/components/ui/section';
import { NAP } from '@/lib/constants';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'Política de privacidad',
    description: 'Política de privacidad de Paforo: cómo tratamos y protegemos tus datos personales.',
    locale: locale as Locale,
    path: '/privacidad',
  });
}

export default async function PrivacidadPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl prose prose-lg prose-headings:text-foreground prose-p:text-muted prose-a:text-violet prose-strong:text-foreground prose-li:text-muted">
        <h1>Política de privacidad</h1>
        <p>
          En <strong>Paforo</strong> nos tomamos en serio la privacidad de las personas que visitan nuestra
          web y contactan con nosotros. Esta política explica qué datos recogemos, con qué finalidad y qué
          derechos tienes sobre ellos.
        </p>

        <h2>Responsable del tratamiento</h2>
        <ul>
          <li><strong>Titular:</strong> Pablo Fontanet Rodríguez (autónomo)</li>
          <li><strong>NIF:</strong> 48016485Y</li>
          <li><strong>Domicilio:</strong> {NAP.address.addressLocality}, {NAP.address.addressRegion}</li>
          <li><strong>Email:</strong> {NAP.email}</li>
        </ul>

        <h2>Datos que recogemos</h2>
        <p>
          Recogemos únicamente los datos que nos facilitas al rellenar el formulario de contacto (nombre,
          email, teléfono, empresa y el mensaje que nos envías) y los datos de navegación estrictamente
          necesarios para el funcionamiento de la web.
        </p>

        <h2>Finalidad</h2>
        <p>
          Usamos tus datos para responder a tu solicitud, gestionar la relación comercial y, si nos das tu
          consentimiento, enviarte información sobre nuestros servicios. No los usamos para ninguna otra
          finalidad ni tomamos decisiones automatizadas con ellos.
        </p>

        <h2>Legitimación</h2>
        <p>
          La base legal es tu consentimiento al contactarnos y, en su caso, la ejecución de una relación
          contractual o precontractual.
        </p>

        <h2>Conservación</h2>
        <p>
          Conservamos tus datos mientras dure la relación y, después, durante los plazos legalmente exigidos.
          Cuando dejen de ser necesarios, los eliminamos de forma segura.
        </p>

        <h2>Destinatarios</h2>
        <p>
          No cedemos tus datos a terceros, salvo obligación legal. Podemos usar proveedores de servicios
          (alojamiento, email) que actúan como encargados del tratamiento bajo contrato y garantías adecuadas.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
          portabilidad escribiéndonos a <a href={`mailto:${NAP.email}`}>{NAP.email}</a>. También puedes
          presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
        </p>

        <p className="text-sm">Última actualización: 2026.</p>
      </div>
    </Section>
  );
}
