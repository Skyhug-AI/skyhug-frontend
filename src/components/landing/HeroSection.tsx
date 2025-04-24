
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Cloud, Brain, ArrowRight } from 'lucide-react';
import AudioWavePreview from './AudioWavePreview';
import TrustMarkers from './TrustMarkers';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center py-20 px-4 md:px-8 overflow-hidden">
      {/* Dynamic background with floating elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-serenity-50/50 to-background -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orb-periwinkle/20 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orb-lavender/20 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="flex flex-col gap-8 relative z-10">
          {/* Small highlight text */}
          <div className="inline-flex items-center gap-2 text-sm font-medium text-serenity-600 bg-serenity-50 py-1 px-3 rounded-full w-fit">
            <Cloud className="h-4 w-4" />
            AI-Powered Therapy
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-serenity-900 via-serenity-700 to-serenity-800 bg-clip-text text-transparent">
              Your Personal AI Therapist in the Cloud
            </h1>
            <p className="text-xl text-serenity-600 max-w-xl">
              Experience therapeutic conversations powered by advanced AI. 
              Available 24/7, completely private, and personalized to you.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/voice')} 
              className="bg-serenity-500 hover:bg-serenity-600 text-white rounded-full px-8 py-6 text-lg group transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => navigate('/chat')} 
              variant="outline" 
              className="rounded-full border-serenity-200 text-foreground hover:bg-serenity-50 px-8 py-6 text-lg"
            >
              Learn More
              <Brain className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <TrustMarkers />
        </div>
        
        {/* Visual Content */}
        <div className="relative h-[600px] w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <AudioWavePreview />
          </div>
          
          {/* Floating message bubbles */}
          <div className="absolute top-1/4 left-10 md:left-20 animate-float">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs border border-serenity-100">
              <p className="text-lg">How are you feeling today?</p>
            </div>
          </div>
          
          <div className="absolute bottom-1/4 right-10 md:right-20 animate-float" style={{ animationDelay: '1s' }}>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs border border-serenity-100">
              <p className="text-lg">I'm here to listen and support you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
