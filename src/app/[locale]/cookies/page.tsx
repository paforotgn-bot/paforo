import { generatePageMetadata } from '@/lib/seo/metadata';
import { Section } from '@/components/ui/section';
import { NAP } from '@/lib/constants';
import type { Locale } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    title: 'Política de cookies',
    description: 'Información sobre el uso de cookies en el sitio web de Paforo.',
    locale: locale as Locale,
    path: '/cookies',
  });
}

export default async function CookiesPage() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl prose prose-lg prose-headings:text-foreground prose-p:text-muted prose-a:text-violet prose-strong:text-foreground prose-li:text-muted">
        <h1>Política de cookies</h1>
        <p>
          Una cookie es un pequeño archivo que se guarda en tu dispositivo al visitar una web. Aquí te
          explicamos cómo las usamos.
        </p>

        <h2>Cookies que utilizamos</h2>
        <p>
          Esta web utiliza únicamente cookies <strong>técnicas y necesarias</strong> para su correcto
          funcionamiento. No utilizamos cookies de publicidad ni de seguimiento de terceros con fines
          comerciales.
        </p>
        <ul>
          <li><strong>Técnicas:</strong> permiten la navegación y el uso de las funciones básicas del sitio.</li>
          <li>
            <strong>Analíticas (si aplica):</strong> nos ayudan a entender de forma anónima cómo se usa la
            web para mejorarla. Solo se activan con tu consentimiento.
          </li>
        </ul>

        <h2>Gestión de cookies</h2>
        <p>
          Puedes permitir, bloquear o eliminar las cookies desde la configuración de tu navegador. Ten en
          cuenta que desactivar algunas cookies puede afectar al funcionamiento del sitio.
        </p>

        <h2>Más información</h2>
        <p>
          Si tienes cualquier duda sobre nuestra política de cookies, escríbenos a{' '}
          <a href={`mailto:${NAP.email}`}>{NAP.email}</a>.
        </p>

        <p className="text-sm">Última actualización: 2026.</p>
      </div>
    </Section>
  );
}
