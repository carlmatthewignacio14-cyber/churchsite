'use client';

import React from 'react';

export default function InternationalConnection() {
  const globalPortals = [
    {
      title: 'International Website',
      description: 'Explore the global headquarters hub, official leadership doctrines, and international statements of faith.',
      url: 'https://cogop.org',
      badge: 'Official HQ'
    },
    {
      title: 'Official News & Media',
      description: 'Read the White Wing Messenger archive, download global press updates, and stream international assemblies.',
      url: 'https://cogop.org/news/',
      badge: 'Global Media'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-black pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full uppercase">
            Global Fellowship
          </span>
          <h2 className="text-3xl font-display font-bold tracking-tight sm:text-4xl mt-4 mb-4 text-white">
            Connected to a Global Movement
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Church of God of Prophecy Marikina is a proud local expression of a thriving global movement that began in 1886 in North Carolina. Formally organized into an international missionary network in 1903, COGOP has grown to span over 130 nations and territories, working together to restore New Testament vibrancy.
          </p>
        </div>

        {/* Global Informational Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {globalPortals.map((portal, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-8 rounded-2xl flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div>
                <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded mb-4">
                  {portal.badge}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {portal.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {portal.description}
                </p>
              </div>

              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-700 hover:bg-blue-600 px-4 py-3 rounded-lg transition-all text-center justify-center"
              >
                Visit Official Portal
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Core Global Vision Statement Block */}
       <div className="mt-16 border border-slate-800 bg-black/30 backdrop-blur-md rounded-2xl p-8 text-center max-w-4xl mx-auto">
          <p className="text-slate-300 italic font-medium leading-relaxed text-sm md:text-base">
            "Reconciling the world to Christ through the power of the Holy Spirit—united in our covenant dedication to the infallible Word of God and local community transformation."
          </p>
          <span className="block text-xs uppercase tracking-widest text-blue-400 font-bold mt-3">
            Our Shared Global Vision
          </span>
        </div>

      </div>
    </section>
  );
}
