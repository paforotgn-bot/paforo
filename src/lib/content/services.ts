import type { Locale } from '@/lib/constants';

interface ServicePageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
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
      metaTitle: 'Desarrollo Web | Diseño Web Profesional a Medida',
      metaDescription: 'Agencia de desarrollo web. Creamos webs rápidas, accesibles y optimizadas para SEO con Next.js y React. Diseño responsive orientado a conversión.',
      heroTitle: 'Webs rápidas, modernas y que convierten',
      heroSubtitle: 'Desarrollo web con las mejores tecnologías: Next.js, React, Tailwind CSS. Rendimiento, accesibilidad y SEO desde el primer día.',
      icon: '🌐',
      features: [
        { title: 'Next.js & React', description: 'Desarrollo con frameworks modernos para máximo rendimiento y experiencia de usuario.' },
        { title: 'Diseño responsive', description: 'Tu web se ve perfecta en móvil, tablet y escritorio. Mobile-first siempre.' },
        { title: 'Optimización de rendimiento', description: 'Lighthouse 95+, Core Web Vitals optimizados y carga ultrarrápida.' },
        { title: 'SEO integrado', description: 'Arquitectura web pensada para SEO desde la primera línea de código.' },
        { title: 'CMS Headless', description: 'Gestión de contenido fácil con CMS headless como Sanity o Contentful.' },
        { title: 'E-commerce', description: 'Tiendas online con Shopify, WooCommerce o soluciones a medida.' },
      ],
      benefits: [
        { bad: 'Web con plantilla genérica igual que mil empresas', good: 'Diseño 100% a medida para tu marca y objetivos' },
        { bad: 'WordPress pesado que tarda 5 segundos en cargar', good: 'Next.js con carga ultrarrápida y Lighthouse 95+' },
        { bad: 'Web bonita pero que no convierte ni posiciona', good: 'Arquitectura pensada para SEO y conversión desde el día 1' },
        { bad: 'Depender de un programador para cada cambio', good: 'CMS fácil para que gestiones tu contenido sin tocar código' },
        { bad: 'Web que se rompe en móvil o tarda en cargar', good: 'Mobile-first, responsive perfecto en cualquier dispositivo' },
      ],
      faqs: [
        { question: '¿Qué tecnologías utilizáis?', answer: 'Trabajamos principalmente con Next.js, React, TypeScript y Tailwind CSS. Elegimos la tecnología según las necesidades de cada proyecto.' },
        { question: '¿Cuánto cuesta una página web?', answer: 'Depende de la complejidad. Una landing page desde 2.000€, una web corporativa desde 5.000€, un e-commerce desde 8.000€. Contacta para un presupuesto preciso.' },
        { question: '¿Cuánto tarda el desarrollo?', answer: 'Una landing page 2-3 semanas, una web corporativa 4-8 semanas, un e-commerce 8-12 semanas. Depende de la complejidad y contenido.' },
        { question: '¿Incluye mantenimiento?', answer: 'Sí, ofrecemos planes de mantenimiento que incluyen actualizaciones, backups, monitorización y soporte técnico.' },
      ],
    },
    'desarrollo-software': {
      slug: 'desarrollo-software',
      title: 'Desarrollo Software',
      metaTitle: 'Desarrollo Software a Medida | Apps y APIs',
      metaDescription: 'Empresa de desarrollo de software a medida. APIs, dashboards, integraciones y aplicaciones empresariales. Tecnología que escala con tu negocio.',
      heroTitle: 'Software a medida que escala tu negocio',
      heroSubtitle: 'Desarrollamos aplicaciones, APIs y herramientas empresariales a medida con tecnologías modernas y arquitecturas escalables.',
      icon: '⚙️',
      features: [
        { title: 'APIs y microservicios', description: 'Arquitectura moderna con APIs REST y GraphQL escalables y seguras.' },
        { title: 'Dashboards y paneles', description: 'Visualización de datos en tiempo real para tomar mejores decisiones.' },
        { title: 'Integraciones', description: 'Conexión entre sistemas, CRMs, ERPs y herramientas de terceros.' },
        { title: 'Apps empresariales', description: 'Aplicaciones internas para gestión, inventario, RRHH y procesos.' },
        { title: 'Bases de datos', description: 'Diseño y optimización de bases de datos relacionales y NoSQL.' },
        { title: 'Cloud & DevOps', description: 'Despliegue en la nube con CI/CD, monitorización y escalado automático.' },
      ],
      benefits: [
        { bad: 'Software genérico que no encaja con tu negocio', good: 'Software 100% personalizado para tus procesos exactos' },
        { bad: 'Copy-paste de soluciones de otros clientes', good: 'Desarrollo desde cero pensado para tu caso de uso' },
        { bad: 'Código de terceros del que no eres dueño', good: 'Propiedad total del código: es tuyo para siempre' },
        { bad: 'Sistemas aislados que no hablan entre sí', good: 'Integración con tu CRM, ERP y herramientas existentes' },
        { bad: 'Soluciones que no escalan cuando creces', good: 'Arquitectura escalable que crece contigo sin límites' },
      ],
      faqs: [
        { question: '¿Qué tipo de software desarrolláis?', answer: 'Desarrollamos APIs, dashboards, apps empresariales, integraciones, automatizaciones y cualquier solución de software que necesite tu negocio.' },
        { question: '¿Qué tecnologías usáis para backend?', answer: 'Node.js, Python, Go y bases de datos como PostgreSQL y MongoDB. Elegimos según los requisitos del proyecto.' },
        { question: '¿Ofrecéis mantenimiento del software?', answer: 'Sí, ofrecemos planes de mantenimiento y soporte continuo, incluyendo actualizaciones, monitorización y resolución de incidencias.' },
        { question: '¿Puedo integrar el software con mis herramientas actuales?', answer: 'Por supuesto. Desarrollamos integraciones con CRMs, ERPs, herramientas de marketing, pasarelas de pago y cualquier sistema con API.' },
      ],
    },
    automatizaciones: {
      slug: 'automatizaciones',
      title: 'Automatizaciones',
      metaTitle: 'Automatización de Procesos | Workflows y Bots',
      metaDescription: 'Automatización de procesos digitales para empresas. Workflows con Make y n8n, bots, integraciones y RPA. Ahorra tiempo y reduce errores.',
      heroTitle: 'Automatiza procesos y libera tu equipo',
      heroSubtitle: 'Eliminamos tareas repetitivas con workflows inteligentes, bots y automatizaciones que ahorran tiempo y reducen errores.',
      icon: '🤖',
      features: [
        { title: 'Workflows automatizados', description: 'Diseño e implementación de flujos de trabajo automatizados con Make, n8n o Zapier.' },
        { title: 'Bots y chatbots', description: 'Bots para atención al cliente, gestión de leads y tareas internas.' },
        { title: 'Email automation', description: 'Secuencias de email automatizadas para nurturing, onboarding y retención.' },
        { title: 'Integración de sistemas', description: 'Conexión automática entre CRM, ERP, facturación y herramientas de equipo.' },
        { title: 'Reporting automatizado', description: 'Informes y dashboards que se generan automáticamente con datos en tiempo real.' },
        { title: 'RPA', description: 'Automatización robótica de procesos para tareas repetitivas y basadas en reglas.' },
      ],
      benefits: [
        { bad: 'Tu equipo perdiendo horas en tareas repetitivas', good: 'Workflows automáticos que trabajan 24/7 sin errores' },
        { bad: 'Errores humanos por copiar datos a mano', good: 'Datos sincronizados automáticamente entre sistemas' },
        { bad: 'Contratar más gente para gestionar más volumen', good: 'Escalar sin aumentar personal gracias a la automatización' },
        { bad: 'Informes manuales que tardan horas en preparar', good: 'Reportes automáticos en tiempo real, listos cada mañana' },
        { bad: 'Equipo quemado haciendo trabajo que una máquina puede hacer', good: 'Tu equipo enfocado en lo que realmente importa' },
      ],
      faqs: [
        { question: '¿Qué procesos se pueden automatizar?', answer: 'Cualquier proceso repetitivo y basado en reglas: envío de emails, gestión de datos, facturación, reporting, onboarding, atención al cliente y más.' },
        { question: '¿Qué herramientas usáis?', answer: 'Usamos Make (Integromat), n8n, Zapier, scripts personalizados y APIs. Elegimos la herramienta según la complejidad y presupuesto.' },
        { question: '¿Cuánto tiempo ahorro con automatización?', answer: 'Depende del proceso, pero nuestros clientes ahorran entre un 40-80% del tiempo dedicado a tareas manuales.' },
        { question: '¿Necesito conocimientos técnicos?', answer: 'No. Diseñamos las automatizaciones para que sean fáciles de mantener y te formamos en su uso.' },
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
    automatizaciones: {
      slug: 'automations',
      title: 'Automations',
      metaTitle: 'Business Process Automation',
      metaDescription: 'Process automation for businesses. Workflows, bots, integrations and RPA. Save time and reduce errors with intelligent automation.',
      heroTitle: 'Automate processes and free your team',
      heroSubtitle: 'We eliminate repetitive tasks with intelligent workflows, bots and automations that save time and reduce errors.',
      icon: '🤖',
      features: [
        { title: 'Automated Workflows', description: 'Design and implementation of automated workflows with Make, n8n or Zapier.' },
        { title: 'Bots & Chatbots', description: 'Bots for customer service, lead management and internal tasks.' },
        { title: 'Email Automation', description: 'Automated email sequences for nurturing, onboarding and retention.' },
        { title: 'System Integration', description: 'Automatic connection between CRM, ERP, billing and team tools.' },
        { title: 'Automated Reporting', description: 'Reports and dashboards that are automatically generated with real-time data.' },
        { title: 'RPA', description: 'Robotic process automation for repetitive and rule-based tasks.' },
      ],
      benefits: [
        { bad: 'Your team wasting hours on repetitive tasks', good: 'Automated workflows that work 24/7 without errors' },
        { bad: 'Human errors from copying data by hand', good: 'Data synced automatically between systems' },
        { bad: 'Hiring more people to handle more volume', good: 'Scale without increasing staff thanks to automation' },
        { bad: 'Manual reports that take hours to prepare', good: 'Automatic real-time reports, ready every morning' },
        { bad: 'Team burned out doing work a machine can do', good: 'Your team focused on what truly matters' },
      ],
      faqs: [
        { question: 'What processes can be automated?', answer: 'Any repetitive and rule-based process: email sending, data management, billing, reporting, onboarding, customer service and more.' },
        { question: 'What tools do you use?', answer: 'We use Make (Integromat), n8n, Zapier, custom scripts and APIs. We choose the tool based on complexity and budget.' },
        { question: 'How much time do I save with automation?', answer: 'It depends on the process, but our clients save between 40-80% of time spent on manual tasks.' },
        { question: 'Do I need technical knowledge?', answer: 'No. We design automations to be easy to maintain and train you on their use.' },
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
    automatizaciones: {
      slug: 'automatitzacions',
      title: 'Automatitzacions',
      metaTitle: 'Automatització de Processos Empresarials',
      metaDescription: 'Automatització de processos per a empreses. Workflows, bots, integracions i RPA.',
      heroTitle: 'Automatitza processos i allibera el teu equip',
      heroSubtitle: 'Eliminem tasques repetitives amb workflows intel·ligents, bots i automatitzacions.',
      icon: '🤖',
      features: [
        { title: 'Workflows automatitzats', description: 'Disseny i implementació de fluxos de treball automatitzats.' },
        { title: 'Bots i chatbots', description: 'Bots per a atenció al client, gestió de leads i tasques internes.' },
        { title: 'Email automation', description: 'Seqüències d\'email automatitzades per a nurturing i retenció.' },
        { title: 'Integració de sistemes', description: 'Connexió automàtica entre CRM, ERP, facturació i eines d\'equip.' },
        { title: 'Reporting automatitzat', description: 'Informes que es generen automàticament amb dades en temps real.' },
        { title: 'RPA', description: 'Automatització robòtica de processos per a tasques repetitives.' },
      ],
      benefits: [
        { bad: 'El teu equip perdent hores en tasques repetitives', good: 'Workflows automàtics que treballen 24/7 sense errors' },
        { bad: 'Errors humans per copiar dades a mà', good: 'Dades sincronitzades automàticament entre sistemes' },
        { bad: 'Contractar més gent per gestionar més volum', good: 'Escalar sense augmentar personal gràcies a l\'automatització' },
        { bad: 'Informes manuals que triguen hores a preparar', good: 'Informes automàtics en temps real, llestos cada matí' },
        { bad: 'Equip cremat fent feina que una màquina pot fer', good: 'El teu equip enfocat en el que realment importa' },
      ],
      faqs: [
        { question: 'Quins processos es poden automatitzar?', answer: 'Qualsevol procés repetitiu: enviament d\'emails, gestió de dades, facturació, reporting i més.' },
        { question: 'Quines eines useu?', answer: 'Make, n8n, Zapier, scripts personalitzats i APIs.' },
        { question: 'Quant de temps estalvio?', answer: 'Els nostres clients estalvien entre un 40-80% del temps dedicat a tasques manuals.' },
        { question: 'Necessito coneixements tècnics?', answer: 'No. Dissenyem les automatitzacions per ser fàcils de mantenir.' },
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
