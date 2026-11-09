import type { Locale } from '@/lib/constants';

type L10n = Record<Locale, string>;

/**
 * Toda la copy de la home. En primera persona y concreta: nada de
 * "impulsamos tu negocio" ni "soluciones a medida".
 */
export const COPY: {
  nav: { work: L10n; about: L10n; contact: L10n };
  hero: { line1: L10n; line2: L10n; lede: L10n; place: L10n };
  work: { title: L10n; note: L10n; privateTag: L10n; discover: L10n; close: L10n };
  project: {
    sector: L10n; what: L10n; year: L10n; live: L10n; privateNote: L10n;
    challenge: L10n; solution: L10n; screens: L10n;
  };
  about: { title: L10n; body: L10n[]; };
  contact: { title: L10n; lede: L10n; mail: L10n; phone: L10n };
  footer: { rights: L10n; legal: L10n; privacy: L10n; cookies: L10n };
} = {
  nav: {
    work: { es: 'Trabajo', en: 'Work', ca: 'Feina' },
    about: { es: 'Sobre mí', en: 'About', ca: 'Sobre mi' },
    contact: { es: 'Contacto', en: 'Contact', ca: 'Contacte' },
  },

  hero: {
    line1: {
      es: 'Construyo webs y software',
      en: 'I build websites and software',
      ca: 'Construeixo webs i software',
    },
    line2: {
      es: 'para negocios.',
      en: 'for businesses.',
      ca: 'per a negocis.',
    },
    lede: {
      es: 'Ticketeras que ahorran la comisión del intermediario, plataformas de gestión que sustituyen carpetas de papel y webs que salen las primeras en Google. Nueve proyectos en producción este año.',
      en: 'Ticketing systems that cut out the middleman’s commission, management platforms that replace paper folders, and websites that come up first on Google. Nine projects in production this year.',
      ca: 'Ticketeres que estalvien la comissió de l’intermediari, plataformes de gestió que substitueixen carpetes de paper i webs que surten les primeres a Google. Nou projectes en producció aquest any.',
    },
    place: {
      es: 'Tarragona',
      en: 'Tarragona, Spain',
      ca: 'Tarragona',
    },
  },

  work: {
    title: { es: 'Trabajo', en: 'Work', ca: 'Feina' },
    note: {
      es: 'Pasa el ratón para verlas por dentro. Haz clic para el detalle.',
      en: 'Hover to see them from the inside. Click for the full story.',
      ca: 'Passa el ratolí per veure-les per dins. Clica per al detall.',
    },
    privateTag: { es: 'Privado', en: 'Private', ca: 'Privat' },
    discover: {
      es: 'Descubre más sobre este proyecto',
      en: 'Discover more about this project',
      ca: 'Descobreix més sobre aquest projecte',
    },
    close: { es: 'Cerrar', en: 'Close', ca: 'Tancar' },
  },

  project: {
    sector: { es: 'Sector', en: 'Sector', ca: 'Sector' },
    what: { es: 'Qué le construí', en: 'What I built', ca: 'Què li vaig construir' },
    year: { es: 'Año', en: 'Year', ca: 'Any' },
    live: { es: 'En producción', en: 'Live', ca: 'En producció' },
    privateNote: {
      es: 'Plataforma privada, sólo con acceso',
      en: 'Private platform, login only',
      ca: 'Plataforma privada, només amb accés',
    },
    challenge: { es: 'El problema', en: 'The problem', ca: 'El problema' },
    solution: { es: 'Qué construí', en: 'What I built', ca: 'Què vaig construir' },
    screens: { es: 'Por dentro', en: 'Inside', ca: 'Per dins' },
  },

  about: {
    title: { es: 'Sobre mí', en: 'About', ca: 'Sobre mi' },
    body: [
      {
        es: 'Me llamo Pablo Fontanet y trabajo solo. Eso quiere decir que quien te coge el teléfono es quien escribe el código, y que no hay una capa de cuentas entre tu problema y quien lo resuelve.',
        en: 'My name is Pablo Fontanet and I work alone. That means whoever picks up the phone is the person writing the code, and there is no account layer between your problem and the person solving it.',
        ca: 'Em dic Pablo Fontanet i treballo sol. Això vol dir que qui t’agafa el telèfon és qui escriu el codi, i que no hi ha una capa de comptes entre el teu problema i qui el resol.',
      },
      {
        es: 'La mayoría de lo que hago acaba siendo software de gestión: ticketeras, agendas, inscripciones, facturación. Cosas que un negocio usa cada día y que, si fallan, se nota en caja el mismo lunes.',
        en: 'Most of what I do ends up being operational software: ticketing, scheduling, sign-ups, invoicing. Things a business uses every day and that, if they break, show up in the till the same Monday.',
        ca: 'La majoria del que faig acaba sent software de gestió: ticketeres, agendes, inscripcions, facturació. Coses que un negoci fa servir cada dia i que, si fallen, es noten a la caixa el mateix dilluns.',
      },
      {
        es: 'Trabajo sobre todo con negocios de Tarragona y alrededores. Si quieres ver algo por dentro antes de decidir, te lo enseño sin compromiso.',
        en: 'I work mostly with businesses in and around Tarragona. If you want to see something from the inside before deciding, I’ll show you, no strings attached.',
        ca: 'Treballo sobretot amb negocis de Tarragona i rodalies. Si vols veure alguna cosa per dins abans de decidir, t’ho ensenyo sense compromís.',
      },
    ],
  },

  contact: {
    title: { es: 'Hablamos', en: 'Let’s talk', ca: 'En parlem' },
    lede: {
      es: 'Cuéntame qué tienes entre manos. Respondo yo, y suele ser el mismo día.',
      en: 'Tell me what you’re working on. I answer personally, usually the same day.',
      ca: 'Explica’m què tens entre mans. Responc jo, i sol ser el mateix dia.',
    },
    mail: { es: 'Escríbeme', en: 'Email me', ca: 'Escriu-me' },
    phone: { es: 'Llámame', en: 'Call me', ca: 'Truca’m' },
  },

  footer: {
    rights: { es: 'Tarragona', en: 'Tarragona, Spain', ca: 'Tarragona' },
    legal: { es: 'Aviso legal', en: 'Legal notice', ca: 'Avís legal' },
    privacy: { es: 'Privacidad', en: 'Privacy', ca: 'Privacitat' },
    cookies: { es: 'Cookies', en: 'Cookies', ca: 'Cookies' },
  },
};
