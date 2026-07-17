'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InternationalConnection from '../components/InternationalConnection';

export default function AboutUsPage() {
  const pastoralTeam = [
  { name: 'Pstr. Albert Garao', role: 'Lead Pastor', bio: 'Dedicated to shepherding the Marikina community and teaching the word of God with clarity and passion.', image: '/assets/images/1.png' },
  { name: 'Pstr. Allan Canonigo', role: 'Associate Pastor', bio: 'Passionately overseeing our discipleship frameworks, young leader training programs, and community ministries.', image: '/assets/images/2.png' },
  { name: 'Pstr. Jisel Baliguat', role: 'Newly Annointed Associate Pastor/National Youth Directress', bio: 'Serving locally and leading youth nationwide, she uses her extensive international experience to equip the next generation.', image: '/assets/images/3.png' },
  { name: 'Pstr. Roderick Justiniano', role: 'Newly Annointed Associate Pastor', bio: 'He leverages his music ministry and pastoral experience to support church operations and empower various local congregations.', image: '/assets/images/4.png' },
  { name: 'Bro. Jeric Urbano', role: 'Mens Ministry Leader', bio: 'Discipling and uniting men in faith, community, and service.', image: '/assets/images/mensleader.png' },
  { name: 'Sis.. Nora Dela Cruz', role: 'Womens Ministry Leader', bio: 'Cultivating deep faith and authentic sisterhood through intentional mentorship and shared grace.', image: '/assets/images/womensleader.png' },
  { name: 'Sis. Zhaila Emnas', role: 'Youth Leader', bio: 'Inspiring the next generation to pursue Christ, build real community, and live out their faith boldly through meaningful fellowship and active service.', image: '/assets/images/' },
  { name: 'Sis. Lia Fernando', role: 'Kids Ministry Directress', bio: 'Guiding young hearts to know Jesus, build a strong foundation of faith, and discover joy in serving God through creative learning and meaningful fellowship.', image: '/assets/images/kidsleader.jpg' },
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
      
      {/* 2. Official Foundation & Global Belief Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-sm">
          
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
              What We Believe
            </span>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mt-3 text-card-foreground">
              Our Foundation: The Bible
            </h2>
            <p className="text-base font-semibold text-primary/80 mt-1">
              The Supreme Authority of Scripture
            </p>
          </div>

          <div className="text-muted-foreground text-sm sm:text-base leading-relaxed space-y-6">
            <p>
              The Church of God of Prophecy is built on the belief in <strong className="text-card-foreground">“the whole Bible rightly divided.”</strong> We affirm the Bible as God’s inspired, inerrant, and infallible Word—His written revelation to humanity and our ultimate guide in matters of faith, doctrine, practice, and discipline.
            </p>

            {/* Core Pill Bullet Points */}
            <ul className="space-y-3 pt-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary shrink-0 mr-3 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm">The Bible is our highest authority, free from man-made creeds or traditions.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary shrink-0 mr-3 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm">Early pioneers embraced the New Testament as their only rule of faith and practice.</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary shrink-0 mr-3 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-sm">Doctrinal decisions are made in unity by the International Assembly.</span>
              </li>
            </ul>
          </div>

          {/* Direct Link Call-to-Action */}
          <div className="mt-10 pt-8 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground mb-4">
              To read the complete foundation, historical covenants, and specific ministries, visit our global network directory.
            </p>
            <a 
              href="https://cogop.org/what-we-believe/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-xl shadow transition-colors hover:bg-primary/95"
            >
              Read Full Beliefs on International Website
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

        </div>
      </section>

      {/* 3. Leadership Team Section */}
      <section className="py-16 bg-gray-50 border-t border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-gray-900">
              Our Leadership Team
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              The pastors and ministry leaders serving our Marikina church family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pastoralTeam.map((pastor, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col items-center text-center justify-between hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col items-center w-full">
                  {/* Rounded Profile Avatar Frame Container */}
                  <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center mb-4 shrink-0 relative shadow-inner">
                    {pastor.image ? (
                      /* 🌟 UPDATED: Dynamic image element triggers if image url path is defined */
                      <img 
                        src={pastor.image} 
                        alt={pastor.name} 
                        className="w-full h-full object-cover object-center absolute inset-0"
                        onError={(e) => {
                          // Safeguard fallback if image extension or path name is slightly incorrect
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-base text-gray-900 leading-tight">
                    {pastor.name}
                  </h3>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 mb-3 inline-block px-2.5 py-1 bg-primary/5 rounded leading-normal">
                    {pastor.role}
                  </span>
                </div>
                
                <p className="text-gray-600 text-xs leading-relaxed w-full border-t border-gray-100 pt-3 mt-1">
                  {pastor.bio}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. The Global International Connection Portal */}
      <InternationalConnection />

      {/* Universal Website Footer */}
      <Footer />
    </main>
  );
}
