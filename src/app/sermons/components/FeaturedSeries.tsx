'use client';

import React, { useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Series {
  id: string;
  title: string;
  description: string;
  sermonCount: number;
  speaker: string;
  thumbnail: string;
  thumbnailAlt: string;
}

const featuredSeries: Series[] = [
{
  id: '1',
  title: 'Anchored in Grace',
  description: 'A deep dive into the unshakeable grace of God and how it transforms every area of our lives.',
  sermonCount: 6,
  speaker: 'Pastor James Whitfield',
  thumbnail: "https://images.unsplash.com/photo-1533903347993-698dee812c2a",
  thumbnailAlt: 'Open Bible on wooden table with soft morning light and warm amber glow'
},
{
  id: '2',
  title: 'Psalms for Every Season',
  description: 'Walking through the Psalms to find comfort, praise, and hope in every season of life.',
  sermonCount: 4,
  speaker: 'Pastor James Whitfield',
  thumbnail: "https://images.unsplash.com/photo-1631950958451-c779ef54e725",
  thumbnailAlt: 'Misty mountain valley at sunrise with golden light breaking through low clouds'
},
{
  id: '3',
  title: 'Purpose & Calling',
  description: 'Discovering the unique purpose God has placed within you and how to live it out boldly.',
  sermonCount: 5,
  speaker: 'Pastor Rachel Monroe',
  thumbnail: "https://images.unsplash.com/photo-1540523191631-c3e9be390be2",
  thumbnailAlt: 'People in church sanctuary with hands raised in worship and warm stage lighting'
}];


function useScrollReveal(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (el) {
                el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              }
            }, 0);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);
}

export default function FeaturedSeries() {
  const headerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(headerRef, 0);

  return (
    <section className="section-pad bg-card/30 relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-2">
            Sermon Series
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Featured Series
          </h2>
        </div>

        {/* Series Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSeries.map((series, i) =>
          <SeriesCard key={series.id} series={series} index={i} />
          )}
        </div>
      </div>
    </section>);

}

function SeriesCard({ series, index }: {series: Series;index: number;}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollReveal(cardRef, index * 100);

  return (
    <div
      ref={cardRef}
      className="group bg-card border border-border overflow-hidden bento-card cursor-pointer">
      
      {/* Thumbnail */}
      <div className="relative img-zoom-wrap aspect-video overflow-hidden">
        <AppImage
          src={series.thumbnail}
          alt={series.thumbnailAlt}
          width={600}
          height={338}
          className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1">
            {series.sermonCount} Messages
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {series.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{series.description}</p>
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{series.speaker}</span>
        </div>
      </div>
    </div>);

}