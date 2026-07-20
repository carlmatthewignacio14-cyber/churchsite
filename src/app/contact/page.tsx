'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Replace with your active Google Apps Script web app URL
    const GOOGLE_SCRIPT_URL = 'https://google.com';

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', notes: '' });
    } catch (error) {
      console.error('Failed to submit entry to Google Sheets:', error);
      alert('Something went wrong. Please try submitting again or reach out directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F4EFEA] text-[#1E1611] font-sans selection:bg-[#8B5E3C]/20">
      {/* Navigation Header Link */}
      <div className="border-b border-[#E6DDD4] bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl h-20 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-[#706053] hover:text-[#1E1611] transition-colors flex items-center gap-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B5E3C]">Connect With Us</span>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

            {/* Left Column: Core Header Info & Church Details */}
            <div className="space-y-10">
              <div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#8B5E3C] block mb-3">We&apos;re Here For You</span>
                <h1 className="text-5xl font-serif font-bold tracking-tight text-[#1E1611] leading-none mb-6">
                  Contact Us
                </h1>
                <p className="text-base text-[#5A4F43] leading-relaxed font-normal">
                  Our team reads every message and lifts up our community. Whether you have a question about our ministries, services, or need support — you are never alone.
                </p>
              </div>

              {/* Exact Information Grid Layout Icons matching the template */}
              <div className="space-y-6 pt-4">
                {/* Info 1: Physical Location */}
                <div className="flex items-start gap-4">
                  <div className="text-[#8B5E3C] pt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#5A4F43] leading-relaxed">
                    <strong className="block text-[#1E1611] font-semibold mb-0.5">Physical Address</strong>
                    33 Banaba St, Nangka, Marikina, 1808 Metro Manila
                  </p>
                </div>

                {/* Info 2: Email Routing */}
                <div className="flex items-start gap-4">
                  <div className="text-[#8B5E3C] pt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#5A4F43] leading-relaxed">
                    <strong className="block text-[#1E1611] font-semibold mb-0.5">Email Address</strong>
                    <a href="mailto:cogopmarikina@yahoo.com" className="hover:underline text-[#8B5E3C]">cogopmarikina@yahoo.com</a>
                  </p>
                </div>

                {/* Info 3: Telephone Directory */}
                <div className="flex items-start gap-4">
                  <div className="text-[#8B5E3C] pt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.622l4.22 4.22a.75.75 0 001.06 0l2.22-2.22a.75.75 0 011.06 0l4.22 4.22a.75.75 0 010 1.06l-2.22 2.22a.75.75 0 000 1.06l4.22 4.22a.75.75 0 001.06 0l2.22-2.22a.75.75 0 011.06 0l4.22 4.22" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#5A4F43] leading-relaxed">
                    <strong className="block text-[#1E1611] font-semibold mb-0.5">Church Secretary</strong>
                    <a href="tel:+639517398678" className="hover:underline text-[#8B5E3C]">+63 951 739 8678</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Clean White Form Box (Matching "Share Your Request") */}
            <div className="w-full bg-[#FAF8F5] border border-[#E6DDD4] rounded-sm p-8 md:p-10 shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#1E1611] mb-2">Share Your Info</h2>
                <p className="text-sm text-[#706053] font-light">Are you new here? Share your details to connect directly with us.</p>
              </div>

              {submitted ? (
                <div className="text-center py-12 bg-[#F4EFEA] border border-[#E6DDD4] rounded-sm p-6">
                  <span className="inline-block bg-[#8B5E3C]/10 p-3 rounded-full text-[#8B5E3C] mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-bold text-[#1E1611]">Welcome to the Family!</h3>
                  <p className="text-xs text-[#706053] mt-2">Your information has been securely logged into our database.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#706053] mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] placeholder-[#A39485] focus:outline-none transition-all"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#706053] mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] placeholder-[#A39485] focus:outline-none transition-all"
                      placeholder="Your Email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#706053] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] placeholder-[#A39485] focus:outline-none transition-all"
                      placeholder="Your Phone Number"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#706053] mb-2">Prayer Requests or Notes (Optional)</label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-white border border-[#D1C4B6] focus:border-[#8B5E3C] focus:ring-1 focus:ring-[#8B5E3C] rounded-none px-4 py-3 text-sm text-[#1E1611] placeholder-[#A39485] focus:outline-none transition-all resize-none"
                      placeholder="Tell us a little bit about yourself..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#8B5E3C] hover:bg-[#6B4A2E] text-white font-bold uppercase tracking-wider py-4 px-8 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    suppressHydrationWarning
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Information'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
