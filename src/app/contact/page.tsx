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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation Header Link */}
      <div className="border-b border-stone-800 bg-stone-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-amber-400 transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500">Connect</span>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="mb-12 text-center md:text-left">
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-amber-500 block mb-2">Get In Touch</span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left/Middle Panels: Exact Layout Elements matching your Image */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: Physical Address */}
              <div className="bg-card border border-border p-6 hover:border-primary/40 transition-all rounded shadow-sm flex flex-col items-center">
                <div className="text-amber-500 mb-4 bg-amber-500/10 p-3 rounded-full">
                  <svg className="w-6 h-6 transform rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Physical Address</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  Church of God of Prophecy | Marikina<br />
                  33 Banaba St, Nangka,<br />
                  Marikina, 1808 Metro Manila
                </p>
              </div>

              {/* Card 3: Email Address */}
              <div className="bg-card border border-border p-6 hover:border-primary/40 transition-all rounded shadow-sm flex flex-col items-center">
                <div className="text-amber-500 mb-4 bg-amber-500/10 p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Email Address</h3>
                <p className="text-xs text-muted-foreground font-light hover:text-amber-400 transition-colors">
                  <a href="mailto:info@cogop.org">cogopmarikina@yahoo.com</a>
                </p>
              </div>

              {/* Card 4: Phone Numbers */}
              <div className="bg-card border border-border p-6 hover:border-primary/40 transition-all rounded shadow-sm flex flex-col items-center">
                <div className="text-amber-500 mb-4 bg-amber-500/10 p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.622l4.22 4.22a.75.75 0 001.06 0l2.22-2.22a.75.75 0 011.06 0l4.22 4.22a.75.75 0 010 1.06l-2.22 2.22a.75.75 0 000 1.06l4.22 4.22a.75.75 0 001.06 0l2.22-2.22a.75.75 0 011.06 0l4.22 4.22" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Phone</h3>
                
                <div className="space-y-3 w-full text-xs text-muted-foreground font-light">
                  <div>
                    <span className="block text-amber-200/70 font-medium">Church Secretary</span>
                    <a href="tel:423-559-5100" className="hover:text-amber-400">+63 951 739 8678</a>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Panel: Integrated Newcomer Form Module */}
            <div className="w-full bg-card border border-border p-6 hover:border-primary/40 transition-all rounded shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-1">Are you new here?</h2>
                <p className="text-xs text-muted-foreground font-light">Share your details to connect directly with us.</p>
              </div>

              {submitted ? (
                <div className="text-center py-10 border border-amber-600/30 rounded-xl bg-amber-950/20 p-4">
                  <span className="inline-block bg-amber-500/10 p-2.5 rounded-full text-amber-400 mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <h3 className="text-base font-bold text-amber-200">Welcome to the Family!</h3>
                  <p className="text-xs text-mueted-foreground mt-2 font-light">Your information was successfully logged into our data archives.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-stone-950/80 border border-stone-800 focus:border-amber-600/50 rounded-xl px-3 py-2.5 text-xs text-stone-100 placeholder-stone-700 focus:outline-none transition-colors"
                  placeholder="Juan Dela Cruz"
                  suppressHydrationWarning
                />
              </div>

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-stone-950/80 border border-stone-800 focus:border-amber-600/50 rounded-xl px-3 py-2.5 text-xs text-stone-100 placeholder-stone-700 focus:outline-none transition-colors"
                  placeholder="juan@example.com"
                  suppressHydrationWarning
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-stone-950/80 border border-stone-800 focus:border-amber-600/50 rounded-xl px-3 py-2.5 text-xs text-stone-100 placeholder-stone-700 focus:outline-none transition-colors"
                  placeholder="0912 345 6789"
                  suppressHydrationWarning
                />
              </div>

              {/* Prayer Requests Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Prayer Requests or Notes (Optional)</label>
                <textarea 
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-stone-950/80 border border-stone-800 focus:border-amber-600/50 rounded-xl px-3 py-2.5 text-xs text-stone-100 placeholder-stone-700 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us a little bit about yourself..."
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full mt-2 bg-gradient-to-r bg-primary text-primary-foreground hover:bg-primary/90 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold tracking-wide text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300"
              >
                Submit Information
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
