'use client';

import React, { useState, useRef, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  series: string;
  topic: string;
  date: string;
  duration: string;
  thumbnail: string;
  thumbnailAlt: string;
  views: string;
}

const allSermons: Sermon[] = [
{
  id: '1',
  title: 'The Peace That Surpasses Understanding',
  speaker: 'Pastor James Whitfield',
  series: 'Anchored in Grace',
  topic: 'Peace',
  date: 'July 6, 2026',
  duration: '42 min',
  thumbnail: 'https://images.unsplash.com/photo-1563373929-625e0424fc70',
  thumbnailAlt:
  'Open Bible on wooden table, soft morning light, warm amber glow, peaceful quiet setting',
  views: '1.2k'
},
{
  id: '2',
  title: 'Walking Through the Valley',
  speaker: 'Pastor James Whitfield',
  series: 'Psalms for Every Season',
  topic: 'Faith',
  date: 'June 29, 2026',
  duration: '38 min',
  thumbnail: 'https://images.unsplash.com/photo-1732466854271-9301c65aa09e',
  thumbnailAlt:
  'Misty mountain valley at sunrise, golden light breaking through low clouds, quiet forested hillside',
  views: '980'
},
{
  id: '3',
  title: 'Called to Something Greater',
  speaker: 'Pastor Rachel Monroe',
  series: 'Purpose & Calling',
  topic: 'Purpose',
  date: 'June 22, 2026',
  duration: '45 min',
  thumbnail: 'https://images.unsplash.com/photo-1547639239-e5383c8ddfed',
  thumbnailAlt:
  'People in church sanctuary with hands raised in worship, warm stage lighting, dimly lit atmospheric interior',
  views: '1.5k'
},
{
  id: '4',
  title: 'When Prayer Feels Hard',
  speaker: 'Pastor Rachel Monroe',
  series: 'Anchored in Grace',
  topic: 'Prayer',
  date: 'June 15, 2026',
  duration: '40 min',
  thumbnail: 'https://img.rocket.new/generatedImages/rocket_gen_img_16a563bd1-1772150370537.png',
  thumbnailAlt:
  'Sunlight streaming through tall church windows onto empty pews, golden hour light, quiet sanctuary atmosphere',
  views: '870'
},
{
  id: '5',
  title: 'Contentment in Every Circumstance',
  speaker: 'Pastor James Whitfield',
  series: 'Anchored in Grace',
  topic: 'Faith',
  date: 'June 8, 2026',
  duration: '44 min',
  thumbnail: 'https://images.unsplash.com/photo-1638783720472-6d6a09b1e78e',
  thumbnailAlt:
  'Calm lake at sunrise reflecting golden sky, still water, misty horizon, serene natural landscape',
  views: '1.1k'
},
{
  id: '6',
  title: 'Generosity as a Spiritual Practice',
  speaker: 'Pastor Rachel Monroe',
  series: 'Purpose & Calling',
  topic: 'Giving',
  date: 'June 1, 2026',
  duration: '36 min',
  thumbnail: 'https://images.unsplash.com/photo-1600552852253-51e06624dd65',
  thumbnailAlt:
  'Person extending open hands upward against warm golden light, gesture of offering, spiritual symbolism',
  views: '790'
}];


const filters = ['All', 'Anchored in Grace', 'Psalms for Every Season', 'Purpose & Calling'];

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

export default function SermonsGrid() {
  const [activeFilter, setActiveFilter] = useState('All');
  const headerRef = useRef<HTMLDivElement>(null);

  useScrollReveal(headerRef, 0);

  const filtered =
  activeFilter === 'All' ? allSermons : allSermons.filter((s) => s.series === activeFilter);

  return (
    <section className="section-pad bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header + Filters */}
        <div ref={headerRef} className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-2">
                Browse All
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                All Messages
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              {filtered.length} message{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter sermons by series">
            {filters.map((f) =>
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
              aria-pressed={activeFilter === f}>
              
                {f}
              </button>
            )}
          </div>
        </div>

        {/* Sermon Cards Grid — uniform 3-col, all cs-1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((sermon, i) =>
          <SermonCard key={sermon.id} sermon={sermon} index={i} />
          )}
        </div>
      </div>
    </section>);

}

function SermonCard({ sermon, index }: {sermon: Sermon;index: number;}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useScrollReveal(cardRef, index * 80);

  return (
    <div
      ref={cardRef}
      className="group bg-card border border-border overflow-hidden bento-card cursor-pointer">
      
      {/* Thumbnail */}
      <div className="relative img-zoom-wrap aspect-video overflow-hidden">
        <AppImage
          src={sermon.thumbnail}
          alt={sermon.thumbnailAlt}
          width={600}
          height={338}
          className="w-full h-full object-cover" />
        

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="play-btn-wrap w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
              className="ml-0.5"
              aria-hidden="true">
              
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1">
          <span className="text-[10px] text-white/80 font-medium">{sermon.duration}</span>
        </div>

        {/* Series badge */}
        <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm px-2 py-1">
          <span className="text-[10px] text-white font-bold uppercase tracking-wider">
            {sermon.topic}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          {sermon.series}
        </p>
        <h3 className="font-display text-base font-semibold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {sermon.title}
        </h3>
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{sermon.speaker}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{sermon.date}</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true">
                
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-xs">{sermon.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}