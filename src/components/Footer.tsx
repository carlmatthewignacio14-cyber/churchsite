import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Give', href: '/give' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

const socialLinks = [
  { label: 'Facebook', href: '#', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'Instagram', href: '#', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3h9A4.5 4.5 0 0 1 21 7.5z' },
  { label: 'YouTube', href: '#', icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-10 relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Single row layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Church of God of Prophecy Home">
            <AppLogo size={28} />
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              Church of God of Prophecy
              <span className="block text-sm font-medium tracking-widest">Marikina</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              {footerLinks?.map((link) => (
                <li key={link?.href + link?.label}>
                  <Link
                    href={link?.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social + Copyright */}
          <div className="flex items-center gap-4">
            {socialLinks?.map((s) => (
              <a
                key={s?.label}
                href={s?.href}
                aria-label={s?.label}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={s?.icon} />
                </svg>
              </a>
            ))}
            <span className="text-xs text-muted-foreground ml-2 hidden sm:block">
              © 2026 Church of God of Prophecy Marikina
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 sm:hidden">
          © 2026 Church of God of Prophecy Marikina. All rights reserved.
        </p>
      </div>
    </footer>
  );
}