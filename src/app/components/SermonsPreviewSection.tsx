'use client';

import React, { useRef, useEffect, useState } from 'react';

interface SundayService {
  id: string;
  title: string;
  date: string;
  facebookVideoUrl: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  featured?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE THESE each week with the new Facebook video URLs.
// embedUrl: use the Facebook plugins/video.php embed URL for iframe embeds
// facebookVideoUrl: the direct link to the Facebook video post (for card links)
// ─────────────────────────────────────────────────────────────────────────────
const sundayServices: SundayService[] = [
  {
    id: '1',
    title: 'Sunday Morning Service',
    date: 'July 5, 2026',
    facebookVideoUrl: 'https://www.facebook.com/cogopmarikinaph/videos/1822311055408975/',
    featured: true,
  },
  {
    id: '2',
    title: 'Sunday Morning Service',
    date: 'June 21, 2026',
    facebookVideoUrl: 'https://www.facebook.com/cogopmarikinaph/videos/4263437017240191/',
  },
  {
    id: '3',
    title: 'Sunday Morning Service',
    date: 'June 14, 2026',
    facebookVideoUrl: 'https://www.facebook.com/michal.justiniano.3/videos/2235896843839500/',
    embedUrl: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fmichal.justiniano.3%2Fvideos%2F2235896843839500%2F&show_text=false&width=560&t=0',
  },
  {
    id: '4',
    title: 'Crossing For One Broken Life | Mark 5:1-20',
    date: 'July 12, 2026',
    facebookVideoUrl: 'https://web.facebook.com/cogopmarikinaph/videos/1989221781731174/',
    embedUrl: 'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Fcogopmarikinaph%2Fvideos%2F1989221781731174%2F&show_text=false&width=560&t=0',
  },
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);

  return revealed;
}

function FacebookIframeCard({
  service,
  isFeatured,
}: {
  service: SundayService;
  isFeatured: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="relative w-full bg-gray-900 overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={service.embedUrl}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          title={service.title}
        />
      </div>
      <div className="p-5">
        <h3
          className={`font-display font-semibold text-foreground mb-2 leading-tight ${
            isFeatured ? 'text-xl' : 'text-lg'
          }`}
        >
          {service.title}
        </h3>
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground shrink-0"
            aria-hidden="true"
            suppressHydrationWarning
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-xs text-muted-foreground">{service.date}</span>
        </div>
      </div>
    </div>
  );
}

function FacebookVideoCard({
  service,
  isFeatured,
}: {
  service: SundayService;
  isFeatured: boolean;
}) {
  return (
    <a
      href={service.facebookVideoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      aria-label={`Watch ${service.title} on Facebook`}
    >
      {/* Thumbnail area */}
      <div
        className="relative w-full bg-gray-900 overflow-hidden"
        style={{ paddingTop: '56.25%' }}
      >
        {service.thumbnailUrl ? (
          <img
            src={service.thumbnailUrl}
            alt={`${service.title} thumbnail`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1877F2]/30 via-gray-900 to-gray-950 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="#1877F2"
              className="w-14 h-14 opacity-30"
              aria-hidden="true"
              suppressHydrationWarning
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-[#1877F2]/80 transition-colors duration-300">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6 ml-1"
              aria-hidden="true"
              suppressHydrationWarning
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Info + Watch button */}
      <div className="p-5 flex items-start justify-between gap-3">
        <div>
          <h3
            className={`font-display font-semibold text-foreground mb-2 leading-tight ${
              isFeatured ? 'text-xl' : 'text-lg'
            }`}
          >
            {service.title}
          </h3>
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted-foreground shrink-0"
              aria-hidden="true"
              suppressHydrationWarning
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs text-muted-foreground">{service.date}</span>
          </div>
        </div>

        {/* Watch on Facebook button */}
        <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1877F2] border border-[#1877F2]/30 px-3 py-1.5 group-hover:bg-[#1877F2] group-hover:text-white group-hover:border-[#1877F2] transition-all duration-200 whitespace-nowrap">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true" suppressHydrationWarning>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Watch on Facebook
        </span>
      </div>
    </a>
  );
}

export default function SermonsPreviewSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card0Ref, card1Ref, card2Ref];

  const headingRevealed = useScrollReveal(headingRef, 0);
  const card0Revealed = useScrollReveal(card0Ref, 100);
  const card1Revealed = useScrollReveal(card1Ref, 220);
  const card2Revealed = useScrollReveal(card2Ref, 340);
  const cardRevealed = [card0Revealed, card1Revealed, card2Revealed];

  const revealClass = (revealed: boolean) =>
    revealed
      ? 'opacity-100 translate-y-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
      : 'opacity-0 translate-y-7';

  return (
    <section id="sermons-preview" className="section-pad bg-muted/30 border-t border-border relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div
          ref={headingRef}
          className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 ${revealClass(headingRevealed)}`}
        >
          <div>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">
              Sunday Services
            </span>
            <h2 className="font-display text-section-title font-light italic text-foreground">
              Recent<br />
              <span className="not-italic font-bold">Sunday Services</span>
            </h2>
          </div>
          <a
            href="https://www.facebook.com/cogopmarikinaph"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors group shrink-0"
          >
            Watch on Facebook
            <span className="w-10 h-10 border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:stroke-white transition-colors" aria-hidden="true" suppressHydrationWarning>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        </div>

        {/* Service Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sundayServices.map((service, i) => {
            const isFeatured = !!service.featured && i === 0;
            return (
              <div
                key={service.id}
                ref={cardRefs[i]}
                className={`group relative overflow-hidden bg-card border border-border bento-card ${
                  isFeatured ? 'md:col-span-2' : ''
                } ${revealClass(cardRevealed[i])}`}
              >
                {service.embedUrl ? (
                  <FacebookIframeCard service={service} isFeatured={isFeatured} />
                ) : (
                  <FacebookVideoCard service={service} isFeatured={isFeatured} />
                )}
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}