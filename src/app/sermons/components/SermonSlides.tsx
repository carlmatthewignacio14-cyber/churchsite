'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface PowerPointSlide {
  id: string;
  title: string;
  speaker: string;
  date?: string;
  embedUrl: string;
  downloadUrl: string;
  imageUrl: string;
  viewUrl: string;
}

const sermonSlides: PowerPointSlide[] = [
  {
    id: '1',
    title: 'A Faith That Comes Out Stronger | Mark 4:41',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus',
    imageUrl:
      'https://docs.google.com/presentation/d/1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus/export?format=png',
    viewUrl:
      'https://docs.google.com/presentation/d/1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus/edit?usp=sharing',
  },
  {
    id: '2',
    title: 'Bridging The Faith | 1 Timothy 5:1-8',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y',
    imageUrl:
      'https://docs.google.com/presentation/d/1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y/export?format=png',
    viewUrl:
      'https://docs.google.com/presentation/d/1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y/edit?usp=sharing',
  },
  {
    id: '3',
    title: 'Christ Has Indeed Been Raised | 1 Corinthians 15:12-20',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d',
    imageUrl:
      'https://docs.google.com/presentation/d/1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d/export?format=png',
    viewUrl:
      'https://docs.google.com/presentation/d/1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d/edit?usp=sharing',
  },
  {
    id: '4',
    title: 'Crossing For One Broken Life | Mark 5:1-20',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT/preview',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT',
    imageUrl:
      'https://docs.google.com/presentation/d/18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT/export?format=png',
    viewUrl:
      'https://docs.google.com/presentation/d/18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT/edit?usp=sharing',
  },
];

