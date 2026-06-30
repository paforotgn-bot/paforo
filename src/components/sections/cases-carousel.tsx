'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Section, SectionHeader } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import type { Locale } from '@/lib/constants';
import type { Dictionary } from '@/types';

export interface CarouselCase {
  slug: string;
  title: string;
  description: string;
  services: string[];
  image: string | null;
  video?: string | null;
  imagePosition?: string | null;
  imageFit?: string | null;
}

interface CasesCarouselProps {
  locale: Locale;
  dict: Dictionary;
  cases: CarouselCase[];
  layout?: 'carousel' | 'grid';
}

const SPEED = 0.5; // px per frame — continuous "chain" motion
const EASE = 0.12; // easing toward target (for arrow nudges)
const GAP = 24;

export function CasesCarousel({ locale, dict, cases, layout = 'carousel' }: CasesCarouselProps) {
  const isGrid = layout === 'grid';

  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const offsetRef = useRef(0);
  const targetRef = useRef(0);

  // Duplicate the list so the scroll loops seamlessly in both directions.
  const loop = !isGrid && cases.length > 1;
  const items = loop ? [...cases, ...cases] : cases;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !loop) return;

    let raf = 0;
    const tick = () => {
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (!pausedRef.current && !draggingRef.current) {
          targetRef.current += SPEED;
        }
        // ease offset toward target
        offsetRef.current += (targetRef.current - offsetRef.current) * EASE;
        // seamless wrap (shift both so the easing distance is preserved)
        while (offsetRef.current >= half) {
          offsetRef.current -= half;
          targetRef.current -= half;
        }
        while (offsetRef.current < 0) {
          offsetRef.current += half;
          targetRef.current += half;
        }
        if (!draggingRef.current) {
          track.scrollLeft = offsetRef.current;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loop, items.length]);

  const stepSize = () => {
    const track = trackRef.current;
    if (!track) return 300;
    const card = track.querySelector<HTMLElement>('[data-card]');
    return card ? card.offsetWidth + GAP : track.clientWidth * 0.8;
  };

  const nudge = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    if (loop) {
      targetRef.current += stepSize() * dir;
    } else {
      track.scrollBy({ left: stepSize() * dir, behavior: 'smooth' });
    }
  };

  // Drag / swipe
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      let sl = startScroll - dx;
      if (loop) {
        const half = track.scrollWidth / 2;
        sl = ((sl % half) + half) % half;
        // reset reference so wrapping doesn't cause jumps
        startScroll = sl;
        startX = e.clientX;
      }
      track.scrollLeft = sl;
      offsetRef.current = sl;
      targetRef.current = sl;
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    track.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    track.addEventListener('click', onClickCapture, true);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      track.removeEventListener('click', onClickCapture, true);
    };
  }, [loop]);

  const renderCard = (c: CarouselCase, i: number, inTrack: boolean) => (
    <Link
      key={`${c.slug}-${i}`}
      href={`/${locale}/casos/${c.slug}`}
      {...(inTrack ? { 'data-card': '' } : {})}
      className={`group block ${
        inTrack
          ? 'w-[85%] shrink-0 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]'
          : 'w-full'
      }`}
      draggable={false}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 group-hover:border-violet/30 group-hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)]">
        {c.video ? (
          <video
            src={c.video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : c.image && (
          <Image
            src={c.image}
            alt={c.title}
            fill
            className={`${c.imageFit === 'cover' ? 'object-cover' : 'object-contain'} transition-transform duration-500 group-hover:scale-105`}
            style={{ objectPosition: c.imagePosition ?? 'center' }}
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
            draggable={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex flex-wrap gap-2">
          {c.services.filter((s) => !/automat/i.test(s)).slice(0, 2).map((s) => (
            <Badge key={s} variant="violet">{s}</Badge>
          ))}
        </div>
        <h3 className="font-bold leading-tight">{c.title}</h3>
      </div>
    </Link>
  );

  if (isGrid) {
    return (
      <Section id="casos" className="bg-section">
        <SectionHeader title={dict.cases.title} subtitle={dict.cases.subtitle} />
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {cases.map((c, i) => renderCard(c, i, false))}
        </div>
      </Section>
    );
  }

  return (
    <Section id="casos" className="bg-section">
      <SectionHeader title={dict.cases.title} subtitle={dict.cases.subtitle} />

      <div
        className="relative"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        <button
          onClick={() => nudge(-1)}
          aria-label="Anterior"
          className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:text-violet md:flex"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button
          onClick={() => nudge(1)}
          aria-label="Siguiente"
          className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-colors hover:text-violet md:flex"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>

        <div
          ref={trackRef}
          className="no-scrollbar flex gap-6 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', touchAction: 'pan-y' }}
        >
          {items.map((c, i) => renderCard(c, i, true))}
        </div>
      </div>
    </Section>
  );
}
