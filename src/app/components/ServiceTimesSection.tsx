'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ServiceTime {
  day: string;
  times: string[];
  type: string;
  note?: string;
}

const services: ServiceTime[] = [
  { day: 'Sunday', times: ['8:00 AM'], type: 'Main Worship Service', note: 'Sunday school for kids is available' },
  { day: 'Sunday Afternoon', times: ['3:00 PM'], type: 'Youth Service', note: 'Ages 14-35 welcome' },
  { day: 'Wednesday', times: ['7:30 PM'], type: 'Midweek Service' },
  { day: 'Saturday', times: ['7:00 AM'], type: "Men's Gathering" },
];

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
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);

  return revealed;
}

export default function ServiceTimesSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card0Ref, card1Ref, card2Ref, card3Ref];

  const headingRevealed = useScrollReveal(headingRef, 0);
  const mapRevealed = useScrollReveal(mapRef, 100);
  const card0Revealed = useScrollReveal(card0Ref, 150);
  const card1Revealed = useScrollReveal(card1Ref, 250);
  const card2Revealed = useScrollReveal(card2Ref, 350);
  const card3Revealed = useScrollReveal(card3Ref, 450);
  const cardRevealed = [card0Revealed, card1Revealed, card2Revealed, card3Revealed];

  const revealClass = (revealed: boolean) =>
    revealed
      ? 'opacity-100 translate-y-0 blur-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
      : 'opacity-0 translate-y-7 blur-[5px]';

  return (
    <section id="service-times" className="section-pad bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section heading */}
        <div ref={headingRef} className={`mb-12 ${revealClass(headingRevealed)}`}>
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">
            Join Us
          </span>
          <h2 className="font-display text-section-title font-light italic text-foreground">
            Service Times<br />
            <span className="not-italic font-bold">&amp; Location</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Service cards */}
          <div className="space-y-3">
            {services.map((s, i) => (
              <div
                key={s.day}
                ref={cardRefs[i]}
                className={`bg-card border border-border p-6 hover:border-primary/40 transition-all group ${revealClass(cardRevealed[i])}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold tracking-widest uppercase text-accent">{s.day}</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1">{s.type}</h3>
                    {s.note && (
                      <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {s.times.map((t) => (
                      <span key={t} className="text-lg font-display font-light text-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Address card */}
            <div className="bg-primary/5 border border-primary/20 p-6 mt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Find Us</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    33 Banaba St, Nangka,<br />
                    Marikina, 1808 Metro Manila
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=33+Banaba+St,+Nangka,+Marikina,+1808+Metro+Manila"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mt-3"
                  >
                    Get Directions
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map placeholder */}
          <div ref={mapRef} className={`relative ${revealClass(mapRevealed)}`}>
            <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px] bg-muted border border-border">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {/* Decorative map-like grid */}
                <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full opacity-10" aria-hidden="true">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="currentColor" strokeWidth="1" />
                  ))}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="currentColor" strokeWidth="1" />
                  ))}
                  <rect x="140" y="80" width="120" height="140" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="160" y="100" width="80" height="100" rx="2" fill="currentColor" opacity="0.15" />
                </svg>

                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg font-semibold text-foreground">Church of God of Prophecy</p>
                    <p className="text-sm text-muted-foreground">33 Banaba St, Nangka, Marikina</p>
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=33+Banaba+St,+Nangka,+Marikina,+1808+Metro+Manila"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground px-6 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}