export default function SermonSlidesSection() {
  const [showAll, setShowAll] = useState(false);
  const [activeViewerId, setActiveViewerId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedSlideForShare, setSelectedSlideForShare] = useState<PowerPointSlide | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShareClick = async (slide: PowerPointSlide) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setShowLoginModal(true);
      return;
    }
    setSelectedSlideForShare(slide);
  };

  const handleDownload = async (downloadUrl: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setShowLoginModal(true);
      return;
    }
    window.location.href = downloadUrl;
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (fallbackErr) {
        prompt('Copy this link manually:', url);
      }
      document.body.removeChild(textArea);
    }
  };

  const triggerSystemShare = async (slide: PowerPointSlide) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: slide.title,
          text: `Check out these sermon slides: ${slide.title}`,
          url: slide.viewUrl,
        });
        setSelectedSlideForShare(null);
        return;
      } catch (error: any) {
        if (error.name === 'AbortError') return;
      }
    } else {
      alert('Native system share (Quick Share, AirDrop, Bluetooth, etc.) is not supported on this browser/device.');
    }
  };

  const visibleSlides = showAll ? sermonSlides : sermonSlides.slice(0, 3);

  return (
    <section className="py-16 bg-gray-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl">
            Sermon Presentations & Slides
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            View or download the slides from our recent Sunday messages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleSlides.map((slide) => {
            const isViewing = activeViewerId === slide.id;

            return (
              <div
                key={slide.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div
                    className="relative w-full bg-gray-900 overflow-hidden"
                    style={{ paddingTop: '56.25%' }}
                  >
                    {isViewing ? (
                      <iframe
                        src={slide.embedUrl}
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 'none' }}
                        allowFullScreen
                        title={slide.title}
                      />
                    ) : (
                      <>
                        <img
                          src={slide.imageUrl}
                          alt={`${slide.title} cover`}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider text-orange-600 bg-white/95 px-2.5 py-1 rounded-md uppercase shadow-sm z-10">
                          PPTX
                        </span>
                      </>
                    )}
                  </div>

                  <div className="p-6 pb-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug line-clamp-2 min-h-[3rem]">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">{slide.speaker}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 border-t border-gray-100 pt-4 w-full">
                    <button
                      onClick={() => setActiveViewerId(isViewing ? null : slide.id)}
                      className={`w-full sm:w-auto text-center border text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                        isViewing
                          ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {isViewing ? 'Close Preview' : 'View Slides'}
                    </button>

                    <div className="flex items-center gap-2 w-full sm:flex-1">
                      <button
                        onClick={() => handleDownload(slide.downloadUrl)}
                        className="text-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex-1 cursor-pointer"
                      >
                        Download
                      </button>

                      <button
                        onClick={() => handleShareClick(slide)}
                        className="p-2.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                        title="Share Presentation"
                        aria-label="Share Presentation"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="17" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sermonSlides.length > 3 && (
          <div className="flex justify-center mt-12">
            <Link
              href="/sermons/slides"
              className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              See More Slides
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="mt-0.5"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Sheet Modal with Horizontal Swipeable App Row */}
      {selectedSlideForShare && (
        <div className="fixed inset-0 bg-black/75 flex items-end sm:items-center justify-center z-50 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-[#18181b] border-t sm:border border-gray-800 text-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl transition-transform duration-300">
            {/* Drag Handle indicator for mobile bottom sheet */}
            <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto sm:hidden mb-1"></div>

            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <h3 className="text-base font-bold text-white tracking-wide">Sharing link</h3>
              <button 
                onClick={() => setSelectedSlideForShare(null)}
                className="text-gray-400 hover:text-white text-sm font-bold p-1 cursor-pointer bg-gray-800/60 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Link Preview Bar */}
            <div className="bg-[#27272a] border border-gray-700/60 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">{selectedSlideForShare.title}</h4>
                <p className="text-[11px] text-gray-400 truncate">{selectedSlideForShare.viewUrl}</p>
              </div>
              <button
                onClick={() => copyToClipboard(selectedSlideForShare.viewUrl)}
                className="p-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition shrink-0 flex items-center justify-center cursor-pointer border border-gray-600"
                title="Copy Link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>

            {/* Horizontal Swipeable App Row */}
            <div className="space-y-2">
              <div className="overflow-x-auto flex items-start gap-4 pb-2 pt-1 px-1 scrollbar-none">
                
                {/* 1. Quick Share / Apple AirDrop */}
                <button
                  onClick={() => triggerSystemShare(selectedSlideForShare)}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                    <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M7 16V4m0 0L3 8m4-4l4 4m6 4v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-gray-300 text-center leading-tight">Quick Share</span>
                </button>

                {/* 2. Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedSlideForShare.viewUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
                >
                  <div className="w-14 h-14 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-300 text-center leading-tight">Facebook</span>
                </a>

                {/* 3. Messenger */}
                <a
                  href={`fb-messenger://share/?link=${encodeURIComponent(selectedSlideForShare.viewUrl)}`}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#006AFF] to-[#A333FF] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.084 0 11.356c0 3.178 1.354 6.04 3.528 8.083V24l3.322-1.825c1.472.41 3.036.634 4.65 .634 6.627 0 12-5.084 12-11.356S18.627 0 12 0zm1.189 15.05l-3.079-3.282-6.01 3.282 6.608-7.014 3.15 3.283 5.939-3.283-6.608 7.014z"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-300 text-center leading-tight">Messenger</span>
                </a>

                {/* 4. Instagram */}
                <a
                  href={`https://instagram.com/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(selectedSlideForShare.viewUrl);
                    alert('Link copied! Open Instagram to paste and share.');
                  }}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-300 text-center leading-tight">Instagram</span>
                </a>

                {/* 5. Messages (SMS) */}
                <a
                  href={`sms:?body=${encodeURIComponent(`Check out these sermon slides: ${selectedSlideForShare.viewUrl}`)}`}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
                >
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                    <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-300 text-center leading-tight">Messages</span>
                </a>

                {/* 6. Gmail */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Sermon Slides: ${selectedSlideForShare.title}`)}&body=${encodeURIComponent(`Check out these sermon slides: ${selectedSlideForShare.viewUrl}`)}`}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
                >
                  <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                    <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-300 text-center leading-tight">Gmail</span>
                </a>

                {/* 7. Bluetooth */}
                <button
                  onClick={() => triggerSystemShare(selectedSlideForShare)}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                    <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24"><path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11"/></svg>
                  </div>
                  <span className="text-[11px] text-gray-300 text-center leading-tight">Bluetooth</span>
                </button>

                {/* 8. More (Other apps) */}
                <button
                  onClick={() => triggerSystemShare(selectedSlideForShare)}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-16 group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                    <svg className="w-7 h-7 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="17" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  </div>
                  <span className="text-[11px] text-blue-400 font-bold text-center leading-tight">More</span>
                </button>

              </div>
            </div>

            {copied && (
              <div className="text-center text-xs text-emerald-400 font-semibold bg-emerald-950/60 py-2.5 rounded-xl border border-emerald-800/50">
                ✅ Link copied to clipboard successfully!
              </div>
            )}

            <button
              onClick={() => setSelectedSlideForShare(null)}
              className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Login Prompt Modal for Visitors */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-orange-50 border border-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🔒
            </div>
            <h3 className="text-xl font-bold text-gray-900">Member Access Required</h3>
            <p className="text-gray-600 text-sm">
              You can freely preview sermon slides online, but downloading files and sharing links requires a registered account.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.href = '/login'}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Log In Now
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
