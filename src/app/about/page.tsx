'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InternationalConnection from '../components/InternationalConnection';

export default function AboutPage() {
  const coreValues = [
    {
      title: 'Scriptural Foundation',
      description: 'We hold a steadfast commitment to the Bible as the infallible Word of God, using it as our ultimate blueprint for daily living, doctrine, and church fellowship.'
    },
    {
      title: 'Covenant Fellowship',
      description: 'Our history is deeply rooted in covenant love. We function not as a cold organization, but as a warm, mutually supportive spiritual family.'
    },
    {
      title: 'Practical Ministry',
      description: 'Following our historical roots of community care, we focus intensely on real-world local initiatives—raising leaders, supporting families, and sharing hope.'
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Universal Website Header */}
      <Header />

      {/* 1. Hero Section Banner */}
      <section className="relative pt-40 pb-28 bg-gray-900 overflow-hidden text-center">
        
        {/* 🌟 THE BACKGROUND PHOTO LAYER */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/church.png"
            alt="Church of God of Prophecy Marikina Front photo"
            className="h-full w-full object-cover object-center transform scale-105"
          />
          {/* 🌟 VITAL READABILITY ACCENT: Blends a deep gradient mask so text stays crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-slate-950/75 to-black/90 mix-blend-multiply" />
        </div>

        {/* Text Content Overlay */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-400/20">
            Our Story
          </span>
          <h1 className="text-4xl font-display font-bold tracking-tight sm:text-5xl mt-6 mb-6 text-white drop-shadow-sm">
            About Our Church
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto drop-shadow">
            Discover the rich historical heritage, global reach, and local ministry heartbeat of Church of God of Prophecy Marikina. We are dedicated to providing a place where families can grow in faith and fellowship together.
          </p>
        </div>
      </section>
      
      {/* 2. Our Local Core Values Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What We Stand For</h2>
          <p className="text-sm text-muted-foreground mt-2">
            The foundational pillars shaping our church family locally and worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <div key={index} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 font-bold text-sm">
                0{index + 1}
              </div>
              <h3 className="text-lg font-bold mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Global International Connection Portal */}
      {/* 
        This automatically embeds your dark slate global movement layout section 
        perfectly into the middle of your new page layout context!
      */}
      <InternationalConnection />

      {/* Universal Website Footer */}
      <Footer />
    </main>
  );
}
