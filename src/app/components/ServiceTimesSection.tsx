'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ServiceTime {
  day: string;
  times: string[];
  type: string;
  note?: string;
}

const services: ServiceTime[] = [
  {
    day: 'Sunday',
    times: ['8:00 AM'],
    type: 'Main Worship Service',
    note: 'Sunday School for kids is available',
  },
  {
    day: 'Sunday Afternoon',
    times: ['3:00 PM'],
    type: 'Youth Service',
    note: 'Ages 14-35 are welcome',
  },
  { day: 'Wednesday', times: ['7:30 PM'], type: 'Midweek Service' },
  { day: 'Saturday', times: ['7:00 AM'], type: "Men's Gathering" },
];

function useScrollReveal(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  const [revealed, setRevealed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
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
  }, [ref, delay, mounted]);

  return mounted ? revealed : false;
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

  // Force Client-Side Hydration Check to absorb all browser extension injections safely
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const revealClass = (revealed: boolean) =>
    revealed
      ? 'opacity-100 translate-y-0 blur-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
      : 'opacity-0 translate-y-7 blur-[5px]';

  return (
    <section
      id="service-times"
      className="section-pad bg-background relative z-10"
      suppressHydrationWarning
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section heading */}
        <div ref={headingRef} className={`mb-12 ${revealClass(headingRevealed)}`}>
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">
            Join Us
          </span>
          <h2
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            className="text-section-title font-regular text-foreground"
          >
            Service Times
            <br />
            <span
              style={{ fontFamily: "'Gabriel Sans', sans-serif" }}
              className="not-italic font-bold"
            >
              &amp; Location
            </span>
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
                      <span className="text-xs font-bold tracking-widest uppercase text-accent">
                        {s.day}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                      {s.type}
                    </h3>
                    {s.note && <p className="text-xs text-muted-foreground mt-1">{s.note}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {s.times.map((t) => (
                      <span
                        key={t}
                        className="text-lg font-display font-light text-foreground"
                      >
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
                  {isMounted && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="text-primary"
                      aria-hidden="true"
                      suppressHydrationWarning
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Find Us</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    33 Banaba St, Nangka,
                    <br />
                    Marikina, 1808 Metro Manila
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=33+Banaba+St,+Nangka,+Marikina,+1808+Metro+Manila"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mt-3"
                  >
                    Get Directions
                    {isMounted && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                        suppressHydrationWarning
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map placeholder */}
          <div ref={mapRef} className={`relative ${revealClass(mapRevealed)}`}>
            <div className="relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px] border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.4!2d121.1!3d14.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b8e5a1234567%3A0x0!2s33+Banaba+St%2C+Nangka%2C+Marikina%2C+1808+Metro+Manila!5e1!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph&maptype=satellite"
                width="100%"
                height="100%"
                className="absolute inset-0 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Satellite map of Church of God of Prophecy Marikina at 33 Banaba St, Nangka, Marikina"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
