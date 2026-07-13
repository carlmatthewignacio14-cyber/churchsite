'use client';

import React from 'react';

interface PowerPointSlide {
  id: string;
  title: string;
  speaker: string;
  date: string;
  viewUrl: string; 
  downloadUrl: string;
}

const sermonSlides: PowerPointSlide[] = [
  {
    id: '1',
    title: 'A Faith That Comes Out Stronger | Mark 4:41',
    speaker: 'Pastor Albert Garao',
    viewUrl: 'https://docs.google.com/presentation/d/1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus/edit?usp=drive_link&ouid=105615319819982595182&rtpof=true&sd=true',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1Odq5kOh-UUvBvvrI0R0wYfgA0Dc9Zhus', 
  },
  {
    id: '2',
    title: 'Bridging The Faith | 1 Timothy 5:1-8',
    speaker: 'Pastor Albert Garao',
    viewUrl: 'https://docs.google.com/presentation/d/1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y/edit?usp=drive_link&ouid=105615319819982595182&rtpof=true&sd=true',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PcZ3HGOmHp43VQTEFpKgRNoDJm9h5E6Y', 
  },
  {
    id: '3',
    title: 'Christ Has Indeed Been Raised | 1 Corinthians 15:12-20',
    speaker: 'Pastor Albert Garao',
    viewUrl: 'https://docs.google.com/presentation/d/1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d/edit?usp=drive_link&ouid=105615319819982595182&rtpof=true&sd=true',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=1PZjPyLV6ZtCipf1zKoO-otbDTcZ7yE1d', 
  },
  {
    id: '4',
    title: 'Crossing For One Broken Life | Mark 5:1-20',
    speaker: 'Pastor Albert Garao',
    viewUrl: 'https://docs.google.com/presentation/d/18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT/edit?usp=drive_link&ouid=105615319819982595182&rtpof=true&sd=true',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=18gKdf3F9_pO8tUQFO4CGWZ_uhFxN5MhT', 
  }
];

export default function SermonSlidesSection() {
  return (
    <section className="py-16 bg-gray-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl">
            Sermon Presentations & Slides
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            View or download the PowerPoint slides from our recent Sunday messages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermonSlides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="text-xs font-semibold tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase">
                  PowerPoint (.pptx)
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1">{slide.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{slide.speaker}
                </p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 border-t border-gray-100 pt-4 w-full">
                <a
                  href={slide.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  View Slides
                </a>
                
                <a
                  href={slide.downloadUrl}
                  className="w-full sm:w-auto text-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex-1"
                >
                  Download
                </a>
              </div>
              
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
