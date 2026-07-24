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
    // 1. Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    // 2. Try triggering the phone's native share drawer first
    if (navigator.share) {
      try {
        await navigator.share({
          title: slide.title,
          text: `Check out these sermon slides: ${slide.title}`,
          url: slide.viewUrl,
        });
        return;
      } catch (error: any) {
        if (error.name === 'AbortError') return; // User cancelled
      }
    }

    // 3. Fallback for desktop or unsupported browsers: Open the custom Share Modal
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

      {/* Share Options Modal (Triggers on Desktop / Unsupported Browsers) */}
      {selectedSlideForShare && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Share Presentation</h3>
              <button 
                onClick={() => setSelectedSlideForShare(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500 line-clamp-1">
              {selectedSlideForShare.title}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedSlideForShare.viewUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl text-xs font-semibold transition"
              >
                🌐 Facebook
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out these sermon slides: ${selectedSlideForShare.title} - ${selectedSlideForShare.viewUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl text-xs font-semibold transition"
              >
                💬 WhatsApp
              </a>

              <a
                href={`viber://forward?text=${encodeURIComponent(`Check out these sermon slides: ${selectedSlideForShare.title} - ${selectedSlideForShare.viewUrl}`)}`}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl text-xs font-semibold transition"
              >
                📱 Viber
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(`Sermon Slides: ${selectedSlideForShare.title}`)}&body=${encodeURIComponent(`Check out these sermon slides: ${selectedSlideForShare.viewUrl}`)}`}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-xl text-xs font-semibold transition"
              >
                ✉️ Email
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={() => copyToClipboard(selectedSlideForShare.viewUrl)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? '✅ Link Copied Successfully!' : '🔗 Copy Link to Clipboard'}
              </button>
            </div>

            <button
              onClick={() => setSelectedSlideForShare(null)}
              className="w-full mt-2 py-2 text-gray-500 hover:text-gray-700 text-xs font-semibold transition"
            >
              Cancel
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
