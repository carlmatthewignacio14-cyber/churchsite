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
      <section className="relative pt-32 pb-20 bg-gray-50 border-b border-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl font-display font-bold tracking-tight sm:text-5xl mt-4 mb-6">
            About Our Church
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Discover the rich historical heritage, global reach, and local ministry heartbeat of Church of God of Prophecy Marikina.
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
