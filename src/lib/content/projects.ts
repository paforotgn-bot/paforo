import type { Locale } from '@/lib/constants';

type L10n = Record<Locale, string>;

export type Project = {
  slug: string;
  /** Nombre que se lee en el índice. */
  client: string;
  year: string;
  /** URL pública, si la hay. Los productos internos no la tienen. */
  url?: string;
  /** Producto tras login: se lista, pero no enlaza a ninguna web. */
  private?: boolean;
  /** Qué es el cliente: club, clínica, despacho… */
  sector: L10n;
  /** Qué le construí, en dos o tres palabras. */
  kind: L10n;
  /** Una frase. Lo que hace, no lo que promete. */
  summary: L10n;
  /** El problema que tenía el cliente antes. */
  challenge: L10n;
  /** Qué construí. */
  solution: L10n;
  /** Piezas concretas, no adjetivos. */
  highlights: L10n[];
};

export const PROJECTS: Project[] = [
  {
    slug: 'arqvs',
    client: 'ARQVS',
    year: '2026',
    url: 'https://arqvs.es',
    sector: {
      es: 'Club open air',
      en: 'Open-air club',
      ca: "Club open air",
    },
    kind: {
      es: 'Web + ticketera propia',
      en: 'Site + in-house ticketing',
      ca: 'Web + ticketera pròpia',
    },
    summary: {
      es: 'Discoteca open-air en Roda de Berà. Vende sus entradas con una ticketera que le monté a medida, sin pagar comisión a terceros.',
      en: 'Open-air club in Roda de Berà. It sells its own tickets through a system I built for them, with no third-party commission.',
      ca: 'Discoteca open-air a Roda de Berà. Ven les entrades amb una ticketera feta a mida, sense pagar comissió a tercers.',
    },
    challenge: {
      es: 'Cada entrada vendida por una plataforma externa se lleva una comisión, y los datos de quién compra se quedan en casa ajena. Para una sala que llena cada fin de semana, eso es dinero y es información.',
      en: 'Every ticket sold through an external platform takes a cut, and the data on who buys stays in someone else’s house. For a venue that fills up every weekend, that is money and it is information.',
      ca: 'Cada entrada venuda per una plataforma externa s’endú una comissió, i les dades de qui compra es queden en casa aliena. Per a una sala que omple cada cap de setmana, això són diners i és informació.',
    },
    solution: {
      es: 'Web trilingüe con su propia ticketera detrás: pasarela de pago, entrada con QR, validación en la puerta y un panel donde el equipo publica eventos, sube galería y ve qué se está vendiendo en tiempo real.',
      en: 'A trilingual site with its own ticketing behind it: payment gateway, QR tickets, validation at the door, and a panel where the team publishes events, uploads the gallery and sees what is selling in real time.',
      ca: 'Web trilingüe amb la seva pròpia ticketera al darrere: passarel·la de pagament, entrada amb QR, validació a la porta i un panell on l’equip publica esdeveniments, puja galeria i veu què s’està venent en temps real.',
    },
    highlights: [
      {
        es: 'Venta con pasarela propia: la comisión del intermediario se queda en casa.',
        en: 'Sales through their own gateway: the middleman’s commission stays in house.',
        ca: 'Venda amb passarel·la pròpia: la comissió de l’intermediari es queda a casa.',
      },
      {
        es: 'Entrada con QR y validación en puerta desde el móvil del portero.',
        en: 'QR tickets validated at the door from the doorman’s phone.',
        ca: 'Entrada amb QR i validació a la porta des del mòbil del porter.',
      },
      {
        es: 'Comisiones por RRPP: cada relaciones públicas tiene su enlace y su liquidación.',
        en: 'Promoter commissions: each promoter gets their own link and their own payout.',
        ca: 'Comissions per RRPP: cada relacions públiques té el seu enllaç i la seva liquidació.',
      },
      {
        es: 'Galería propia de cada noche: se suben las fotos y cada evento tiene su página.',
        en: 'A gallery for every night: photos go up and each event gets its own page.',
        ca: 'Galeria pròpia de cada nit: es pugen les fotos i cada esdeveniment té la seva pàgina.',
      },
      {
        es: 'Newsletter con la lista que deja cada comprador, para avisar de la siguiente salida de entradas.',
        en: 'A newsletter built from the list every buyer leaves, to announce the next ticket drop.',
        ca: 'Newsletter amb la llista que deixa cada comprador, per avisar de la següent sortida.',
      },
      {
        es: 'Todo lo lleva el equipo desde su panel: eventos, precios, aforo, fotos y estadísticas.',
        en: 'The team runs all of it from their panel: events, prices, capacity, photos and stats.',
        ca: 'Tot ho porta l’equip des del seu panell: esdeveniments, preus, aforament, fotos i estadístiques.',
      },
    ],
  },

  {
    slug: 'longplay',
    client: 'Longplay',
    year: '2026',
    url: 'https://longplaytorredembarra.com',
    sector: {
      es: 'Discoteca',
      en: 'Nightclub',
      ca: "Discoteca",
    },
    kind: {
      es: 'Web + ticketera propia',
      en: 'Site + in-house ticketing',
      ca: "Web + ticketera pròpia",
    },
    summary: {
      es: 'La misma ticketera, montada para una sala de Torredembarra con dos espacios propios.',
      en: 'The same ticketing system, set up for a venue in Torredembarra with two distinct spaces.',
      ca: 'La mateixa ticketera, muntada per a una sala de Torredembarra amb dos espais propis.',
    },
    challenge: {
      es: 'Una sala con dos ambientes diferenciados, El Ranxito y La Xatarra, que necesitaba vender online y controlar la puerta sin montar dos sistemas distintos.',
      en: 'A venue with two distinct spaces, El Ranxito and La Xatarra, that needed to sell online and control the door without running two separate systems.',
      ca: 'Una sala amb dos ambients diferenciats, El Ranxito i La Xatarra, que necessitava vendre online i controlar la porta sense muntar dos sistemes diferents.',
    },
    solution: {
      es: 'Reutilicé la base de ARQVS y la adapté: dos espacios bajo una misma venta, escáner de puerta, métricas por campaña y newsletter propia. Lo que la primera vez costó meses, aquí fueron semanas.',
      en: 'I reused the ARQVS foundation and adapted it: two spaces under one checkout, a door scanner, per-campaign metrics and their own newsletter. What took months the first time took weeks here.',
      ca: 'Vaig reutilitzar la base d’ARQVS i la vaig adaptar: dos espais sota una mateixa venda, escàner de porta, mètriques per campanya i newsletter pròpia. El que la primera vegada va costar mesos, aquí van ser setmanes.',
    },
    highlights: [
      {
        es: 'Dos espacios con agenda propia bajo un único carrito.',
        en: 'Two spaces with their own line-ups under a single checkout.',
        ca: 'Dos espais amb agenda pròpia sota un únic carret.',
      },
      {
        es: 'Escáner de puerta pensado para usarse a oscuras y con prisa.',
        en: 'A door scanner built to be used in the dark and in a hurry.',
        ca: 'Escàner de porta pensat per fer-se servir a les fosques i amb pressa.',
      },
      {
        es: 'Métricas por campaña para saber qué canal trae ventas de verdad.',
        en: 'Per-campaign metrics, to know which channel actually brings sales.',
        ca: 'Mètriques per campanya per saber quin canal porta vendes de debò.',
      },
      {
        es: 'Galería por evento y newsletter propia: la sala publica y avisa sin depender de nadie.',
        en: 'A gallery per event and their own newsletter: the venue publishes and announces on its own.',
        ca: 'Galeria per esdeveniment i newsletter pròpia: la sala publica i avisa sense dependre de ningú.',
      },
    ],
  },

  {
    slug: 'rodaventura',
    client: 'Rodaventura Park',
    year: '2026',
    url: 'https://rodaventura.es',
    sector: {
      es: 'Parque acuático',
      en: 'Water park',
      ca: "Parc aquàtic",
    },
    kind: {
      es: 'Web + ticketera propia',
      en: 'Site + in-house ticketing',
      ca: "Web + ticketera pròpia",
    },
    summary: {
      es: 'Parque acuático hinchable sobre el Mediterráneo. Venta por sesiones, validación en la entrada y dos automatismos: reubicar entradas si hay temporal y pedir la reseña tras la visita.',
      en: 'Inflatable water park on the Mediterranean. Session-based sales, validation at the gate and two automations: moving tickets when the weather turns, and asking for the review after the visit.',
      ca: 'Parc aquàtic inflable sobre el Mediterrani. Venda per sessions, validació a l’entrada i dos automatismes: reubicar entrades si hi ha temporal i demanar la ressenya després de la visita.',
    },
    challenge: {
      es: 'Un parque al aire libre que funciona por turnos de aforo limitado. Si la venta y la puerta no hablan entre sí, o entra gente de más o se queda sitio vacío. Y cuando el mar se pica hay que mover a todo el mundo de día sin devolver el dinero ni perder la reserva.',
      en: 'An open-air park running limited-capacity time slots. If sales and the gate don’t talk to each other, either too many people get in or slots go empty. And when the sea turns rough, everyone has to be moved to another day without refunds and without losing the booking.',
      ca: 'Un parc a l’aire lliure que funciona per torns d’aforament limitat. Si la venda i la porta no es parlen, o entra gent de més o queda lloc buit. I quan el mar es pica cal moure tothom de dia sense tornar els diners ni perdre la reserva.',
    },
    solution: {
      es: 'Web trilingüe con su propia ticketera: reserva por sesión, pasarela Redsys y validación en la entrada. Y dos automatismos que ahorran el trabajo pesado: avisar de un temporal y reubicar esas entradas a otro día, y pedir la reseña al visitante después de haber venido, no antes.',
      en: 'A trilingual site with its own ticketing: per-session booking, the Redsys gateway and validation at the gate. Plus two automations that remove the heavy lifting: warning about bad weather and moving those tickets to another day, and asking visitors for a review after they have been, not before.',
      ca: 'Web trilingüe amb la seva pròpia ticketera: reserva per sessió, passarel·la Redsys i validació a l’entrada. I dos automatismes que estalvien la feina pesada: avisar d’un temporal i reubicar aquestes entrades a un altre dia, i demanar la ressenya al visitant després d’haver vingut, no abans.',
    },
    highlights: [
      {
        es: 'Reserva por franja horaria con aforo real, no estimado.',
        en: 'Booking by time slot against real capacity, not an estimate.',
        ca: 'Reserva per franja horària amb aforament real, no estimat.',
      },
      {
        es: 'Pago con Redsys, la pasarela de su propio banco.',
        en: 'Payment through Redsys, their own bank’s gateway.',
        ca: 'Pagament amb Redsys, la passarel·la del seu propi banc.',
      },
      {
        es: 'Validación en la entrada y panel de sesiones para el equipo.',
        en: 'Validation at the gate and a session panel for the staff.',
        ca: 'Validació a l’entrada i panell de sessions per a l’equip.',
      },
      {
        es: 'Aviso de temporal y reubicación de las entradas a otro día, sin devoluciones ni llamadas.',
        en: 'Bad-weather notices and tickets moved to another day, with no refunds and no phone calls.',
        ca: 'Avís de temporal i reubicació de les entrades a un altre dia, sense devolucions ni trucades.',
      },
      {
        es: 'Reseñas automáticas: se le piden al visitante después de la visita, que es cuando las deja.',
        en: 'Automatic review requests, sent after the visit, which is when people actually leave them.',
        ca: 'Ressenyes automàtiques: es demanen al visitant després de la visita, que és quan les deixa.',
      },
    ],
  },

  {
    slug: 'hugiacore',
    client: 'Hugia Core',
    year: '2026',
    // Plataforma privada: sólo se ve tras login, así que ni enlace ni ráfaga.
    // Pendiente de capturas propias con datos de prueba.
    private: true,
    sector: {
      es: 'Centro de neurodesarrollo',
      en: 'Neurodevelopment centre',
      ca: "Centre de neurodesenvolupament",
    },
    kind: {
      es: 'Software de gestión',
      en: 'Management software',
      ca: 'Programari de gestió',
    },
    summary: {
      es: 'Agenda, pacientes, becas, caja, facturación y nóminas para un centro con varias sedes. Es el proyecto más grande que llevo ahora mismo.',
      en: 'Scheduling, patients, grants, till, invoicing and payroll for a centre with several sites. The biggest thing I am running right now.',
      ca: 'Agenda, pacients, beques, caixa, facturació i nòmines per a un centre amb diverses seus. És el projecte més gran que porto ara mateix.',
    },
    challenge: {
      es: 'Un centro de neurodesarrollo con varias sedes llevaba agenda, cobros, becas y nóminas en hojas sueltas y programas que no se hablaban. Cada mes se iban horas en cuadrar lo mismo.',
      en: 'A neurodevelopment centre with several sites was running scheduling, payments, grants and payroll across loose spreadsheets and programs that never talked to each other. Every month, hours went into reconciling the same things.',
      ca: 'Un centre de neurodesenvolupament amb diverses seus portava agenda, cobraments, beques i nòmines en fulls solts i programes que no es parlaven. Cada mes s’anaven hores a quadrar el mateix.',
    },
    solution: {
      es: 'Una sola plataforma con agenda por centro y terapeuta, ficha de paciente, portal de becas, caja, facturación emitida y recibida, nóminas y TC1. Los cobros se lanzan solos y los recordatorios de cita también.',
      en: 'One platform with scheduling by site and therapist, patient records, a grants portal, till, outgoing and incoming invoices, payroll and social security filings. Charges go out on their own, and so do appointment reminders.',
      ca: 'Una sola plataforma amb agenda per centre i terapeuta, fitxa de pacient, portal de beques, caixa, facturació emesa i rebuda, nòmines i TC1. Els cobraments es llancen sols i els recordatoris de cita també.',
    },
    highlights: [
      {
        es: 'Agenda multi-centro con terapeuta, sala y recordatorio automático al paciente.',
        en: 'Multi-site scheduling with therapist, room and an automatic reminder to the patient.',
        ca: 'Agenda multicentre amb terapeuta, sala i recordatori automàtic al pacient.',
      },
      {
        es: 'Portal de becas: solicitud, revisión y cobro anticipado o bonificado.',
        en: 'Grants portal: application, review and advance or subsidised billing.',
        ca: 'Portal de beques: sol·licitud, revisió i cobrament anticipat o bonificat.',
      },
      {
        es: 'Facturación, nóminas y TC1 en el mismo sitio que la agenda.',
        en: 'Invoicing, payroll and social security filings in the same place as the calendar.',
        ca: 'Facturació, nòmines i TC1 al mateix lloc que l’agenda.',
      },
      {
        es: 'Tareas y chat interno para que el equipo deje de coordinarse por WhatsApp.',
        en: 'Internal tasks and chat, so the team stops coordinating over WhatsApp.',
        ca: 'Tasques i xat intern perquè l’equip deixi de coordinar-se per WhatsApp.',
      },
    ],
  },

  {
    slug: 'sanros',
    client: 'SANROS',
    year: '2026',
    url: 'https://sanros.es',
    sector: {
      es: 'Despacho de arquitectura',
      en: 'Architecture practice',
      ca: "Despatx d'arquitectura",
    },
    kind: {
      es: 'Portfolio web profesional',
      en: 'Professional web portfolio',
      ca: 'Portfolio web professional',
    },
    summary: {
      es: 'Arquitectura y urbanismo en Barcelona desde 1992. Una web sobria, como el trabajo que enseña.',
      en: 'Architecture and urban planning in Barcelona since 1992. A restrained site, like the work it shows.',
      ca: 'Arquitectura i urbanisme a Barcelona des del 1992. Una web sòbria, com la feina que ensenya.',
    },
    challenge: {
      es: 'Un estudio con más de treinta años de obra a la espalda: rehabilitación de edificios con historia, obra nueva, hoteles, equipamientos. El problema de un catálogo así no es enseñarlo, es ordenarlo.',
      en: 'A studio with over thirty years of work behind it: rehabilitation of historic buildings, new builds, hotels, public facilities. The problem with a catalogue like that is not showing it, it is ordering it.',
      ca: 'Un estudi amb més de trenta anys d’obra a l’esquena: rehabilitació d’edificis amb història, obra nova, hotels, equipaments. El problema d’un catàleg així no és ensenyar-lo, és ordenar-lo.',
    },
    solution: {
      es: 'Una web trilingüe donde el proyecto manda y la interfaz desaparece: fichas de obra, servicios, estudio y contacto. Tipografía contenida y mucho blanco, para que las fotos de obra no compitan con nada.',
      en: 'A trilingual site where the project leads and the interface disappears: project pages, services, studio and contact. Restrained typography and plenty of white, so the site photography competes with nothing.',
      ca: 'Una web trilingüe on el projecte mana i la interfície desapareix: fitxes d’obra, serveis, estudi i contacte. Tipografia continguda i molt blanc, perquè les fotos d’obra no competeixin amb res.',
    },
    highlights: [
      {
        es: 'Fichas de proyecto con la obra como protagonista, sin adornos.',
        en: 'Project pages with the building as the subject, no decoration.',
        ca: 'Fitxes de projecte amb l’obra com a protagonista, sense adorns.',
      },
      {
        es: 'Trilingüe de verdad: castellano, catalán e inglés, todo traducido.',
        en: 'Genuinely trilingual: Spanish, Catalan and English, all of it translated.',
        ca: 'Trilingüe de debò: castellà, català i anglès, tot traduït.',
      },
      {
        es: 'Servicios separados por tipo de encargo, de la rehabilitación al urbanismo.',
        en: 'Services split by type of commission, from rehabilitation to urban planning.',
        ca: 'Serveis separats per tipus d’encàrrec, de la rehabilitació a l’urbanisme.',
      },
    ],
  },

  {
    slug: 'fontanet',
    client: 'Fontanet',
    year: '2026',
    url: 'https://fontanettgn.es',
    sector: {
      es: 'Centro médico',
      en: 'Medical centre',
      ca: "Centre mèdic",
    },
    kind: {
      es: 'Web profesional + SEO',
      en: 'Professional site + SEO',
      ca: 'Web professional + SEO',
    },
    summary: {
      es: 'Centro médico con más de 30 años en Tarragona. Muchas de sus páginas salen en las primeras posiciones de Google.',
      en: 'A medical centre with over 30 years in Tarragona. Many of its pages rank on the first page of Google.',
      ca: 'Centre mèdic amb més de 30 anys a Tarragona. Moltes de les seves pàgines surten a les primeres posicions de Google.',
    },
    challenge: {
      es: 'Una clínica grande, con muchas especialidades y profesionales, que necesitaba que la encontraran los pacientes que buscan su dolencia en Google, no sólo los que ya sabían su nombre.',
      en: 'A large clinic, with many specialities and practitioners, that needed to be found by patients searching for their condition on Google, not only by those who already knew its name.',
      ca: 'Una clínica gran, amb moltes especialitats i professionals, que necessitava que la trobessin els pacients que busquen la seva dolença a Google, no només els que ja en sabien el nom.',
    },
    solution: {
      es: 'Una web extensa y bien estructurada: servicios, especialidades, cuadro médico, tarifas, lesiones y blog. Cada página escrita para responder una búsqueda concreta y para que se entienda a la primera cómo pedir cita.',
      en: 'A large, well-structured site: services, specialities, medical staff, prices, conditions and a blog. Each page written to answer one specific search and to make booking obvious at a glance.',
      ca: 'Una web extensa i ben estructurada: serveis, especialitats, quadre mèdic, tarifes, lesions i blog. Cada pàgina escrita per respondre una cerca concreta i perquè s’entengui a la primera com demanar cita.',
    },
    highlights: [
      {
        es: 'Una página por dolencia y especialidad, no un cajón de sastre.',
        en: 'One page per condition and speciality, not a catch-all.',
        ca: 'Una pàgina per dolença i especialitat, no un calaix de sastre.',
      },
      {
        es: 'Cuadro médico con ficha de cada profesional y su número de colegiado.',
        en: 'Medical staff directory with a profile and licence number for each practitioner.',
        ca: 'Quadre mèdic amb fitxa de cada professional i el seu número de col·legiat.',
      },
      {
        es: 'Tarifas públicas, que casi ninguna clínica se atreve a poner.',
        en: 'Public pricing, which almost no clinic dares to publish.',
        ca: 'Tarifes públiques, que gairebé cap clínica s’atreveix a posar.',
      },
    ],
  },

  {
    slug: 'limboo',
    client: 'Limboo',
    year: '2026',
    url: 'https://limboobeachclub.com',
    sector: {
      es: 'Beach club',
      en: 'Beach club',
      ca: "Beach club",
    },
    kind: {
      es: 'Web + ticketera propia + carta digital',
      en: 'Site + in-house ticketing + digital menu',
      ca: 'Web + ticketera pròpia + carta digital',
    },
    summary: {
      es: 'Beach club a pie de playa: carta, eventos y reservas, con el vídeo llevando todo el peso.',
      en: 'Beach club on the sand: menu, events and bookings, with video carrying the whole thing.',
      ca: 'Beach club a peu de platja: carta, esdeveniments i reserves, amb el vídeo portant tot el pes.',
    },
    challenge: {
      es: 'Un local que se vende por lo que se siente al estar allí. La web tenía que transmitir eso sin convertirse en un ladrillo que tarda diez segundos en cargar en el móvil de alguien tumbado en la playa.',
      en: 'A place that sells itself on how it feels to be there. The site had to convey that without turning into a brick that takes ten seconds to load on the phone of someone lying on the beach.',
      ca: 'Un local que es ven pel que se sent en ser-hi. La web havia de transmetre això sense convertir-se en un totxo que triga deu segons a carregar al mòbil d’algú estirat a la platja.',
    },
    solution: {
      es: 'Vídeo a pantalla completa, carta digital que se lee bien con sol de cara, agenda de eventos y reserva directa. Trilingüe, porque la mitad de la clientela es de fuera.',
      en: 'Full-screen video, a digital menu that reads well in direct sunlight, an events calendar and direct booking. Trilingual, because half the clientele comes from abroad.',
      ca: 'Vídeo a pantalla completa, carta digital que es llegeix bé amb sol de cara, agenda d’esdeveniments i reserva directa. Trilingüe, perquè la meitat de la clientela és de fora.',
    },
    highlights: [
      {
        es: 'Carta digital pensada para leerse en la tumbona, no en un escritorio.',
        en: 'A digital menu built to be read on a sunbed, not at a desk.',
        ca: 'Carta digital pensada per llegir-se a la gandula, no en un escriptori.',
      },
      {
        es: 'Agenda de eventos que el local actualiza cada semana.',
        en: 'An events calendar the venue updates every week.',
        ca: 'Agenda d’esdeveniments que el local actualitza cada setmana.',
      },
      {
        es: 'Trilingüe de serie: castellano, catalán e inglés.',
        en: 'Trilingual from the start: Spanish, Catalan and English.',
        ca: 'Trilingüe de sèrie: castellà, català i anglès.',
      },
    ],
  },

  {
    slug: 'zea',
    client: 'ZEA',
    year: '2026',
    url: 'https://zealbatarrec.com',
    sector: {
      es: 'Zona deportiva',
      en: 'Sports centre',
      ca: "Zona esportiva",
    },
    kind: {
      es: 'Web con inscripciones a estades y gimnasio',
      en: 'Site with camp and gym sign-ups',
      ca: 'Web amb inscripcions a estades i gimnàs',
    },
    summary: {
      es: 'Estades, gimnasio, extraescolares y packs. Se acabaron el papeleo y las inscripciones por WhatsApp.',
      en: 'Summer camps, gym, after-school and bundles. No more paperwork and no more sign-ups over WhatsApp.',
      ca: 'Estades, gimnàs, extraescolars i packs. S’han acabat el paperam i les inscripcions per WhatsApp.',
    },
    challenge: {
      es: 'Cada verano, el mismo caos: familias apuntando a los niños por WhatsApp, hojas de papel, pagos que había que perseguir y una persona dedicada a cuadrarlo todo a mano.',
      en: 'Every summer, the same chaos: families signing their kids up over WhatsApp, paper forms, payments that had to be chased, and one person dedicated to reconciling it all by hand.',
      ca: 'Cada estiu, el mateix caos: famílies apuntant els nens per WhatsApp, fulls de paper, pagaments que calia perseguir i una persona dedicada a quadrar-ho tot a mà.',
    },
    solution: {
      es: 'Inscripción online con pasarela de pago para cada actividad: estades de verano, gimnasio, extraescolares, packs y promociones. La familia se apunta y paga en un clic; el club deja de perseguir a nadie.',
      en: 'Online sign-up with a payment gateway for every activity: summer camps, gym, after-school, bundles and promotions. The family signs up and pays in one click; the club stops chasing anyone.',
      ca: 'Inscripció en línia amb passarel·la de pagament per a cada activitat: estades d’estiu, gimnàs, extraescolars, packs i promocions. La família s’apunta i paga en un clic; el club deixa de perseguir ningú.',
    },
    highlights: [
      {
        es: 'Inscripción y pago en el mismo paso, sin descargar ni imprimir nada.',
        en: 'Sign-up and payment in one step, with nothing to download or print.',
        ca: 'Inscripció i pagament en el mateix pas, sense descarregar ni imprimir res.',
      },
      {
        es: 'Packs y promociones que el club configura por temporada.',
        en: 'Bundles and promotions the club configures per season.',
        ca: 'Packs i promocions que el club configura per temporada.',
      },
      {
        es: 'Buzón de contacto para las dudas que antes iban al WhatsApp personal.',
        en: 'A contact inbox for the questions that used to land in a personal WhatsApp.',
        ca: 'Bústia de contacte per als dubtes que abans anaven al WhatsApp personal.',
      },
    ],
  },

  {
    slug: 'craftline',
    client: 'Craftline',
    year: '2026',
    url: 'https://craftline.es',
    sector: {
      es: 'Manufacturing de ropa',
      en: 'Clothing manufacturing',
      ca: "Manufacturing de roba",
    },
    kind: {
      es: 'Web propia + dashboard para clientes',
      en: 'Own site + client dashboard',
      ca: 'Web pròpia + dashboard per a clients',
    },
    summary: {
      es: 'Merchandising para creadores. Panel interno de producción y portal propio para cada cliente.',
      en: 'Merch for creators. An internal production panel and a dedicated portal for each client.',
      ca: 'Marxandatge per a creadors. Panell intern de producció i portal propi per a cada client.',
    },
    challenge: {
      es: 'Producir merch para varios creadores a la vez significa llevar muestras, tiradas, envíos y facturas de cada uno en paralelo. Con hojas de cálculo, el primer pedido que se pierde te cuesta un cliente.',
      en: 'Producing merch for several creators at once means tracking samples, runs, shipments and invoices for each in parallel. With spreadsheets, the first order you lose costs you a client.',
      ca: 'Produir marxandatge per a diversos creadors alhora vol dir portar mostres, tirades, enviaments i factures de cadascun en paral·lel. Amb fulls de càlcul, la primera comanda que es perd et costa un client.',
    },
    solution: {
      es: 'Un panel donde el equipo lleva clientes, drops, modelos, muestras, tiradas, envíos y facturas; y un portal donde cada creador entra con su acceso y ve exactamente por dónde va lo suyo.',
      en: 'A panel where the team tracks clients, drops, styles, samples, production runs, shipments and invoices; and a portal where each creator logs in and sees exactly where their order stands.',
      ca: 'Un panell on l’equip porta clients, drops, models, mostres, tirades, enviaments i factures; i un portal on cada creador entra amb el seu accés i veu exactament per on va el seu.',
    },
    highlights: [
      {
        es: 'De la muestra a la tirada y al envío, cada fase con su estado.',
        en: 'From sample to production run to shipment, each stage with its own status.',
        ca: 'De la mostra a la tirada i a l’enviament, cada fase amb el seu estat.',
      },
      {
        es: 'Portal de cliente: el creador consulta sin tener que preguntar.',
        en: 'Client portal: the creator checks in without having to ask.',
        ca: 'Portal de client: el creador consulta sense haver de preguntar.',
      },
      {
        es: 'Albaranes, facturas y saldo a favor en el mismo sitio que la producción.',
        en: 'Delivery notes, invoices and credit balance in the same place as production.',
        ca: 'Albarans, factures i saldo a favor al mateix lloc que la producció.',
      },
    ],
  },
];

export function getProjects(): Project[] {
  return PROJECTS;
}

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
