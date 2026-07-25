'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Header from '@/components/Header'; // Adjust path if your Header component is located elsewhere

const ministriesList = [
  {
    id: 'youth',
    name: 'Youth Ministry',
    tagline: 'Ages 13–35',
    description: 'A vibrant space where teenagers and young adults discover identity, purpose, and community.',
    image: '/assets/images/710299155_970621969219794_887923649744832117_n-1783629134755.jpg',
  },
  {
    id: 'women',
    name: "Women's Ministry",
    tagline: 'Community & Growth',
    description: 'Monthly gatherings, Bible studies, and retreats for women of all ages.',
    image: '/assets/images/695475790_952572347691423_8949784877680740857_n.jpg',
  },
  {
    id: 'men',
    name: "Men's Ministry",
    tagline: 'Brotherhood',
    description: 'Equipping men to lead with integrity in home, work, and community.',
    image: '/assets/images/728094408_988529577429033_74278605388633550_n.jpg',
  },
  {
    id: 'worship',
    name: 'Worship Team',
    tagline: 'Lead in Song',
    description: 'Join our music ministry — vocalists, instrumentalists, and production crew welcome.',
    image: '/assets/images/727928138_988525360762788_1191887275324024034_n.jpg',
  },
  {
    id: 'kids',
    name: "Kid's Ministry",
    tagline: 'Developing Leaders, Discipling Kids',
    description: 'A fun, safe, and engaging environment where kids learn faith through interactive Bible stories.',
    image: '/assets/images/720318355_975915628579816_5709777563636170972_n.jpg',
  },
];

export default function MinistriesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Official Site Header */}
      <Header />

      {/* Main Content with padding-top to prevent overlap with the fixed header */}
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-accent block mb-3">
              Get Connected
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">Our Ministries</h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              There is a place for everyone here. Explore our ministries to find your community, grow in your faith, and serve together.
            </p>
          </div>

          {/* Ministries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministriesList.map((ministry) => (
              <div
                key={ministry.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:border-primary/50 transition-all group"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden">
                    <AppImage
                      src={ministry.image}
                      alt={ministry.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-primary/15 text-primary px-2.5 py-1 rounded-full w-fit">
                      {ministry.tagline}
                    </span>
                    <h2 className="font-display text-xl font-bold">{ministry.name}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {ministry.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/ministries/${ministry.id}`}
                    className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Explore Ministry &amp; Events →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
