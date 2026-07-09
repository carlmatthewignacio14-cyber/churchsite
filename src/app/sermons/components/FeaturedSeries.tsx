'use client';

import React, { useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

export default function FeaturedSeries() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (el) {
              el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer?.observe(el);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="bg-primary relative overflow-hidden">
      <div ref={ref} className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
          {/* Text Side */}
          <div className="py-16 lg:py-20 lg:pr-12 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-[0.5em] uppercase text-accent block mb-4">
              Current Series
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light italic text-primary-foreground mb-4 leading-tight">
              Anchored<br />
              <span className="not-italic font-bold">in Grace</span>
            </h2>
            <p className="text-primary-foreground/70 leading-relaxed mb-8 max-w-md">
              A 6-week journey through Philippians, discovering how to experience peace, contentment, and joy — even in life&apos;s hardest seasons. New message every Sunday.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-2xl font-display font-light text-primary-foreground">6</span>
                <span className="text-xs uppercase tracking-widest text-primary-foreground/50 ml-2">Parts</span>
              </div>
              <div className="w-px h-8 bg-primary-foreground/20" />
              <div>
                <span className="text-2xl font-display font-light text-primary-foreground">Philippians</span>
                <span className="text-xs uppercase tracking-widest text-primary-foreground/50 ml-2">Book</span>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative min-h-[280px] lg:min-h-0">
            <div className="img-zoom-wrap absolute inset-0">
              <AppImage
                src="https://images.unsplash.com/photo-1623080882579-050db1182f51"
                alt="Church congregation with hands raised in worship, warm stage lighting, atmospheric dim sanctuary, blue-toned ambient light"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw" />
              
            </div>
            <div className="absolute inset-0 bg-primary/40" />
          </div>
        </div>
      </div>
    </section>);

}