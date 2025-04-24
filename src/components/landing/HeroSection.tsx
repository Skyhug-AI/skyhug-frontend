
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Cloud, Brain, ArrowRight } from 'lucide-react';
import AudioWavePreview from './AudioWavePreview';
import TrustMarkers from './TrustMarkers';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EEF2FF] via-[#F7F8FD] to-[#EEF4FD] -z-10">
        {/* Animated cloud particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="cloud absolute opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 80 + 60}px`,
              height: `${Math.random() * 50 + 40}px`,
              animationDuration: `${Math.random() * 10 + 20}s`,
              animationDelay: `${i * -2}s`,
            }}
          />
        ))}
        
        {/* Soft accent gradients */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-[#FDE1D3] to-transparent opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#E5DEFF] to-transparent opacity-30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full bg-white/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-8">
            {/* Small highlight text */}
            <div className="inline-flex items-center gap-2 text-sm font-medium text-serenity-600 bg-serenity-50/80 py-1.5 px-4 rounded-full w-fit backdrop-blur-sm border border-serenity-100/50">
              <Cloud className="h-4 w-4" />
              AI-Powered Therapy
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block bg-gradient-to-r from-serenity-900 via-serenity-700 to-serenity-800 bg-clip-text text-transparent">
                  Welcome back,
                </span>
                <span className="block text-foreground mt-2">
                  we missed you ✨
                </span>
              </h1>
              <p className="text-xl text-serenity-600 max-w-xl">
                Sky's here to support you. Let's keep going together on your journey to better mental wellbeing.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate('/voice')} 
                className="bg-serenity-500 hover:bg-serenity-600 text-white rounded-full px-8 py-6 text-lg group transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => navigate('/chat')} 
                variant="outline" 
                className="rounded-full border-serenity-200 text-foreground hover:bg-serenity-50 px-8 py-6 text-lg shadow-md hover:shadow-lg"
              >
                Learn More
                <Brain className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <TrustMarkers />
          </div>
          
          {/* Visual Content */}
          <div className="relative h-[500px] w-full">
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
      </div>
    </section>
  );
};

export default HeroSection;
