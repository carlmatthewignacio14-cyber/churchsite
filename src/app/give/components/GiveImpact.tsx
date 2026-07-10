'use client';

import React, { useRef, useEffect } from 'react';

interface ImpactItem {
  icon: string;
  stat: string;
  label: string;
  description: string;
}

const impacts: ImpactItem[] = [
  {
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    stat: '1,200+',
    label: 'Families Supported',
    description: 'Meals, emergency funds, and counseling provided to Nashville families through our benevolence program annually.',
  },
  {
    icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10',
    stat: '14',
    label: 'Mission Partners',
    description: 'Local and international ministry partners funded through your generosity, reaching communities in 8 countries.',
  },
  {
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    stat: '₱2.4M',
    label: 'Given Last Year',
    description: 'Total giving in 2025 funded staff, facilities, missions, and community outreach — 100% reported transparently.',
  },
];

function useScrollReveal(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (el) {
                el.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ₱{delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ₱{delay}ms`;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              }
            }, 0);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);
}

export default function GiveImpact() {
  const headRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card0Ref, card1Ref, card2Ref];

  useScrollReveal(headRef, 0);
  useScrollReveal(card0Ref, 100);
  useScrollReveal(card1Ref, 220);
  useScrollReveal(card2Ref, 340);

  return (
    <section className="section-pad bg-muted/30 border-t border-border relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div ref={headRef} className="text-center mb-12">
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">
            Where Your Gift Goes
          </span>
          <h2 className="font-display text-section-title font-light italic text-foreground">
            Real<br />
            <span className="not-italic font-bold">Impact</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mt-4 leading-relaxed">
            We believe in complete financial transparency. Here&apos;s what your generosity made possible last year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {impacts.map((item, i) => (
            <div
              key={item.label}
              ref={cardRefs[i]}
              className="bg-card border border-border p-8 hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary" aria-hidden="true">
                  <path d={item.icon} />
                </svg>
              </div>
              <div className="font-display text-4xl font-light text-foreground mb-1">{item.stat}</div>
              <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">{item.label}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Financial transparency note */}
        <div className="mt-10 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground max-w-xl">
            Church of God of Prophecy publishes a full annual financial report available to all members and donors. We are committed to being good stewards of every gift entrusted to us.
          </p>
          <button className="shrink-0 border border-primary text-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">
            View Annual Report
          </button>
        </div>
      </div>
    </section>
  );
}