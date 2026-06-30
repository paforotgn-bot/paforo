import type { Locale } from '@/lib/constants';

interface ServicePageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroTitleHighlight?: string;
  heroSubtitle: string;
  cta?: string;
  featuresTitle?: string;
  icon: string;
  features: { title: string; description: string }[];
  benefits: { bad: string; good: string }[];
  faqs: { question: string; answer: string }[];
}

const servicesData: Record<Locale, Record<string, ServicePageData>> = {
  es: {
    'desarrollo-web': {
      slug: 'desarrollo-web',
      title: 'Desarrollo Web',
      metaTitle: 'Diseño y Desarrollo Web | La mejor web de tu sector',
      metaDescription: 'Diseñamos la web más atractiva de tu sector y la que más convierte. Diseño que enamora, velocidad real y cada detalle pensado para venderte clientes.',
      heroTitle: 'La web más atractiva de tu sector.',
      heroTitleHighlight: 'Y la que más convierte.',
      heroSubtitle: '',
      cta: 'Quiero esa web',
      featuresTitle: 'Todo lo que tu web necesita para traerte clientes',
      icon: '🌐',
      features: [
        { title: 'Mejor que tu competencia', description: 'Estudiamos las webs de la competencia y construimos la tuya para superarlas en diseño, velocidad y experiencia. Para que cuando te comparen, te elijan a ti.' },
        { title: 'Impecable en el móvil', description: 'Ahí está la mayoría de tus clientes. Tu web se ve y funciona perfecta en cualquier móvil, sin nada descuadrado ni botones imposibles de pulsar.' },
        { title: 'Pensada para convertir', description: 'Cada sección guía al visitante hacia la acción, diseñada para que el cliente haga clic en tu sección de contacto, tu botón de llamada o tu WhatsApp.' },
        { title: 'Rápida de verdad', description: 'Carga al instante. Nadie se va por esperar y Google te premia poniéndote por delante.' },
        { title: 'Se entiende a la primera', description: 'Nada de textos de relleno. Cada palabra cuenta lo justo para que quien entra capte en segundos qué haces y por qué te necesita.' },
        { title: 'Tú al mando', description: 'Cambia textos, fotos y ofertas cuando quieras, sin depender de nadie y sin tocar una línea de código.' },
      ],
      benefits: [
        { bad: 'Una web de plantilla idéntica a la de mil empresas', good: 'Un diseño único que te convierte en el referente de tu sector' },
        { bad: 'Una web bonita en la que nadie acaba comprando', good: 'Cada elemento diseñado para convertir visitas en clientes' },
        { bad: 'Una web lenta que la gente abandona antes de entrar', good: 'Carga instantánea: nadie se va por esperar' },
        { bad: 'Llamar al programador cada vez que cambias una coma', good: 'Tú controlas tu web y la actualizas cuando quieras' },
        { bad: 'Una web que en el móvil se ve rota', good: 'Impecable en el móvil, justo donde están tus clientes' },
      ],
      faqs: [
        { question: '¿Qué hace que vuestra web sea mejor que la de mi competencia?', answer: 'Estudiamos a fondo tu sector y la web de tus competidores, y diseñamos la tuya para superarlas en lo que importa: que entre más gente, se quede más tiempo y acabe comprándote. Bonita y eficaz, no una cosa o la otra.' },
        { question: '¿Cuánto cuesta una web?', answer: 'Depende de lo que necesites. Una landing desde 2.000€, una web completa desde 5.000€ y una tienda online desde 8.000€. Escríbenos y te damos un precio cerrado, sin sorpresas.' },
        { question: '¿Cuánto tardáis en tenerla lista?', answer: 'Una landing en 2-3 semanas, una web completa en 4-8 semanas y una tienda online en 8-12 semanas. Vamos rápido sin sacrificar el resultado.' },
        { question: 'Ya tengo web, ¿la podéis mejorar?', answer: 'La reinventamos desde cero para que por fin trabaje para ti: mejor imagen, más velocidad y pensada para vender. Y si hace falta, nos encargamos del mantenimiento para que no tengas que preocuparte de nada.' },
      ],
    },
    'desarrollo-software': {
      slug: 'desarrollo-software',
      title: 'Desarrollo Software',
      metaTitle: 'Software a medida | Olvídate de las soluciones genéricas',
      metaDescription: 'Software único, hecho a la medida exacta de tu negocio: te ahorra horas, automatiza procesos y crece contigo. Nada de plantillas ni de pagar por lo que no usas.',
      heroTitle: 'Olvídate de soluciones genéricas.',
      heroTitleHighlight: 'Tu software, a tu medida.',
      heroSubtitle: '',
      cta: 'Quiero mi software',
      featuresTitle: 'Lo que un software a medida hace por tu negocio',
      icon: '⚙️',
      features: [
        { title: 'Hecho solo para ti', description: 'Nada de plantillas ni de pagar por funciones que no usas. Construimos exactamente lo que tu negocio necesita, como lo necesita.' },
        { title: 'Te ahorra horas cada día', description: 'Eliminamos el trabajo manual y repetitivo para que tú y tu equipo dediquéis el tiempo a lo que de verdad importa.' },
        { title: 'Automatiza tus procesos', description: 'Tareas, avisos, datos y gestiones que antes hacías a mano ahora pasan solas y sin errores.' },
        { title: 'Crece contigo', description: 'Empezamos por lo que necesitas hoy y lo ampliamos a medida que tu negocio crece, sin tener que rehacerlo todo.' },
        { title: 'Todo en un solo sitio', description: 'Centralizamos tu información y tus herramientas para que dejes de saltar entre Excel, apps y mil pestañas.' },
        { title: 'Es tuyo de verdad', description: 'El software es tuyo: sin ataduras, sin licencias eternas y pensado para durar.' },
      ],
      benefits: [
        { bad: 'Software genérico que no encaja con tu negocio', good: 'Software 100% personalizado para tus procesos exactos' },
        { bad: 'Copy-paste de soluciones de otros clientes', good: 'Desarrollo desde cero pensado para tu caso de uso' },
        { bad: 'Código de terceros del que no eres dueño', good: 'Propiedad total del código: es tuyo para siempre' },
        { bad: 'Sistemas aislados que no hablan entre sí', good: 'Integración con tu CRM, ERP y herramientas existentes' },
        { bad: 'Soluciones que no escalan cuando creces', good: 'Arquitectura escalable que crece contigo sin límites' },
      ],
      faqs: [
        { question: '¿En qué se diferencia de un software ya hecho?', answer: 'Un software ya hecho te obliga a adaptar tu negocio a él. El nuestro es justo al revés: lo construimos a la medida exacta de cómo trabajas, sin funciones de relleno y sin pagar por lo que no usas.' },
        { question: '¿Cuánto cuesta un software a medida?', answer: 'Depende de lo que necesites. Lo estudiamos contigo y te damos un precio cerrado, sin sorpresas. Proyectos desde 5.000€.' },
        { question: '¿Cuánto tardáis en tenerlo listo?', answer: 'Según la complejidad, entre 6 y 12 semanas, con entregas cada semana para que veas el avance desde el primer momento.' },
        { question: '¿Os encargáis del mantenimiento?', answer: 'Sí. Nos ocupamos de que todo funcione y siga mejorando con el tiempo, para que tú no tengas que preocuparte de nada.' },
      ],
    },
  },
  en: {
    'desarrollo-web': {
      slug: 'web-development',
      title: 'Web Development',
      metaTitle: 'Web Development | Professional Websites',
      metaDescription: 'Professional web development. Fast, accessible and optimized websites with Next.js and React. Responsive design and conversion-oriented.',
      heroTitle: 'Fast, modern websites that convert',
      heroSubtitle: 'Web development with the best technologies: Next.js, React, Tailwind CSS. Performance, accessibility and SEO from day one.',
      icon: '🌐',
      features: [
        { title: 'Next.js & React', description: 'Development with modern frameworks for maximum performance and user experience.' },
        { title: 'Responsive Design', description: 'Your website looks perfect on mobile, tablet and desktop. Always mobile-first.' },
        { title: 'Performance Optimization', description: 'Lighthouse 95+, optimized Core Web Vitals and ultra-fast loading.' },
        { title: 'Integrated SEO', description: 'Web architecture designed for SEO from the first line of code.' },
        { title: 'Headless CMS', description: 'Easy content management with headless CMS like Sanity or Contentful.' },
        { title: 'E-commerce', description: 'Online stores with Shopify, WooCommerce or custom solutions.' },
      ],
      benefits: [
        { bad: 'Generic template website like a thousand others', good: '100% custom design for your brand and goals' },
        { bad: 'Heavy WordPress that takes 5 seconds to load', good: 'Next.js with ultra-fast loading and Lighthouse 95+' },
        { bad: 'Pretty website that doesn\'t convert or rank', good: 'Architecture built for SEO and conversion from day 1' },
        { bad: 'Depending on a developer for every small change', good: 'Easy CMS so you manage content without touching code' },
        { bad: 'Website that breaks on mobile or loads slowly', good: 'Mobile-first, perfect responsive on any device' },
      ],
      faqs: [
        { question: 'What technologies do you use?', answer: 'We mainly work with Next.js, React, TypeScript and Tailwind CSS. We choose the technology based on each project\'s needs.' },
        { question: 'How much does a website cost?', answer: 'It depends on complexity. A landing page from €2,000, a corporate website from €5,000, an e-commerce from €8,000. Contact for an exact quote.' },
        { question: 'How long does development take?', answer: 'A landing page 2-3 weeks, a corporate website 4-8 weeks, an e-commerce 8-12 weeks. Depends on complexity and content.' },
        { question: 'Does it include maintenance?', answer: 'Yes, we offer maintenance plans that include updates, backups, monitoring and technical support.' },
      ],
    },
    'desarrollo-software': {
      slug: 'software-development',
      title: 'Software Development',
      metaTitle: 'Custom Software Development',
      metaDescription: 'Custom software development. APIs, dashboards, integrations and enterprise applications. Technology that scales with your business.',
      heroTitle: 'Custom software that scales your business',
      heroSubtitle: 'We develop applications, APIs and custom enterprise tools with modern technologies and scalable architectures.',
      icon: '⚙️',
      features: [
        { title: 'APIs & Microservices', description: 'Modern architecture with scalable and secure REST and GraphQL APIs.' },
        { title: 'Dashboards & Panels', description: 'Real-time data visualization for better decision making.' },
        { title: 'Integrations', description: 'Connection between systems, CRMs, ERPs and third-party tools.' },
        { title: 'Enterprise Apps', description: 'Internal applications for management, inventory, HR and processes.' },
        { title: 'Databases', description: 'Design and optimization of relational and NoSQL databases.' },
        { title: 'Cloud & DevOps', description: 'Cloud deployment with CI/CD, monitoring and auto-scaling.' },
      ],
      benefits: [
        { bad: 'Generic software that doesn\'t fit your business', good: '100% custom software for your exact processes' },
        { bad: 'Copy-pasting solutions from other clients', good: 'Built from scratch for your specific use case' },
        { bad: 'Third-party code you don\'t own', good: 'Full code ownership: it\'s yours forever' },
        { bad: 'Isolated systems that don\'t talk to each other', good: 'Integration with your CRM, ERP and existing tools' },
        { bad: 'Solutions that don\'t scale when you grow', good: 'Scalable architecture that grows with you' },
      ],
      faqs: [
        { question: 'What type of software do you develop?', answer: 'We develop APIs, dashboards, enterprise apps, integrations, automations and any software solution your business needs.' },
        { question: 'What backend technologies do you use?', answer: 'Node.js, Python, Go and databases like PostgreSQL and MongoDB. We choose based on project requirements.' },
        { question: 'Do you offer software maintenance?', answer: 'Yes, we offer maintenance and continuous support plans, including updates, monitoring and incident resolution.' },
        { question: 'Can I integrate the software with my current tools?', answer: 'Absolutely. We develop integrations with CRMs, ERPs, marketing tools, payment gateways and any system with an API.' },
      ],
    },
  },
  ca: {
    'desarrollo-web': {
      slug: 'desenvolupament-web',
      title: 'Desenvolupament Web',
      metaTitle: 'Desenvolupament Web | Pàgines Web Professionals',
      metaDescription: 'Desenvolupament web professional. Webs ràpides, accessibles i optimitzades amb Next.js i React.',
      heroTitle: 'Webs ràpides, modernes i que converteixen',
      heroSubtitle: 'Desenvolupament web amb les millors tecnologies: Next.js, React, Tailwind CSS.',
      icon: '🌐',
      features: [
        { title: 'Next.js & React', description: 'Desenvolupament amb frameworks moderns per al màxim rendiment.' },
        { title: 'Disseny responsive', description: 'El teu web es veu perfecte en mòbil, tauleta i escriptori.' },
        { title: 'Optimització de rendiment', description: 'Lighthouse 95+, Core Web Vitals optimitzats.' },
        { title: 'SEO integrat', description: 'Arquitectura web pensada per a SEO des de la primera línia de codi.' },
        { title: 'CMS Headless', description: 'Gestió de contingut fàcil amb CMS headless.' },
        { title: 'E-commerce', description: 'Botigues online amb Shopify, WooCommerce o solucions a mida.' },
      ],
      benefits: [
        { bad: 'Web amb plantilla genèrica igual que mil empreses', good: 'Disseny 100% a mida per a la teva marca i objectius' },
        { bad: 'WordPress pesat que tarda 5 segons a carregar', good: 'Next.js amb càrrega ultraràpida i Lighthouse 95+' },
        { bad: 'Web bonica però que no converteix ni posiciona', good: 'Arquitectura pensada per a SEO i conversió des del dia 1' },
        { bad: 'Dependre d\'un programador per cada canvi', good: 'CMS fàcil perquè gestionis el teu contingut sense tocar codi' },
        { bad: 'Web que es trenca al mòbil o tarda a carregar', good: 'Mobile-first, responsive perfecte en qualsevol dispositiu' },
      ],
      faqs: [
        { question: 'Quines tecnologies utilitzeu?', answer: 'Treballem principalment amb Next.js, React, TypeScript i Tailwind CSS.' },
        { question: 'Quant costa una pàgina web?', answer: 'Depèn de la complexitat. Landing page des de 2.000€, web corporativa des de 5.000€, e-commerce des de 8.000€.' },
        { question: 'Quant tarda el desenvolupament?', answer: 'Landing page 2-3 setmanes, web corporativa 4-8 setmanes, e-commerce 8-12 setmanes.' },
        { question: 'Inclou manteniment?', answer: 'Sí, oferim plans de manteniment amb actualitzacions, backups i suport tècnic.' },
      ],
    },
    'desarrollo-software': {
      slug: 'desenvolupament-software',
      title: 'Desenvolupament Software',
      metaTitle: 'Desenvolupament Software a Mida',
      metaDescription: 'Desenvolupament de software a mida. APIs, dashboards, integracions i aplicacions empresarials.',
      heroTitle: 'Software a mida que escala el teu negoci',
      heroSubtitle: 'Desenvolupem aplicacions, APIs i eines empresarials a mida.',
      icon: '⚙️',
      features: [
        { title: 'APIs i microserveis', description: 'Arquitectura moderna amb APIs REST i GraphQL escalables.' },
        { title: 'Dashboards i panells', description: 'Visualització de dades en temps real.' },
        { title: 'Integracions', description: 'Connexió entre sistemes, CRMs, ERPs i eines de tercers.' },
        { title: 'Apps empresarials', description: 'Aplicacions internes per a gestió, inventari i processos.' },
        { title: 'Bases de dades', description: 'Disseny i optimització de bases de dades relacionals i NoSQL.' },
        { title: 'Cloud & DevOps', description: 'Desplegament al núvol amb CI/CD i monitorització.' },
      ],
      benefits: [
        { bad: 'Software genèric que no encaixa amb el teu negoci', good: 'Software 100% personalitzat per als teus processos exactes' },
        { bad: 'Copy-paste de solucions d\'altres clients', good: 'Desenvolupament des de zero pensat per al teu cas d\'ús' },
        { bad: 'Codi de tercers del que no ets propietari', good: 'Propietat total del codi: és teu per sempre' },
        { bad: 'Sistemes aïllats que no parlen entre ells', good: 'Integració amb el teu CRM, ERP i eines existents' },
        { bad: 'Solucions que no escalen quan creixes', good: 'Arquitectura escalable que creix amb tu sense límits' },
      ],
      faqs: [
        { question: 'Quin tipus de software desenvolupeu?', answer: 'APIs, dashboards, apps empresarials, integracions, automatitzacions i qualsevol solució de software.' },
        { question: 'Quines tecnologies useu per backend?', answer: 'Node.js, Python, Go i bases de dades com PostgreSQL i MongoDB.' },
        { question: 'Oferiu manteniment del software?', answer: 'Sí, oferim plans de manteniment i suport continu.' },
        { question: 'Puc integrar el software amb les meves eines actuals?', answer: 'Per descomptat. Desenvolupem integracions amb CRMs, ERPs i qualsevol sistema amb API.' },
      ],
    },
  },
};

export function getServiceData(locale: Locale, slug: string): ServicePageData | null {
  // First try direct key lookup
  if (servicesData[locale]?.[slug]) return servicesData[locale][slug];
  // Then try matching by translated slug
  const entries = Object.values(servicesData[locale] || {});
  return entries.find((s) => s.slug === slug) || null;
}

export function getAllServiceSlugs(): string[] {
  const locales: Locale[] = ['es', 'en', 'ca'];
  const slugs = new Set<string>();
  for (const locale of locales) {
    for (const service of Object.values(servicesData[locale])) {
      slugs.add(service.slug);
    }
  }
  return Array.from(slugs);
}
