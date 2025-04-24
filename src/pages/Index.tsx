
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import SupportOptions from '@/components/landing/SupportOptions';
import MoodTrackingPreview from '@/components/landing/MoodTrackingPreview';
import TherapyOptions from '@/components/landing/TherapyOptions';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-serenity-50">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <TherapyOptions />
        <MoodTrackingPreview />
        <SupportOptions />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
