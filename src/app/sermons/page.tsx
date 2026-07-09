import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SermonsHero from '@/app/sermons/components/SermonsHero';
import SermonsGrid from '@/app/sermons/components/SermonsGrid';
import FeaturedSeries from '@/app/sermons/components/FeaturedSeries';

export default function SermonsPage() {
  return (
    <main className="relative overflow-x-hidden bg-background">
      <Header />
      <SermonsHero />
      <FeaturedSeries />
      <SermonsGrid />
      <Footer />
    </main>
  );
}