'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

export default function SermonsHero() {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef?.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      if (el) {
        el.style.transition = 'opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    }, 200);
  }, []);

  return (
    <section className="relative min-h-[55vh] flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="/assets/images/sermonsherophoto.png"
          alt="church podium photo"
          fill
          priority
          className="object-cover"
          sizes="100vw" />
        
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/40 to-black/80" />

      {/* Content */}
      <div ref={headRef} className="relative z-10 container mx-auto px-4 max-w-6xl pb-16 pt-40">
        <span className="text-xs font-semibold tracking-[0.5em] uppercase text-white block mb-4">
          Sermon Library
        </span>
        <h1 className="font-display text-hero-display font-light italic text-white leading-none">
          Messages<br />
          <span className="not-italic font-bold">That Move You</span>
        </h1>
        <p className="text-white/70 text-lg font-light mt-6 max-w-xl leading-relaxed">
          Browse our full archive of sermons — watch online, listen on the go, or share with a friend who needs to hear it.
        </p>
      </div>
    </section>);

}
