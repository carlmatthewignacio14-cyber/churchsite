'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PowerPointSlide {
  id: string;
  title: string;
  speaker: string;
  date: string;
  embedUrl: string; 
  downloadUrl: string;
  imageUrl: string;
}

const sermonSlides: PowerPointSlide[] = [
  {
    id: '1',
    title: 'A Faith That Comes Out Stronger | Mark 4:41',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus/export?format=png',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus', 
    imageUrl: 'https://docs.google.com/presentation/d/1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus/export?format=png',
  },
  {
    id: '2',
    title: 'Bridging The Faith | 1 Timothy 5:1-8',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y/export?format=png',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y', 
    imageUrl: 'https://docs.google.com/presentation/d/1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y/export?format=png',
  },
  {
    id: '3',
    title: 'Christ Has Indeed Been Raised | 1 Corinthians 15:12-20',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d/export?format=png',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d', 
    imageUrl: 'https://docs.google.com/presentation/d/1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d/export?format=png',
  },
  {
    id: '4',
    title: 'Crossing For One Broken Life | Mark 5:1-20',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT/export?format=png',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT', 
    imageUrl: 'https://docs.google.com/presentation/d/18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT/export?format=png',
  }
];

export default function SermonSlidesSection() {
  const [showAll, setShowAll] = useState(false);
  const [activeViewerId, setActiveViewerId] = useState<string | null>(null);

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
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative w-full bg-gray-900 overflow-hidden" style={{ paddingTop: '56.25%' }}>
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
                    <p className="text-xs text-gray-500 mb-4">
                      {slide.speaker}
                    </p>
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

                    <a
                      href={slide.downloadUrl}
                      className="w-full sm:w-auto text-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex-1"
                    >
                      Download
                    </a>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      )}

      </div>
    </section>
  );
}
