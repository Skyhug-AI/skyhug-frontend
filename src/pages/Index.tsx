
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import SupportOptions from '@/components/landing/SupportOptions';
import MoodTrackingPreview from '@/components/landing/MoodTrackingPreview';
import TherapyOptions from '@/components/landing/TherapyOptions';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-b from-[#f8e8ff] via-[#f0e3ff] to-[#e8e3ff] -z-20" />
      <div className="fixed inset-0 bg-[url('/lovable-uploads/3659954d-32ca-4f52-ac75-891e49c53283.png')] bg-cover bg-center opacity-50 -z-10" />
      
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
