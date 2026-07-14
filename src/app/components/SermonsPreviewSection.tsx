'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

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
    id: '4',
    title: 'Crossing For One Broken Life | Mark 5:1-20',
    date: 'July 12, 2026',
    facebookVideoUrl: 'https://web.facebook.com/cogopmarikinaph/videos/1989221781731174/',
    featured: true,
  },
  {
    id: '1',
    title: 'They Came To The Other Side | Mark 5:1',
    date: 'July 5, 2026',
    facebookVideoUrl: 'https://www.facebook.com/cogopmarikinaph/videos/1822311055408975/',
    featured: false,
  },
  {
    id: '2',
    title: 'Anchored Fathers, Anchored Families | Hebrews 6:19',
    date: 'June 21, 2026',
    facebookVideoUrl: 'https://www.facebook.com/cogopmarikinaph/videos/4263437017240191/',
  },
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay, mounted]);

  return mounted ? revealed : false;
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
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollReveal(sectionRef, 0);

  return (
    <section 
      ref={sectionRef} 
      className={`py-16 bg-background transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Recent Sermons & Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch our latest live streams and worship services directly from Facebook.
          </p>
        </div>

        {/* Video Responsive Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sundayServices.map((service) => {
            const isFeatured = !!service.featured;

            return (
              <div
                key={service.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
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

        {/* See More Option Button Wrapper */}
        <div className="flex justify-center mt-4">
          <Link
            href="/sermons"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3.5 text-sm font-semibold tracking-wider uppercase rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200 transform hover:scale-[1.02]"
          >
            See More Sermons
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        
      </div>
    </section>
  );
}
