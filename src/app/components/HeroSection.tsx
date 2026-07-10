'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemClass = (delay: string) =>
    mounted
      ? `opacity-100 translate-y-0 blur-0 transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${delay}`
      : 'opacity-0 translate-y-10 blur-[6px]';

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="/assets/images/congregation-photo-1783621144580.png"
          alt="Church of God of Prophecy congregation gathered together in celebration, colorful group photo inside the church hall with blue walls, balloons, and children in Pikachu hats"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay for text readability over bright photo */}
      <div className="absolute inset-0 z-[1]" style={{ backgroundColor: 'rgba(180, 100, 20, 0.50)', mixBlendMode: 'multiply' }} />
      {/* Dark gradient at bottom for text legibility */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 blob-accent opacity-20 z-[3] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 px-4 max-w-5xl mx-auto pt-32 pb-24">
        <div className={itemClass('delay-[400ms]')}>
          <h1 className="font-aktiv-grotesk-ex text-hero-display font-light italic text-white mb-4 leading-none">
            LET US GO TO<br />
            <span className="not-italic font-bold">THE OTHER SIDE</span>
          </h1>
        </div>

        <p className={`text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto mb-12 ${itemClass('delay-[700ms]')}`}>
          The Church of God of Prophecy is a vibrant, worldwide body of believers, united in worship.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${itemClass('delay-[900ms]')}`}>
          <Link
            href="#service-times"
            className="bg-primary text-primary-foreground px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-all hover:scale-105"
          >
            Plan Your Visit
          </Link>
          <Link
            href="/sermons"
            className="border border-white/40 text-white px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            Watch Sermons
          </Link>
        </div>

        {/* Service time pill */}
        <div className="mt-10 inline-flex items-center gap-3 border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-xs text-white/90 font-medium tracking-wider uppercase">
            Sundays 8:00 AM · 33 Banaba St, Nangka, Marikina, 1808 Metro Manila
          </span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] tracking-[0.5em] uppercase text-white/40">
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-accent animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}