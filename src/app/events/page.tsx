'use client';

import React, { useState, Suspense } from 'react';
import AppImage from '@/components/ui/AppImage';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';

const upcomingEvents = [
  {
    id: 'youth-retreat',
    title: 'Youth Retreat',
    date: 'August 1, 2026',
    location: 'To Be Announced',
    description:
      'Trade the noise for one day of rest, worship, and real connection. Come fill your cup, share stories by the fire, and leave spiritually renewed.',
  },
  {
    id: 'youth-fellowship',
    title: 'Joint Fellowship with San Mateo Youth',
    date: 'August 2, 2026',
    time: '1:00 PM',
    location: 'San Mateo Church',
    description:
      'Join us for a simple Joint Youth Fellowship as two local youth ministries come together to connect, share a time of worship, and build encouraging friendships.',
  },
  {
    id: 'youth-revival',
    title: 'Youth Revival 2026',
    date: 'November 2026',
    location: 'National Property, COGOP Taytay',
    description:
      'A life-changing encounter for teenagers and young adults. Join us for powerful worship sessions, games, and fellowship with our international youths.',
  },
  {
    id: 'general-seminar',
    title: 'Leadership Training/Seminar',
    date: 'March 24-26, 2026',
    location: 'National Property, COGOP Taytay',
  },
  {
    id: 'general-convention',
    title: 'National Convention',
    date: 'March 26-28, 2026',
    location: 'National Property, COGOP Taytay',
  },
];

const recentActivities = [
  {
    id: 'kids-vbs',
    title: 'VBS 2026',
    date: 'June 7, 2026',
    location: 'COGOP Marikina',
    description:
      'Fostering fundamental faith through simple lessons, creative coloring tasks, and memory verse rewards for local community children.',
    images: [
      '/assets/images/Kids/720318355_975915628579816_5709777563636170972_n.jpg',
      '/assets/images/Kids/719899913_980170131598311_8797661167248034957_n.jpg',
      '/assets/images/Kids/718390437_980169761598348_163547424691377825_n.jpg',
      '/assets/images/Kids/719770734_980165031598821_4483992461419628859_n.jpg',
      '/assets/images/Kids/721701268_27500390399578723_4956249103010568414_n.jpg',
    ],
    imageAlt: 'Kids Assembly slideshow image',
  },
  {
    id: 'district',
    title: 'District 1B Convention',
    date: 'May 23-24, 2026',
    location: 'National Property, COGOP Taytay',
    description:
      'Standing together to unite our communities, amplify our voices, and build a stronger future.',
    images: [
      '/assets/images/District/707399020_1438841498285651_2690131130065843927_n.jpg',
      '/assets/images/District/707153926_1438840578285743_2340465144644025303_n.jpg',
      '/assets/images/District/706237648_1439256391577495_2635213993647306165_n.jpg',
      '/assets/images/District/706144051_1439256464910821_4066407894083042304_n.jpg',
      '/assets/images/District/705682173_1438834988286302_1448315427997597443_n.jpg',
    ],
    imageAlt: 'District Convention slider image',
  },
  {
    id: 'kids-icm',
    title: 'ICM 2026',
    date: 'May 8-10, 2026',
    location: 'National Property, COGOP Taytay',
    description:
      'Equipping leaders and empowering mentors to guide and disciple the next generation for Christ.',
    images: [
      '/assets/images/ICM/702837650_994879842924704_4624111208604447117_n.jpg',
      '/assets/images/ICM/696490462_1735133064513182_9165793759496624526_n.jpg',
      '/assets/images/ICM/695830091_1735132804513208_8178430958502023484_n.jpg',
      '/assets/images/ICM/692875374_1735132867846535_8250332318882543902_n.jpg',
      '/assets/images/ICM/692799217_27935949549328216_412991976978629492_n.jpg',
    ],
    imageAlt: 'Kids ministry slider image',
  },
  {
    id: 'worship',
    title: 'Worship & Production Crew',
    location: 'COGOP Marikina',
    description:
      'Transforming technical skills into heartfelt worship. Come build the experience with us—join the crew!',
    images: [
      '/assets/images/worship/728035849_27592855097068731_9171939702394330824_n.jpg',
      '/assets/images/worship/728070515_988521164096541_1559072974552421233_n.jpg',
      '/assets/images/worship/728196323_988522064096451_6280042641712443363_n.jpg',
      '/assets/images/worship/706237687_1439256481577486_6020361548475459115_n.jpg',
      '/assets/images/worship/661597471_924343340514324_54014689084400758_n.jpg',
    ],
    imageAlt: 'Kids ministry slider image',
  },
  {
    id: 'youth',
    title: 'RealTalk BootCamp 2025',
    date: 'December 26-29, 2025',
    location: 'Retreat Center, La Union',
    description:
      'The noise is gone, but the impact remains. Relive how we tackled tough questions and built real community at Realtalk.',
    images: [
      '/assets/images/Youth/650663438_25461684893511008_887792123868214736_n.jpg',
      '/assets/images/Youth/630209505_25170513669294800_250365154094137266_n.jpg',
      '/assets/images/Youth/630416864_25170501909295976_5276147114380833387_n.jpg',
      '/assets/images/Youth/631337521_25170499735962860_2678476387913881313_n.jpg',
      '/assets/images/Youth/630239995_25170497982629702_1640525716948296639_n.jpg',
    ],
    imageAlt: 'youth camp slider image',
  },
];

