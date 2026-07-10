'use client';

import React, { useRef, useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Ministry {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  images?: {src: string;alt: string;}[];
  colSpan?: string;
  rowSpan?: string;
  tag: string;
}

const ministries: Ministry[] = [
{
  id: 'youth',
  name: 'Youth Ministry',
  tagline: 'Ages 13–35',
  description: 'A vibrant space where teenagers discover identity, purpose, and community. Weekly gatherings, summer camps, and mission trips.',
  image: "/assets/images/710299155_970621969219794_887923649744832117_n-1783629134755.jpg",
  imageAlt: 'Youth ministry group photo',
  images: [
  { src: "/assets/images/710299155_970621969219794_887923649744832117_n-1783629134755.jpg", alt: "Youth ministry group gathering" },
  { src: "/assets/images/710365609_970621589219832_6865443707344666283_n-1783629134773.jpg", alt: "Youth ministry activity" },
  { src: "/assets/images/710474385_970622275886430_8079094559996432976_n-1783629134759.jpg", alt: "Youth ministry event" },
  { src: "/assets/images/712504551_970622119219779_7872778213465183755_n-1783629134775.jpg", alt: "Youth ministry community" }],

  colSpan: 'md:col-span-2',
  rowSpan: 'md:row-span-2',
  tag: 'Youth'
},
{
  id: 'women',
  name: "Women's Ministry",
  tagline: 'Community & Growth',
  description: 'Monthly gatherings, Bible studies, and retreats for women of all ages.',
  image: "/assets/images/695475790_952572347691423_8949784877680740857_n.jpg",
  imageAlt: 'Women ministry photo description',
  tag: "Women's"
},
{
  id: 'men',
  name: "Men's Ministry",
  tagline: 'Brotherhood',
  description: 'Equipping men to lead with integrity in home, work, and community.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13e2643c1-1768434369566.png",
  imageAlt: 'Group of men in casual clothing gathered around a table in discussion, warm indoor lighting, community hall setting',
  tag: "Men's"
},
{
  id: 'worship',
  name: 'Worship Team',
  tagline: 'Lead in Song',
  description: 'Join our music ministry — vocalists, instrumentalists, and production crew welcome.',
  image: "https://images.unsplash.com/photo-1651975414435-26c83ce1bff3",
  imageAlt: 'Worship band performing on a church stage, colored stage lighting, musicians playing guitars and keyboards, dimly lit sanctuary',
  tag: 'Worship'
},
{
  id: 'outreach',
  name: 'Community Outreach',
  tagline: 'Serve Nashville',
  description: 'Food drives, homeless outreach, neighborhood cleanups, and partnerships with local nonprofits. Faith in action every week.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1319ef9c3-1772984335613.png",
  imageAlt: 'Volunteers in matching shirts sorting food donations at a bright community center, organized rows of boxes, cheerful daytime atmosphere',
  colSpan: 'md:col-span-2',
  tag: 'Outreach'
}];


function useScrollReveal(ref: React.RefObject<HTMLElement | null>, delay = 0) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setRevealed(true), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, delay]);

  return revealed;
}

function YouthPhotoGrid({ images }: {images: {src: string;alt: string;}[];}) {
  return (
    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5">
      {images.map((img, i) =>
      <div key={i} className="relative overflow-hidden img-zoom-wrap">
          <AppImage
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw" />
        
        </div>
      )}
    </div>);

}

export default function MinistriesSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headingRevealed = useScrollReveal(headingRef, 0);
  const gridRevealed = useScrollReveal(gridRef, 150);

  const revealClass = (revealed: boolean) =>
  revealed ?
  'opacity-100 translate-y-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]' :
  'opacity-0 translate-y-6';

  return (
    <section id="ministries" className="section-pad bg-background border-t border-border relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div ref={headingRef} className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 ${revealClass(headingRevealed)}`}>
          <div>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-accent block mb-3">
              Get Involved
            </span>
            <h2 className="font-display text-section-title font-light italic text-foreground">
              Ministries<br />
              <span className="not-italic font-bold">&amp; Events</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed font-light">
            There&apos;s a place for everyone here. Find the ministry that fits your season of life and step in.
          </p>
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px] ${revealClass(gridRevealed)}`}>
          {ministries.map((m) =>
          <div
            key={m.id}
            className={`relative overflow-hidden group bento-card cursor-pointer ${m.colSpan ?? ''} ${m.rowSpan ?? ''}`}>
            
              {/* Image */}
              {m.images ?
            <YouthPhotoGrid images={m.images} /> :

            <div className="img-zoom-wrap absolute inset-0">
                  <AppImage
                src={m.image}
                alt={m.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
            }

              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[12px] font-bold uppercase tracking-widest text-white border border-white/40 bg-black/20 backdrop-blur-sm px-3 py-2">
                  {m.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col items-start overflow-hidden">
                
                {/* Moving Container */}
                <div className="flex flex-col items-start gap-2 transform translate-y-[3.5rem] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">

                {/* Tagline */}
                <span className="inline-block bg-black/65 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-white/90 uppercase tracking-widest font-medium">
                  {m.tagline}
                </span>

                {/* Name Headline */}
                <h3 className="font-display text-xl font-semibold text-white leading-none">
                  <span className="inline-block bg-black/65 backdrop-blur-md px-2.5 py-1 rounded">
                    {m.name}
                  </span>
                </h3>

                {/* Description Text */}
                <p className="text-sm text-white leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="inline-block bg-black/65 backdrop-blur-md px-2.5 py-1 rounded">
                    {m.description}
                  </span>
                </p>

                {/* Learn More Action Button */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                    <span className="inline-block bg-black/65 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-widest text-accent">
                      Learn More
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>

                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}