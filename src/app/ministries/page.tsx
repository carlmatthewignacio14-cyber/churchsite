'use client';

import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const ministriesData = [
  {
    id: 'youth',
    name: 'Youth Ministry',
    tagline: 'Ages 13–35',
    description: 'A vibrant space where teenagers and young adults discover identity, purpose, and community through weekly gatherings and camps.',
    image: '/assets/images/710299155_970621969219794_887923649744832117_n-1783629134755.jpg',
  },
  {
    id: 'women',
    name: "Women's Ministry",
    tagline: 'Community & Growth',
    description: 'Monthly gatherings, Bible studies, and retreats offering spiritual support and fellowship for women of all ages.',
    image: '/assets/images/695475790_952572347691423_8949784877680740857_n.jpg',
  },
  {
    id: 'men',
    name: "Men's Ministry",
    tagline: 'Brotherhood',
    description: 'Equipping men to lead with integrity in their homes, workplaces, and local communities.',
    image: '/assets/images/728094408_988529577429033_74278605388633550_n.jpg',
  },
  {
    id: 'worship',
    name: 'Worship Team',
    tagline: 'Lead in Song',
    description: 'Join our music ministry—vocalists, instrumentalists, and production technical crew are welcome.',
    image: '/assets/images/727928138_988525360762788_1191887275324024034_n.jpg',
  },
  {
    id: 'kids',
    name: "Kid's Ministry",
    tagline: 'Developing Leaders, Discipling Kids',
    description: 'A fun, safe, and engaging environment where children learn faith through interactive Bible stories, worship, and crafts.',
    image: '/assets/images/720318355_975915628579816_5709777563636170972_n.jpg',
  },
];

export default function MinistriesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">
            Get Involved
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Our Ministries</h1>
          <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
            There is a place for everyone here. Explore our ministries below to find your community, learn more, and view their scheduled events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministriesData.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group shadow-lg">
              <div className="relative h-60 w-full overflow-hidden">
                <AppImage
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white uppercase tracking-wider">
                  {m.tagline}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between gap-6">
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">{m.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{m.description}</p>
                </div>
                <Link
                  href={`/ministries/${m.id}#events`}
                  className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-md"
                >
                  Explore Ministry &amp; Events →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
