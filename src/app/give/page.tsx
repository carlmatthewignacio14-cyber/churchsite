import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GiveHero from '@/app/give/components/GiveHero';
import GiveForm from '@/app/give/components/GiveForm';
import GiveImpact from '@/app/give/components/GiveImpact';

export default function GivePage() {
  return (
    <main className="relative overflow-x-hidden bg-background">
      <Header />
      <GiveHero />
      <GiveForm />
      <GiveImpact />
      <Footer />
    </main>
  );
}
