'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="#service-times"
              className="bg-primary text-primary-foreground px-5 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
            >
              Plan a Visit
            </Link>
          </div>

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
        <Link
          href="#service-times"
          onClick={() => setMenuOpen(false)}
          className="mt-4 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase"
        >
          Plan a Visit
        </Link>
      </div>
    </>
  );
}
