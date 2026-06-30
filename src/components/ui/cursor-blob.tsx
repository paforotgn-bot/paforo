'use client';

import { useEffect, useRef } from 'react';

/**
 * Subtle "ball of light" that trails the native cursor (the system cursor stays
 * visible). Rests as a small circle and gently stretches in the direction of
 * movement. Uses mix-blend-mode: difference so it stays visible over light and
 * dark backgrounds. Desktop only; disabled on touch / under reduced motion.
 */
export function CursorBlob() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduceMotion) return;

    const el = ref.current;
    if (!el) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let angle = 0;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        x = mouseX;
        y = mouseY;
        el.style.opacity = '1';
      }
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = '0';
    };

    const loop = () => {
      const dx = mouseX - x;
      const dy = mouseY - y;
      x += dx * 0.18;
      y += dy * 0.18;

      const speed = Math.hypot(dx, dy);
      if (speed > 0.3) angle = Math.atan2(dy, dx);

      const stretch = Math.min(speed / 55, 0.6);
      const scaleX = 1 + stretch;
      const scaleY = 1 - Math.min(stretch * 0.45, 0.35);

      el.style.transform =
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) ` +
        `rotate(${angle}rad) scale(${scaleX}, ${scaleY})`;

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-4 w-4 rounded-full bg-white opacity-0 transition-opacity duration-300 will-change-transform"
      style={{ mixBlendMode: 'difference' }}
    />
  );
}
