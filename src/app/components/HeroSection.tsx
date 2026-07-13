'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

export default function HeroSection() {
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
      <div className="absolute inset-0 z-[1]" style={{ backgroundColor: 'rgba(180, 100, 20, 0.50)', mixBlendMode: 'multiply' }} suppressHydrationWarning />
      {/* Dark gradient at bottom for text legibility */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 blob-accent opacity-20 z-[3] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 px-4 max-w-5xl mx-auto pt-32 pb-24">
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <h1 className="font-aktiv-grotesk-ex text-hero-display font-light italic text-white mb-4 leading-none">
            LET US GO TO<br />
            <span className="not-italic font-bold">THE OTHER SIDE</span>
          </h1>
        </div>

        <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
          The Church of God of Prophecy is a vibrant, worldwide body of believers, united in worship.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] tracking-[0.5em] uppercase text-white/40"></span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-accent animate-scroll-line" />
        </div>
      </div>
    </section>
  );
}
