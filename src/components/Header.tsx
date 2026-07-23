'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { supabase }  from '@/lib/supabase';
import AuthModal from './AuthModal';    

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Events', href: '/events' },
  { label: 'About Us', href: '/aboutus' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Give', href: '/give' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      setUserSession(session);
    });

    const { data: { subscription } } = supabase?.auth?.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogoutAction = async () => {
    await supabase?.auth?.signOut();
    setMenuOpen(false);
    window.location?.reload();
  };

  const getAvatarInitial = () => {
    const name = userSession?.user?.user_metadata?.username || userSession?.user?.user_metadata?.name || userSession?.user?.email || 'U';
    return name?.charAt(0)?.toUpperCase();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ${
          scrolled ? 'top-3' : 'top-6'
        }`}
        aria-label="Main navigation"
      >
        <div
          className={`flex w-full max-w-4xl items-center justify-between border border-border p-2 pl-4 shadow-xl transition-all duration-500 ${
            scrolled ? 'nav-glass' : 'bg-white/20 backdrop-blur-md'
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 min-w-0"
            aria-label="Church of God of Prophecy Home"
          >
            <AppLogo size={32} />
            <span
              className={`font-display text-base sm:text-lg font-semibold tracking-tight transition-colors duration-500 ${scrolled ? 'text-gray-900' : 'text-white'}`}
            >
              Church of God of Prophecy
              <span className="block text-sm font-medium tracking-widest">Marikina</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href}
                className={`px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-500 ${
                  scrolled ? 'text-gray-900 hover:text-gray-600' : 'text-white hover:text-white/70'
                }`}
              >
                {link?.label}
              </Link>
            ))}
          </div>

          {/* Right Interface Controls (Authentication / Profile Section) */}
          <div className="flex items-center gap-3 relative">
            {userSession ? (
              // ✅ SIGNED IN ACTION GRID: Interactive Profile Menu
              (<div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-9 h-9 bg-primary text-primary-foreground font-bold rounded-full flex items-center justify-center text-sm border-2 border-primary/20 hover:scale-105 transition-transform shadow-md focus:outline-none"
                  aria-label="Toggle profile menu"
                >
                  {getAvatarInitial()}
                </button>
                {/* Interactive Profile Dropdown Card Layer */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 text-white z-50 animate-fadeIn space-y-3">
                    <div className="border-b border-slate-800 pb-2">
                      <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Account User</p>
                      <p className="text-sm font-bold truncate text-slate-100">
                        {userSession?.user?.user_metadata?.username || userSession?.user?.user_metadata?.name || 'Church Member'}
                      </p>
                      <p className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/20 w-fit px-1.5 py-0.5 rounded font-bold uppercase tracking-wider mt-1">
                        {userSession?.user?.user_metadata?.role || 'New'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                      <Link 
                        href="/dashboard" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full text-left p-2 rounded hover:bg-slate-800 transition-colors block text-slate-200"
                      >
                        🎛️ Church Dashboard
                      </Link>
                      <button 
                        onClick={handleLogoutAction}
                        className="w-full text-left p-2 rounded hover:bg-red-950/40 hover:text-red-400 transition-colors text-red-400 font-semibold mt-1"
                      >
                        🚪 Sign Out Account
                      </button>
                    </div>
                  </div>
                )}
              </div>)
            ) : (
              // ❌ SIGNED OUT ACTION GRID: Prompt login panel overlay modal trigger
              (<button
                onClick={() => setIsAuthOpen(true)}
                className="bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-all rounded shadow-md"
                suppressHydrationWarning
              >LogIn
                              </button>)
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              suppressHydrationWarning
            >
              <span
                className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center gap-8 transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        {navLinks?.map((link) => (
          <Link
            key={link?.href}
            href={link?.href}
            onClick={() => setMenuOpen(false)}
            className="font-display text-4xl font-bold not-italic text-white hover:text-primary transition-colors"
          >
            {link?.label}
          </Link>
        ))}
        
        {/* Dynamic Dashboard routing link injected inside Mobile Overlay view */}
        {userSession && (
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="font-display text-4xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Dashboard
          </Link>
        )}

        {/* Mobile Authentication buttons */}
        {userSession ? (
          <button
            onClick={handleLogoutAction}
            className="mt-4 bg-red-600 text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase w-64 text-center"
            suppressHydrationWarning
          >
            Log Out
          </button>
        ) : (
          <button
            onClick={() => { setMenuOpen(false); setIsAuthOpen(true); }}
            className="mt-4 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase w-64 text-center"
            suppressHydrationWarning
          >
            Log In / Sign Up
          </button>
        )}
      </div>
      {/* Connect the underlying authorization popup view components */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
