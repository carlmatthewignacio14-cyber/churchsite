'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ChurchRole } from '../contexts/auth-types';
import { registerChurchLeader } from '../app/dashboard/signupAction';
import { loginWithPasscodeOnly } from '../app/dashboard/passcodeAction';

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

  // Modal Control States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalView, setModalView] = useState<'login' | 'signup'>('login');
  const [pendingAction, setPendingAction] = useState<{ type: 'download' | 'share'; slide: PowerPointSlide } | null>(null);
  const [selectedSlideForShare, setSelectedSlideForShare] = useState<PowerPointSlide | null>(null);
  const [copied, setCopied] = useState(false);

  // Sign Up Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState<ChurchRole>('New');
  const [ministry, setMinistry] = useState('');
  const [tierCode, setTierCode] = useState('');
  const [personalPasscode, setPersonalPasscode] = useState('');
  const [signupErrorMsg, setSignupErrorMsg] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [passcodeOnly, setPasscodeOnly] = useState('');
  const [isLeaderOrPastorLogin, setIsLeaderOrPastorLogin] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

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

  const executePostAuthAction = (action: { type: 'download' | 'share'; slide: PowerPointSlide }) => {
    if (action.type === 'download') {
      window.location.href = action.slide.downloadUrl;
    } else if (action.type === 'share') {
      const websiteShareUrl = getWebsiteShareUrl(action.slide.id);
      const isMobileOrTablet = window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobileOrTablet && navigator.share) {
        navigator.share({
          title: action.slide.title,
          text: `Check out these sermon slides on our website: ${action.slide.title}`,
          url: websiteShareUrl,
        }).catch(() => {});
        return;
      }
      setSelectedSlideForShare(action.slide);
    }
  };

  const handleShareClick = async (slide: PowerPointSlide) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setPendingAction({ type: 'share', slide });
      setModalView('login');
      setShowAuthModal(true);
      return;
    }
    executePostAuthAction({ type: 'share', slide });
  };

  const handleDownloadClick = async (slide: PowerPointSlide) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setPendingAction({ type: 'download', slide });
      setModalView('login');
      setShowAuthModal(true);
      return;
    }
    window.location.href = slide.downloadUrl;
  };

  // Sign Up Submission Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrorMsg('');
    setSignupSuccess(false);
    setSignupLoading(true);

    const isLeaderOrPastor = role === 'Leaders' || role === 'Pastors';

    try {
      if (role !== 'New') {
        const { data: verification, error: rpcError } = await supabase.rpc('signup_church_member', {
          p_first_name: firstName,
          p_last_name: lastName,
          p_code: tierCode,
        });

        if (rpcError) throw rpcError;

        if (!verification.success) {
          setSignupErrorMsg(verification.message);
          setSignupLoading(false);
          return;
        }
      }

      if (isLeaderOrPastor) {
        if (personalPasscode.length < 4) {
          setSignupErrorMsg('Your private passcode must be at least 4 digits long.');
          setSignupLoading(false);
          return;
        }

        const result = await registerChurchLeader(
          signupEmail,
          signupPassword,
          role,
          tierCode,
          username,
          ministry,
          firstName,
          lastName
        );
        
        if (!result.success) {
          setSignupErrorMsg(result.message);
          setSignupSuccess(false);
        } else {
          setSignupSuccess(true);
          if (pendingAction) {
            setShowAuthModal(false);
            executePostAuthAction(pendingAction);
            setPendingAction(null);
          }
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: signupEmail,
          password: signupPassword,
          options: { data: { role, username, firstName, lastName } }
        });
        if (error) throw error;
        setSignupSuccess(true);
        if (pendingAction) {
          setShowAuthModal(false);
          executePostAuthAction(pendingAction);
          setPendingAction(null);
        }
      }
    } catch (err: any) {
      setSignupErrorMsg(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setSignupLoading(false);
    }
  };

  // Login Submission Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrorMsg('');
    setLoginLoading(true);

    if (isLeaderOrPastorLogin) {
      const result = await loginWithPasscodeOnly(passcodeOnly);
      if (!result.success) {
        setLoginErrorMsg(result.message);
        setLoginLoading(false);
      } else {
        setShowAuthModal(false);
        setLoginLoading(false);
        if (pendingAction) {
          executePostAuthAction(pendingAction);
          setPendingAction(null);
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      if (error) {
        setLoginErrorMsg(error.message);
        setLoginLoading(false);
      } else {
        setShowAuthModal(false);
        setLoginLoading(false);
        if (pendingAction) {
          executePostAuthAction(pendingAction);
          setPendingAction(null);
        }
      }
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      prompt('Copy this link manually:', url);
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
                        onClick={() => handleDownloadClick(slide)}
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

      {/* Auth Modal Housing Exact Login & Signup Forms */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4 backdrop-blur-sm overflow-y-auto py-6">
          <div className="bg-slate-950 border border-slate-800 text-white p-6 sm:p-8 rounded-2xl max-w-md w-full relative shadow-2xl my-auto">
            <button
              onClick={() => { setShowAuthModal(false); setPendingAction(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm font-bold w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center transition cursor-pointer z-10"
            >
              ✕
            </button>

            {/* Switch Tab Header */}
            <div className="flex border-b border-slate-800 mb-5 pb-3">
              <button
                type="button"
                onClick={() => setModalView('login')}
                className={`flex-1 text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition ${
                  modalView === 'login' ? 'border-blue-600 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setModalView('signup')}
                className={`flex-1 text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition ${
                  modalView === 'signup' ? 'border-blue-600 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* CONDITIONAL RENDER: LOGIN FORM */}
            {modalView === 'login' ? (
              <div className="w-full text-white bg-slate-950">
                <h3 className="text-lg font-bold mb-4 text-center">Church Portal Sign In</h3>
                
                {loginErrorMsg && <p className="bg-red-500/20 text-red-400 p-2 text-xs rounded mb-4 text-center border border-red-500/30">{loginErrorMsg}</p>}

                <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 mb-4">
                  <span className="text-xs font-semibold text-slate-300">Are you a Leader or Pastor?</span>
                  <button
                    type="button"
                    onClick={() => { setIsLeaderOrPastorLogin(!isLeaderOrPastorLogin); setLoginErrorMsg(''); }}
                    className={`text-xs font-bold px-3 py-1 rounded transition-all uppercase tracking-wider cursor-pointer ${
                      isLeaderOrPastorLogin ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isLeaderOrPastorLogin ? 'Yes (Passcode Only)' : 'No'}
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {!isLeaderOrPastorLogin ? (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
                        <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
                        <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
                      </div>
                    </>
                  ) : (
                    <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg space-y-2">
                      <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Enter Your Personal Passcode</label>
                      <p className="text-[11px] text-slate-400 leading-normal">No email or password required. Type your private code to enter:</p>
                      <input 
                        type="password" 
                        placeholder="••••••"
                        required 
                        value={passcodeOnly} 
                        onChange={e => setPasscodeOnly(e.target.value)} 
                        className="w-full bg-slate-900 border border-amber-500/30 p-3 rounded text-white text-center font-mono text-lg tracking-widest focus:border-amber-500 outline-none mt-1" 
                      />
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loginLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold p-2.5 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md mt-2 cursor-pointer"
                  >
                    {loginLoading ? 'Authorizing...' : 'Log In'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-xs text-slate-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setModalView('signup')}
                      className="text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Create one here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* CONDITIONAL RENDER: SIGNUP FORM */
              <div className="w-full text-white bg-slate-950 max-h-[75vh] overflow-y-auto pr-1">
                <h3 className="text-lg font-bold mb-4 text-center">Create Church Account</h3>
                
                {signupErrorMsg && <p className="bg-red-500/20 text-red-400 p-2.5 text-xs rounded mb-4 text-center border border-red-500/30">{signupErrorMsg}</p>}
                {signupSuccess && <p className="bg-green-500/20 text-green-400 p-2.5 text-xs rounded mb-4 text-center border border-green-500/30">🎉 Success! Account successfully registered.</p>}

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">First Name</label>
                      <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Last Name</label>
                      <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Username</label>
                    <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter unique username" className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
                    <input type="email" required value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
                    <input type="password" required value={signupPassword} onChange={e => setSignupPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Your Position Status</label>
                    <select 
                      value={role} 
                      onChange={e => { setRole(e.target.value as ChurchRole); setTierCode(''); setPersonalPasscode(''); setSignupErrorMsg(''); }}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="New">New (Visitor / Guest)</option>
                      <option value="Members">Members</option>
                      <option value="Leaders">Leaders</option>
                      <option value="Pastors">Pastors</option>
                    </select>
                  </div>

                  {role === 'Leaders' && (
                    <div className="animate-fadeIn">
                      <label className="text-xs font-semibold text-amber-400 block mb-1">Ministry Assignment</label>
                      <select value={ministry} onChange={e => setMinistry(e.target.value)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-sm focus:border-amber-500 outline-none cursor-pointer">
                        <option value="">-- Select Your Ministry Team --</option>
                        <option value="Pastoral Team">Pastoral Team</option>
                        <option value="Men's Ministry">Men's Ministry</option>
                        <option value="Women's Ministry">Women's Ministry</option>
                        <option value="Youth Ministry">Youth Ministry</option>
                        <option value="Kids Ministry">Kids Ministry</option>
                        <option value="Multimedia Ministry">Multimedia Ministry</option>
                      </select>
                    </div>
                  )}
                  
                  {role !== 'New' && (
                    <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-amber-400 block mb-1">Church Membership / Tier Code</label>
                        <input 
                          type="text" 
                          placeholder="e.g. MEMBER2026, LEAD2026"
                          required 
                          value={tierCode} 
                          onChange={e => setTierCode(e.target.value)} 
                          className="w-full bg-slate-900 border border-amber-500/20 p-2.5 rounded text-white text-sm focus:border-amber-400 outline-none uppercase font-mono" 
                        />
                      </div>

                      {(role === 'Leaders' || role === 'Pastors') && (
                        <div className="border-t border-slate-800 pt-3 animate-fadeIn">
                          <label className="text-xs font-semibold text-green-400 block mb-1">Set Up Your Private Passcode</label>
                          <input 
                            type="password" 
                            placeholder="Create your personal login passcode"
                            required 
                            value={personalPasscode} 
                            onChange={e => setPersonalPasscode(e.target.value)} 
                            className="w-full bg-slate-900 border border-green-500/20 p-2.5 rounded text-white text-sm focus:border-green-400 outline-none font-mono tracking-widest text-center" 
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={signupLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold p-2.5 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md mt-2 cursor-pointer"
                  >
                    {signupLoading ? 'Verifying Roster...' : 'Create Account'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setModalView('login')}
                      className="text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal Link Screen */}
      {selectedSlideForShare && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border border-gray-800 text-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
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
    </section>
  );
}
