'use client';

import React, { useEffect, useRef } from 'react';

interface Stat {
  prefix: string;
  target: number;
  suffix: string;
  label: string;
  decimals: number;
}

const stats: Stat[] = [
  { prefix: '', target: 2400, suffix: '+', label: 'Weekly Attendees', decimals: 0 },
  { prefix: '', target: 47, suffix: ' yrs', label: 'Serving Nashville', decimals: 0 },
  { prefix: '', target: 120, suffix: '+', label: 'Ministry Volunteers', decimals: 0 },
];

function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  target: number,
  decimals: number,
  suffix: string,
  prefix: string
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 1600;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const ease = 1 - Math.pow(1 - p, 4);
              const val = target * ease;
              el.textContent = prefix + val.toFixed(decimals) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, target, decimals, suffix, prefix]);
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const numRef = useRef<HTMLSpanElement>(null);
  useCountUp(numRef, stat.target, stat.decimals, stat.suffix, stat.prefix);

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 px-6 group hover:bg-card transition-colors ${
        index < stats.length - 1 ? 'border-r border-border' : ''
      }`}
    >
      <span ref={numRef} className="counter-num font-display font-light text-foreground">
        {stat.prefix}0{stat.suffix}
      </span>
      <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1 font-medium">
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="border-y border-border bg-muted/40 relative z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-3">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
