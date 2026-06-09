import type { Locale } from '@/lib/constants';

export interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export interface ServicePageProps {
  params: Promise<{ locale: Locale; slug?: string }>;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
  tags: string[];
  readTime: number;
  content: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  description: string;
  date: string;
  image?: string;
  images?: string[];
  services: string[];
  results: {
    label: string;
    value: string;
  }[];
  content: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  image?: string;
}

export interface ServiceData {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
}

// Dictionary type
export interface Dictionary {
  nav: {
    home: string;
    services: string;
    cases: string;
    blog: string;
    about: string;
    contact: string;
    cta: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cta1: string;
    cta2: string;
  };
  stats: {
    projects: string;
    satisfaction: string;
    traffic: string;
    experience: string;
  };
  services: {
    title: string;
    subtitle: string;
    cta: string;
    seo: { title: string; description: string };
    geo: { title: string; description: string };
    web: { title: string; description: string };
    software: { title: string; description: string };
    digital: { title: string; description: string };
    automation: { title: string; description: string };
  };
  cases: {
    title: string;
    subtitle: string;
    cta: string;
    viewAll: string;
  };
  process: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
  };
  testimonials: {
    title: string;
    subtitle: string;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    description: string;
    services: string;
    company: string;
    legal: string;
    privacy: string;
    terms: string;
    cookies: string;
    rights: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    service: string;
    message: string;
    submit: string;
    success: string;
    error: string;
    selectService: string;
  };
  about: {
    title: string;
    subtitle: string;
    mission: string;
    missionText: string;
    iaTitle: string;
    iaSubtitle: string;
    iaItems: { before: string; after: string }[];
    iaClosing: string;
    values: string;
    valuesItems: { title: string; description: string }[];
  };
  blog: {
    title: string;
    subtitle: string;
    readMore: string;
    readTime: string;
  };
  common: {
    learnMore: string;
    backHome: string;
    loading: string;
  };
}
