'use client';

import React from 'react';
import Link from 'next/link';            

const upcomingEvents = [
  {
    id: '1',
    title: 'Youth Fellowship with San Mateo Youth',
    date: 'August 2, 2026',
    time: '1:00 PM',
    location: 'San Mateo Church',
    description: 'An evening dedicated to equipping marriages, strengthening bonds, and sharing dinner together with our church family.'
  },
  {
    id: '2',
    title: 'Youth Revival 2026',
    date: 'To Be Announced',
    location: 'National Camp Site',
    description: 'A life-changing encounter for teenagers and young adults. Join us for powerful worship sessions, games, and fellowship with our international youths.'
  },
  {
     id: '3',
    title: 'Overnight Retreat',
    date: 'To Be Announced',
    location: 'To Be Announced',
    description: 'Trade the noise for one night of rest, worship, and real connection. Come fill your cup, share stories by the fire, and leave spiritually renewed.'
  }
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation Header Link */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Church Events</span>
        </div>
      </div>

      {/* Main Body */}
      <section className="section-pad">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center md:text-left">
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">Calendar</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Upcoming Events
            </h1>
            <p className="text-muted-foreground max-w-xl text-base leading-relaxed font-light">
              Stay connected and see what is happening next in our church community. We look forward to gathering with you!
            </p>
          </div>

          {/* Events List Stack */}
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-card border border-border p-6 md:p-8 hover:border-primary/40 transition-all rounded shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                      {event.title}
                    </h2>
                    <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                      {event.date} &bull; {event.time}
                    </p>
                  </div>
                  <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded self-start md:self-auto">
                    {event.location}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
