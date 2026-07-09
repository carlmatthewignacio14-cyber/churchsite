'use client';

import React, { useRef, useState, useEffect } from 'react';

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

export default function PrayerSection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftRevealed = useScrollReveal(leftRef, 0);
  const rightRevealed = useScrollReveal(rightRef, 180);

  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', request: '', private: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  const revealClass = (revealed: boolean) =>
    !mounted
      ? ''
      : revealed
      ? 'opacity-100 translate-y-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
      : 'opacity-0 translate-y-6';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="prayer" className="section-pad bg-muted/30 border-t border-border relative z-10 overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 w-96 h-96 blob-primary opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div ref={leftRef} className={revealClass(leftRevealed)}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-4">
              We&apos;re Here For You
            </span>
            <h2 className="font-display text-section-title font-light italic text-foreground mb-6">
              Submit a<br />
              <span className="not-italic font-bold">Prayer Request</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
              Our prayer team reads every request and lifts each one before God. You are never alone — share what&apos;s on your heart.
            </p>

            {/* Commitments */}
            <div className="space-y-4">
              {[
                { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'All requests are kept confidential' },
                { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', text: 'Our dedicated prayer team prays weekly' },
                { icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', text: 'Personal follow-up available on request' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary" aria-hidden="true">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div ref={rightRef} className={`bg-card border border-border p-8 md:p-10 ${revealClass(rightRevealed)}`}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground">Prayer Received</h3>
                <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                  Thank you for trusting us with your heart. Our team will be praying for you.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', request: '', private: false }); }}
                  className="mt-4 text-xs font-semibold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-6">Share Your Request</h3>

                <div className="relative">
                  <input
                    type="text"
                    id="prayer-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                    className="form-input"
                    required
                    aria-label="Your name"
                    suppressHydrationWarning
                  />
                  <label htmlFor="prayer-name" className="absolute -top-4 left-0 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="prayer-email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="form-input"
                    aria-label="Email address"
                    suppressHydrationWarning
                  />
                  <label htmlFor="prayer-email" className="absolute -top-4 left-0 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Email (Optional)
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    id="prayer-request"
                    value={form.request}
                    onChange={(e) => setForm({ ...form, request: e.target.value })}
                    placeholder="Share what's on your heart..."
                    rows={5}
                    className="form-input resize-none"
                    required
                    aria-label="Prayer request"
                    suppressHydrationWarning
                  />
                  <label htmlFor="prayer-request" className="absolute -top-4 left-0 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Your Request
                  </label>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 border flex items-center justify-center transition-colors ${form.private ? 'bg-primary border-primary' : 'border-border'}`}
                    onClick={() => setForm({ ...form, private: !form.private })}
                    role="checkbox"
                    aria-checked={form.private}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setForm({ ...form, private: !form.private })}
                  >
                    {form.private && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">Keep this request private (prayer team only)</span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-4 text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-all hover:scale-[1.01] flex items-center justify-center gap-3 group"
                >
                  Submit Prayer Request
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}