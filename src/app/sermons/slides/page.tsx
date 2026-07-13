'use client';

import React from 'react';
import Link from 'next/link'
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PowerPointSlide {
  id: string;
  title: string;
  speaker: string;
  embedUrl: string;       
  downloadUrl: string;   
  imageUrl: string;      
}

const allSermonSlides: PowerPointSlide[] = [
  {
    id: '1',
    title: 'A Faith That Comes Out Stronger | Mark 4:41',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus/edit?usp=drive_link&ouid=105615319819982595182&rtpof=true&sd=true',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus', 
    imageUrl: 'https://docs.google.com/presentation/d/1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus/export?format=png',
  },
  {
    id: '2',
    title: 'Bridging The Faith | 1 Timothy 5:1-8',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y/edit?usp=drive_link&ouid=105615319819982595182&rtpof=true&sd=true',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y', 
    imageUrl: 'https://docs.google.com/presentation/d/1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y/export?format=png',
  },
  {
    id: '3',
    title: 'Christ Has Indeed Been Raised | 1 Corinthians 15:12-20',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d/edit?usp=drive_link&ouid=105615319819982595182&rtpof=true&sd=true',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d', 
    imageUrl: 'https://docs.google.com/presentation/d/1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d/export?format=png',
  },
  {
    id: '4',
    title: 'Crossing For One Broken Life | Mark 5:1-20',
    speaker: 'Pastor Albert Garao',
    embedUrl: 'https://docs.google.com/presentation/d/18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT/edit?usp=drive_link&ouid=105615319819982595182&rtpof=true&sd=true',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT', 
    imageUrl: 'https://docs.google.com/presentation/d/18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT/export?format=png',
  },
  // Add item 3, 4, 5, etc., infinitely down here...
];

export default function AllSlidesArchivePage() {
  const [activeViewerId, setActiveViewerId] = React.useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="mb-8">
          <Link
            href="/sermons"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:-translate-x-1"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Sermons
          </Link>
        </div>

        {/* Header section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            All Sermons Archive
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our complete collection of weekly presentation templates and study guides.
          </p>
        </div>

        {/* Complete Infinite Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSermonSlides.map((slide) => {
            const isViewing = activeViewerId === slide.id;
            return (
              <div key={slide.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="relative w-full bg-gray-900 overflow-hidden" style={{ paddingTop: '56.25%' }}>
                    {isViewing ? (
                      <iframe src={slide.embedUrl} className="absolute inset-0 w-full h-full" style={{ border: 'none' }} allowFullScreen title={slide.title} />
                    ) : (
                      <>
                        <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wider text-orange-600 bg-white/95 px-2.5 py-1 rounded-md uppercase">PPTX</span>
                      </>
                    )}
                  </div>
                  <div className="p-6 pb-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">{slide.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">{slide.speaker}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 border-t border-gray-100 pt-4 w-full">
                    <button onClick={() => setActiveViewerId(isViewing ? null : slide.id)} className="w-full sm:w-auto text-center border text-xs font-semibold px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50">
                      {isViewing ? 'Close Preview' : 'View Slides'}
                    </button>
                    <a href={slide.downloadUrl} className="w-full sm:w-auto text-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex-1">
                      Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
