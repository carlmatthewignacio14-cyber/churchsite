'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

export default function GiveHero() {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef?.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    setTimeout(() => {
      if (el) {
        el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    }, 250);
  }, []);

  return (
    <section className="relative min-h-[52vh] flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AppImage
          src="https://images.unsplash.com/photo-1714746643784-f41f9feaf388"
          alt="Hands outstretched upward against a warm golden sunset sky, gesture of offering and generosity, soft atmospheric glow, spiritual symbolism"
          fill
          priority
          className="object-cover"
          sizes="100vw" />
        
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/35 to-black/80" />

      <div ref={headRef} className="relative z-10 container mx-auto px-4 max-w-6xl pb-16 pt-40">
        <span className="text-xs font-semibold tracking-[0.5em] uppercase text-accent block mb-4">
          Generosity
        </span>
        <h1 className="font-display text-hero-display font-light italic text-white leading-none">
          Give With<br />
          <span className="not-italic font-bold">Open Hands</span>
        </h1>
        <p className="text-white/70 text-lg font-light mt-6 max-w-xl leading-relaxed">
          Every gift — large or small — helps us love our neighbors, grow our community, and share hope across Nashville.
        </p>
      </div>
    </section>);

}