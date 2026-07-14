import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import ServiceTimesSection from '@/app/components/ServiceTimesSection';
import SermonsPreviewSection from '@/app/components/SermonsPreviewSection';
import MinistriesSection from '@/app/components/MinistriesSection';
import PrayerSection from '@/app/components/PrayerSection';
import InternationConnection from '@/app/components/InternationalConnection',

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden bg-background">
      <Header />
      <HeroSection />
      <ServiceTimesSection />
      <SermonsPreviewSection />
      <InternationalConnection />
      <MinistriesSection />
      <PrayerSection />
      <Footer />
    </main>
  );
}
