'use client';

import React, { useState, useEffect } from 'react';
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
  
  // Auth Modal States matching your app style
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLeaderOrPastor, setIsLeaderOrPastor] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  const [selectedSlideForShare, setSelectedSlideForShare] = useState<PowerPointSlide | null>(null);
  const [copied, setCopied] = useState(false);

  // Automatically open the specific slide viewer if someone opens a shared website link with ?slide=ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slideParam = params.get('slide');
    if (slideParam) {
      setActiveViewerId(slideParam);
      setTimeout(() => {
        const element = document.getElementById(`slide-card-${slideParam}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  const getWebsiteShareUrl = (slideId: string) => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?slide=${slideId}`;
  };

  const handleShareClick = async (slide: PowerPointSlide) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setAuthMode('login');
      setAuthError(null);
      setAuthSuccessMessage(null);
      setShowLoginModal(true);
      return;
    }

    const websiteShareUrl = getWebsiteShareUrl(slide.id);
    const isMobileOrTablet = window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobileOrTablet && navigator.share) {
      try {
        await navigator.share({
          title: slide.title,
          text: `Check out these sermon slides on our website: ${slide.title}`,
          url: websiteShareUrl,
        });
        return;
      } catch (error: any) {
        if (error.name === 'AbortError') return;
      }
    }

    setSelectedSlideForShare(slide);
  };

  const handleDownload = async (downloadUrl: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setAuthMode('login');
      setAuthError(null);
      setAuthSuccessMessage(null);
      setShowLoginModal(true);
      return;
    }
    window.location.href = downloadUrl;
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMessage(null);
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setShowLoginModal(false);
        setEmail('');
        setPassword('');
      } else if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { is_leader: isLeaderOrPastor }
          }
        });
        if (error) throw error;
        setAuthSuccessMessage('Registration successful! Please check your email or log in.');
        setAuthMode('login');
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during authentication.');
    } finally {
      setAuthLoading(false);
    }
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
                id={`slide-card-${slide.id}`}
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

      {/* Share Modal */}
      {selectedSlideForShare && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border border-gray-800 text-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl transition-transform duration-300">
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <h3 className="text-base font-bold text-white tracking-wide">Sharing website link</h3>
              <button 
                onClick={() => setSelectedSlideForShare(null)}
                className="text-gray-400 hover:text-white text-sm font-bold p-1 cursor-pointer bg-gray-800/60 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#27272a] border border-gray-700/60 rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">{selectedSlideForShare.title}</h4>
                <p className="text-[11px] text-gray-400 truncate">{getWebsiteShareUrl(selectedSlideForShare.id)}</p>
              </div>
              <button
                onClick={() => copyToClipboard(getWebsiteShareUrl(selectedSlideForShare.id))}
                className="p-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition shrink-0 flex items-center justify-center cursor-pointer border border-gray-600"
                title="Copy Link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 py-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getWebsiteShareUrl(selectedSlideForShare.id))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 shrink-0 w-16 group cursor-pointer"
              >
                <div className="w-14 h-14 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <span className="text-[11px] text-gray-300 text-center leading-tight">Facebook</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(`Sermon Slides: ${selectedSlideForShare.title}`)}&body=${encodeURIComponent(`Check out these sermon slides on our church website: ${getWebsiteShareUrl(selectedSlideForShare.id)}`)}`}
                className="flex flex-col items-center gap-1.5 shrink-0 w-16 group cursor-pointer"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition">
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 13.5l10-6.5V18c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7l10 6.5z"/>
                    <path fill="#FBBC05" d="M12 13.5L2 7V5l10 6.5L22 5v2l-10 6.5z"/>
                    <path fill="#4285F4" d="M2 7v11c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2V9.5L2 7z"/>
                    <path fill="#34A853" d="M22 7v11c0 1.1-.9 2-2 2h-1c-1.1 0-2-.9-2-2V9.5L22 7z"/>
                    <path fill="#C5221F" d="M12 13.5L2 7l10-6.5L22 7l-10 6.5z"/>
                  </svg>
                </div>
                <span className="text-[11px] text-gray-300 text-center leading-tight">Gmail</span>
              </a>
            </div>

            {copied && (
              <div className="text-center text-xs text-emerald-400 font-semibold bg-emerald-950/60 py-2.5 rounded-xl border border-emerald-800/50">
                ✅ Website link copied successfully!
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

      {/* Exact Dark-Themed Portal Sign In & Create Account Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-[#161922] border border-gray-800 text-white p-6 sm:p-8 rounded-2xl max-w-md w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-sm font-bold w-8 h-8 rounded-full bg-gray-800/80 flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="text-center pb-1">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {authMode === 'login' ? 'Church Portal Sign In' : 'Create an Account'}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {authMode === 'login' 
                    ? 'Sign in to download and share sermon slides' 
                    : 'Sign up to download and share sermon slides'}
                </p>
              </div>

              {authSuccessMessage && (
                <div className="p-3 text-xs text-emerald-400 bg-emerald-950/60 rounded-xl border border-emerald-800/50 font-medium text-center">
                  {authSuccessMessage}
                </div>
              )}

              {authError && (
                <div className="p-3 text-xs text-red-400 bg-red-950/60 rounded-xl border border-red-800/50 font-medium text-center">
                  {authError}
                </div>
              )}

              {authMode === 'signup' && (
                <div className="bg-[#1e2330] border border-gray-800 rounded-xl p-3.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-200">Are you a Leader or Pastor?</span>
                  <button
                    type="button"
                    onClick={() => setIsLeaderOrPastor(!isLeaderOrPastor)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isLeaderOrPastor 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {isLeaderOrPastor ? 'YES' : 'NO'}
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#1e2330] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#1e2330] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 shadow-lg shadow-blue-600/25"
              >
                {authLoading ? 'Processing...' : (authMode === 'login' ? 'Log In' : 'Sign Up')}
              </button>

              <div className="text-center pt-2">
                {authMode === 'login' ? (
                  <p className="text-xs text-gray-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setAuthError(null); setAuthSuccessMessage(null); }}
                      className="text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Create one here
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccessMessage(null); }}
                      className="text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Log In
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
