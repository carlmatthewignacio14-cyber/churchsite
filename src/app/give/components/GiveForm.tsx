'use client';

import React, { useState } from 'react';

const presetAmounts = [25, 50, 100, 250, 500];

const funds = [
  'General Fund',
  'Building Fund',
  'Missions & Outreach',
  'Youth Ministry',
  'Community Benevolence',
];

interface FormState {
  amount: number | null;
  customAmount: string;
  frequency: 'one-time' | 'monthly';
  fund: string;
  firstName: string;
  lastName: string;
  email: string;
  note: string;
}

export default function GiveForm() {
  const [form, setForm] = useState<FormState>({
    amount: 50,
    customAmount: '',
    frequency: 'one-time',
    fund: 'General Fund',
    firstName: '',
    lastName: '',
    email: '',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const effectiveAmount = form.customAmount
    ? parseFloat(form.customAmount) || 0
    : form.amount ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="section-pad bg-background relative z-10">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-card border border-border p-12 flex flex-col items-center gap-5">
            <div className="w-20 h-20 bg-primary/10 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="font-display text-3xl font-semibold text-foreground">Thank You!</h2>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Your gift of <strong className="text-foreground">${effectiveAmount}</strong> to the{' '}
              <strong className="text-foreground">{form.fund}</strong> has been received. A confirmation will be sent to your email.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-2 text-sm font-semibold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
            >
              Give Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad bg-background relative z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Form — 3 cols */}
          <div className="lg:col-span-3 bg-card border border-border p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
              Make a Gift
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Frequency Toggle */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                  Giving Frequency
                </p>
                <div className="flex bg-muted rounded-full p-1 w-fit gap-1">
                  {(['one-time', 'monthly'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setForm({ ...form, frequency: f })}
                      className={`freq-btn capitalize ${form.frequency === f ? 'active' : ''}`}
                    >
                      {f === 'one-time' ? 'One-Time' : 'Monthly'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selector */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                  Gift Amount
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  {presetAmounts.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setForm({ ...form, amount: a, customAmount: '' })}
                      className={`amount-btn ${form.amount === a && !form.customAmount ? 'selected' : ''}`}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={form.customAmount}
                    onChange={(e) => setForm({ ...form, customAmount: e.target.value, amount: null })}
                    className="form-input-box pl-7"
                    min="1"
                    aria-label="Custom giving amount"
                  />
                </div>
              </div>

              {/* Fund Designation */}
              <div>
                <label htmlFor="fund" className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold block">
                  Designate Your Gift
                </label>
                <select
                  id="fund"
                  value={form.fund}
                  onChange={(e) => setForm({ ...form, fund: e.target.value })}
                  className="form-input-box appearance-none cursor-pointer"
                  aria-label="Select fund"
                >
                  {funds.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Donor Info */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                  Your Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="form-input-box"
                    required
                    aria-label="First name"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="form-input-box"
                    required
                    aria-label="Last name"
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input-box w-full"
                    required
                    aria-label="Email address"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <textarea
                  placeholder="Note (optional)"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  className="form-input-box w-full resize-none"
                  aria-label="Optional note"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-all hover:scale-[1.01] flex items-center justify-center gap-3 group"
              >
                {form.frequency === 'monthly' ? 'Start Monthly Giving' : 'Give Now'}
                {effectiveAmount > 0 && (
                  <span className="bg-primary-foreground/20 px-2 py-0.5 text-xs rounded">
                    ${effectiveAmount}
                  </span>
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                🔒 Secure giving powered by SSL encryption. Your information is never shared.
              </p>
            </form>
          </div>

          {/* Sidebar — 2 cols */}
          <div className="lg:col-span-2 space-y-5 pt-0 lg:pt-2">
            {/* Summary card */}
            <div className="bg-primary/5 border border-primary/20 p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Your Gift Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold text-foreground">
                    {effectiveAmount > 0 ? `$${effectiveAmount}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-semibold text-foreground capitalize">
                    {form.frequency === 'one-time' ? 'One-Time' : 'Monthly'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fund</span>
                  <span className="font-semibold text-foreground text-right max-w-[140px] leading-snug">{form.fund}</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between text-sm font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary text-lg font-display">
                    {effectiveAmount > 0 ? `$${effectiveAmount}` : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tax info */}
            <div className="bg-card border border-border p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/10 flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-accent" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Tax Deductible</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Church of God of Prophecy is a registered 501(c)(3) organization. All gifts are tax-deductible to the fullest extent of the law. A receipt will be emailed to you.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="p-5 border border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Questions about giving? Contact our stewardship team at{' '}
                <a href="mailto:give@churchsite.org" className="text-primary hover:underline">
                  give@churchsite.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}