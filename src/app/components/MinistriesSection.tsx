'use client';

import React, { useRef, useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Ministry {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  colSpan?: string;
  rowSpan?: string;
  tag: string;
}

const ministries: Ministry[] = [
{
  id: 'youth',
  name: 'Youth Ministry',
  tagline: 'Ages 12–18',
  description: 'A vibrant space where teenagers discover identity, purpose, and community. Weekly gatherings, summer camps, and mission trips.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c19eaa2b-1772100673092.png",
  imageAlt: 'Group of teenagers laughing and engaged together in a bright community room, casual seating, warm ambient light, energetic atmosphere',
  colSpan: 'md:col-span-2',
  rowSpan: 'md:row-span-2',
  tag: 'Youth'
},
{
  id: 'women',
  name: "Women's Ministry",
  tagline: 'Community & Growth',
  description: 'Monthly gatherings, Bible studies, and retreats for women of all ages.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_100f79a25-1771790257411.png",
  imageAlt: 'Group of women seated in a circle in a bright airy room, relaxed conversation, natural daylight, warm community setting',
  tag: "Women's"
},
{
  id: 'men',
  name: "Men's Ministry",
  tagline: 'Brotherhood',
  description: 'Equipping men to lead with integrity in home, work, and community.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e2643c1-1768434369566.png",
  imageAlt: 'Group of men in casual clothing gathered around a table in discussion, warm indoor lighting, community hall setting',
  tag: "Men's"
},
{
  id: 'worship',
  name: 'Worship Team',
  tagline: 'Lead in Song',
  description: 'Join our music ministry — vocalists, instrumentalists, and production crew welcome.',
  image: "https://images.unsplash.com/photo-1651975414435-26c83ce1bff3",
  imageAlt: 'Worship band performing on a church stage, colored stage lighting, musicians playing guitars and keyboards, dimly lit sanctuary',
  tag: 'Worship'
},
{
  id: 'outreach',
  name: 'Community Outreach',
  tagline: 'Serve Nashville',
  description: 'Food drives, homeless outreach, neighborhood cleanups, and partnerships with local nonprofits. Faith in action every week.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1319ef9c3-1772984335613.png",
  imageAlt: 'Volunteers in matching shirts sorting food donations at a bright community center, organized rows of boxes, cheerful daytime atmosphere',
  colSpan: 'md:col-span-2',
  tag: 'Outreach'
}];


function useScrollReveal(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setRevealed(true), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);

  return revealed;
}

export default function MinistriesSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headingRevealed = useScrollReveal(headingRef, 0);
  const gridRevealed = useScrollReveal(gridRef, 150);

  const revealClass = (revealed: boolean) =>
    revealed
      ? 'opacity-100 translate-y-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
      : 'opacity-0 translate-y-6';

  return (
    <section id="ministries" className="section-pad bg-background border-t border-border relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div ref={headingRef} className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 ${revealClass(headingRevealed)}`}>
          <div>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">
              Get Involved
            </span>
            <h2 className="font-display text-section-title font-light italic text-foreground">
              Ministries<br />
              <span className="not-italic font-bold">&amp; Events</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed font-light">
            There&apos;s a place for everyone here. Find the ministry that fits your season of life and step in.
          </p>
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px] ${revealClass(gridRevealed)}`}>
          {ministries.map((m) =>
          <div
            key={m.id}
            className={`relative overflow-hidden group bento-card cursor-pointer ${m.colSpan ?? ''} ${m.rowSpan ?? ''}`}>
            
              {/* Image */}
              <div className="img-zoom-wrap absolute inset-0">
                <AppImage
                src={m.image}
                alt={m.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw" />
              </div>

              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/40 bg-black/40 backdrop-blur-sm px-2 py-1">
                  {m.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <p className="text-xs text-white/60 uppercase tracking-widest mb-1">{m.tagline}</p>
                <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                  {m.name}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  {m.description}
                </p>
                <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent">Learn More</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
