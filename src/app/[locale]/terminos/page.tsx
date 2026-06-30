import { generatePageMetadata } from '@/lib/seo/metadata';
import { Section } from '@/components/ui/section';
import { NAP } from '@/lib/constants';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'Términos y condiciones',
    description: 'Términos y condiciones de uso del sitio web de Paforo.',
    locale: locale as Locale,
    path: '/terminos',
  });
}

export default async function TerminosPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl prose prose-lg prose-headings:text-foreground prose-p:text-muted prose-a:text-violet prose-strong:text-foreground prose-li:text-muted">
        <h1>Términos y condiciones</h1>
        <p>
          El uso de este sitio web implica la aceptación de los presentes términos y condiciones. Te
          recomendamos leerlos con atención.
        </p>

        <h2>Titular del sitio</h2>
        <ul>
          <li><strong>Titular:</strong> Pablo Fontanet Rodríguez (autónomo)</li>
          <li><strong>NIF:</strong> 48016485Y</li>
          <li><strong>Domicilio:</strong> {NAP.address.addressLocality}, {NAP.address.addressRegion}</li>
          <li><strong>Email:</strong> {NAP.email}</li>
        </ul>

        <h2>Objeto</h2>
        <p>
          Este sitio tiene como finalidad presentar los servicios de Paforo (desarrollo web y software a
          medida) y permitir el contacto con personas interesadas. El presupuesto y las condiciones de cada
          proyecto se acuerdan de forma individual por escrito.
        </p>

        <h2>Uso del sitio</h2>
        <p>
          Te comprometes a hacer un uso adecuado de la web y a no emplearla para actividades ilícitas o que
          perjudiquen a terceros. Nos reservamos el derecho de retirar o modificar contenidos sin previo aviso.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Los textos, diseños, logotipos y demás elementos de esta web son propiedad de su titular o se usan
          con autorización. No está permitida su reproducción sin consentimiento expreso.
        </p>

        <h2>Responsabilidad</h2>
        <p>
          Procuramos que la información sea correcta y esté actualizada, pero no garantizamos la ausencia de
          errores. No nos hacemos responsables de los daños derivados del uso del sitio o de la
          imposibilidad de acceder a él.
        </p>

        <h2>Legislación aplicable</h2>
        <p>
          Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se
          someten a los juzgados y tribunales que correspondan conforme a la ley.
        </p>

        <p>
          Para cualquier duda, escríbenos a <a href={`mailto:${NAP.email}`}>{NAP.email}</a>.
        </p>

        <p className="text-sm">Última actualización: 2026.</p>
      </div>
    </Section>
  );
}
