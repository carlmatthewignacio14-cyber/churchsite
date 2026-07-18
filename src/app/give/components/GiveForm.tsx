'use client';

import React, { useState } from 'react';

const presetAmounts = [100, 200, 500, 1000, 2000];

const funds = [
  'General Fund',
  'Building Fund',
  'Emergency Fund',
  'Youth Ministry',
  'Kids Ministry',
  'Pastor',
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
  paymentMethod: 'card' | 'gcash' | 'inperson';
}

export default function GiveForm() {
  const [form, setForm] = useState<FormState>({
    amount: null,
    customAmount: '',
    frequency: 'one-time',
    fund: 'General Fund',
    firstName: '',
    lastName: '',
    email: '',
    note: '',
    paymentMethod: 'card',
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
      <section className="py-16 bg-[#F4EFEA] relative z-10 font-sans">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-[#FAF8F5] border border-[#E6DDD4] rounded-none p-12 flex flex-col items-center gap-5 shadow-sm">
            <div className="w-20 h-20 bg-[#8B5E3C]/10 flex items-center justify-center rounded-full text-[#8B5E3C]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#1E1611]">Thank You!</h2>
            <p className="text-[#5A4F43] leading-relaxed max-w-sm text-sm">
              Your gift of <strong className="text-[#1E1611]">₱{effectiveAmount}</strong> to the{' '}
              <strong className="text-[#1E1611]">{form.fund}</strong> via{' '}
              <span className="capitalize text-[#1E1611] font-semibold">
                {form.paymentMethod === 'card' ? 'Online Card' : form.paymentMethod}
              </span>{' '}
              has been documented.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-[#8B5E3C] hover:text-[#5A3E29] transition-colors"
            >
              Give Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F4EFEA] relative z-10 font-sans text-[#1E1611]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Form Side */}
          <div className="lg:col-span-3 bg-[#FAF8F5] border border-[#E6DDD4] rounded-none p-8 md:p-10 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#1E1611] mb-8">
              Make a Gift
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Frequency Toggle */}
              <div>
                <p className="text-xs uppercase tracking-widest text-[#706053] mb-3 font-bold">
                  Giving Frequency
                </p>
                <div className="flex bg-[#E6DDD4]/40 p-1 w-fit rounded-none border border-[#D1C4B6]">
                  {(['one-time', 'monthly'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setForm({ ...form, frequency: f })}
                      suppressHydrationWarning
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                        form.frequency === f
                          ? 'bg-[#5A3E29] text-white shadow-sm'
                          : 'text-[#706053] hover:text-[#1E1611]'
                      }`}
                    >
                      {f === 'one-time' ? 'One-Time' : 'Monthly'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selector */}
              <div>
                <p className="text-xs uppercase tracking-widest text-[#706053] mb-3 font-bold">
                  Gift Amount
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#706053] text-sm font-semibold">₱</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    required 
                    value={form.customAmount}
                    onChange={(e) => setForm({ ...form, customAmount: e.target.value, amount: null })}
                    className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] rounded-none pl-7 pr-4 py-3 text-sm text-[#1E1611] placeholder-[#A39485] focus:outline-none transition-all"
                    min="1"
                    aria-label="Custom giving amount"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <p className="text-xs uppercase tracking-widest text-[#706053] mb-3 font-bold">
                  Choose Payment Option
                </p>
                <div className="grid grid-cols-3 gap-2 bg-[#E6DDD4]/40 p-1 border border-[#D1C4B6] rounded-none">
                  {([
                    { id: 'card', label: 'Online Card' },
                    { id: 'gcash', label: 'GCash' },
                    { id: 'inperson', label: 'In-Person' },
                  ] as const).map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setForm({ ...form, paymentMethod: method.id })}
                      suppressHydrationWarning
                      className={`text-xs py-3 font-bold uppercase tracking-wider transition-all rounded-none ${
                        form.paymentMethod === method.id
                          ? 'bg-[#5A3E29] text-white shadow-sm'
                          : 'text-[#706053] hover:text-[#1E1611]'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fund Designation */}
              <div>
                <label htmlFor="fund" className="text-xs uppercase tracking-widest text-[#706053] mb-3 font-bold block">
                  Designate Your Gift
                </label>
                <select
                  id="fund"
                  value={form.fund}
                  onChange={(e) => setForm({ ...form, fund: e.target.value })}
                  className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] focus:outline-none transition-all appearance-none cursor-pointer"
                  aria-label="Select fund"
                  suppressHydrationWarning
                >
                  {funds.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Donor Info */}
              <div>
                <p className="text-xs uppercase tracking-widest text-[#706053] mb-3 font-bold">
                  Your Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] focus:outline-none placeholder-[#A39485]"
                    required
                    suppressHydrationWarning
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] focus:outline-none placeholder-[#A39485]"
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] focus:outline-none placeholder-[#A39485]"
                    required
                    suppressHydrationWarning
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
                  className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] focus:outline-none placeholder-[#A39485] resize-none"
                  suppressHydrationWarning
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                suppressHydrationWarning
                className="w-full bg-[#5A3E29] hover:bg-[#3D2A1A] text-white font-bold uppercase tracking-widest text-sm py-4 transition-colors rounded-none"
              >
                {form.frequency === 'monthly' ? 'Start Monthly Giving' : 'Complete Donation'}
              </button>
            </form>
          </div>

          {/* Right Side: Conditional Dynamic Information Panels */}
          <div className="lg:col-span-2 space-y-6">
            {form.paymentMethod === 'card' && (
              <div className="bg-[#FAF8F5] border border-[#E6DDD4] p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-[#1E1611] mb-3">Online Cards</h3>
                <p className="text-sm text-[#5A4F43] leading-relaxed">
                  Upon clicking submit, you will be securely routed through our automated SSL checkout terminal to complete your Visa or Mastercard transfer.
                </p>
              </div>
            )}

            {form.paymentMethod === 'gcash' && (
              <div className="bg-[#FAF8F5] border border-[#E6DDD4] p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-[#1E1611] mb-3">GCash Transfer</h3>
                <p className="text-sm text-[#5A4F43] leading-relaxed mb-3">
                  Send your tithes directly to our registered mobile wallet credentials:
                </p>
                <div className="text-sm text-[#1E1611] space-y-1">
                  <p><span className="font-semibold">Merchant:</span> COGOP MARIKINA</p>
                  <p><span className="font-semibold">Number:</span> 09859397919</p>
                </div>
              </div>
            )}

            {form.paymentMethod === 'inperson' && (
              <div className="bg-[#FAF8F5] border border-[#E6DDD4] p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-[#1E1611] mb-3">In-Person Drop</h3>
                <p className="text-sm text-[#5A4F43] leading-relaxed mb-3">
                  You can secure offering envelopes directly from our ushers at the sanctuary lobby entrance during our Sunday worship assemblies.
                </p>
                <p className="text-sm text-[#1E1611] font-semibold">📍 33 Banaba St, Nangka, Marikina City</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