/* Desktop & Tablet Film Strip Setup */
function DesktopFilmStrip({ images, altText }: { images: string[]; altText: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="w-full md:w-[460px] shrink-0 flex flex-col gap-3 select-none">
      <div className="relative w-full overflow-hidden rounded-xl bg-stone-950/90 border border-stone-800/80 p-3 shadow-2xl">
        {/* Side-by-side film strip track */}
        <div 
          className="flex transition-transform duration-500 ease-out gap-3"
          style={{ transform: `translateX(-${currentIndex * 50}%)` }}
        >
          {images.map((src, i) => (
            <div 
              key={i} 
              className="relative shrink-0 w-[calc(50%-6px)] h-56 rounded-lg overflow-hidden bg-stone-900 border border-stone-800/50 shadow-md group cursor-pointer"
              onClick={() => setCurrentIndex(i)}
            >
              <AppImage
                src={src}
                alt={`${altText} - Photo ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                sizes="230px"
              />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-stone-300">
                {i + 1} / {images.length}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-stone-800/60">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 text-xs rounded transition-all cursor-pointer"
          >
            Previous
          </button>
          <div className="text-xs text-stone-400 font-medium">
            Photo {currentIndex + 1} of {images.length}
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(images.length - 2, prev + 1))}
            disabled={currentIndex >= images.length - 2}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-200 text-xs rounded transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

/* Original Mobile View Setup */
function MobileSlider({ images, altText }: { images: string[]; altText: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).dataset.startX = String(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const startX = Number((e.currentTarget as HTMLElement).dataset.startX);
    if (isNaN(startX)) return;
    const distance = startX - e.clientX;
    if (distance > 40) {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (distance < -40) {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  return (
    <div 
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="w-full flex flex-col items-center select-none mt-4 block md:hidden"
    >
      <div className="relative w-full h-72 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 shadow-md">
        <AppImage
          src={images[currentIndex]}
          alt={`${altText} - Photo ${currentIndex + 1}`}
          fill
          className="object-cover pointer-events-none"
          sizes="100vw"
        />
      </div>
      <div className="flex space-x-1.5 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${currentIndex === i ? 'bg-amber-400 w-4' : 'bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function EventsContent() {
  const searchParams = useSearchParams();
  const ministryFilter = searchParams ? searchParams.get('ministry') : null;

  React.useEffect(() => {
    if (ministryFilter) {
      const element = document.getElementById(ministryFilter.toLowerCase());
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, [ministryFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header variant="light" />

      <main className="pt-28 pb-24">
        <section className="section-pad mb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12 text-center md:text-left">
              <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-2">
                Highlights
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                Recent Events
              </h1>
            </div>

            <div className="space-y-8">
              {recentActivities?.map((activity) => (
                <div
                  key={activity.id}
                  id={activity.id}
                  className="group relative overflow-hidden rounded-2xl border border-stone-700/30 bg-gradient-to-br from-stone-900/90 via-amber-950/85 to-stone-900/95 backdrop-blur-xl p-6 transition-all duration-300 hover:border-amber-600/40 shadow-xl flex flex-col md:flex-row gap-6 text-stone-100 items-center"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-amber-100 mb-1">
                        {activity.title}
                      </h2>
                      <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase mb-3">
                        {activity.date} {activity.location ? `| ${activity.location}` : ''}
                      </p>
                      <p className="text-sm text-stone-300 leading-relaxed font-light">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {activity.images && activity.images.length > 0 && (
                    <div className="w-full md:w-auto shrink-0 flex justify-center">
                      {/* Desktop & Tablet Film Strip View */}
                      <div className="hidden md:block">
                        <DesktopFilmStrip
                          images={activity.images}
                          altText={activity.imageAlt || activity.title}
                        />
                      </div>
                      {/* Mobile Phone View (Original Third Photo Setup) */}
                      <div className="block md:hidden w-full">
                        <MobileSlider
                          images={activity.images}
                          altText={activity.imageAlt || activity.title}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-12 text-center md:text-left">
              <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">
                Calendar
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                Upcoming Events
              </h1>
            </div>
            
            <div className="space-y-6">
              {upcomingEvents?.map((event) => (
                <div
                  key={event?.id}
                  id={event.id}
                  className="bg-card border border-border p-6 md:p-8 hover:border-primary/40 transition-all rounded shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                        {event?.title}
                      </h2>
                      <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                        {event?.date}
                        {(event as { time?: string })?.time
                          ? ` \u2022 ${(event as { time?: string }).time}`
                          : ''}
                      </p>
                    </div>
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded self-start md:self-auto">
                      {event?.location}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {event?.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function EventsAndActivities() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading events...</div>
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
