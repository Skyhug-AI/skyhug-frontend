
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
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] opacity-50 -z-10" />
      
      {/* Floating Clouds Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="flex flex-col gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-serenity-600 bg-white/80 backdrop-blur-sm py-1 px-3 rounded-full w-fit">
            <Cloud className="h-4 w-4" />
            AI-Powered Therapy
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Find Calm in Every Moment
            </h1>
            <p className="text-xl text-serenity-600 max-w-xl">
              Personalized therapy conversations to help you reduce stress and improve mental clarity. Available 24/7, completely private.
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
          
          {/* App Preview */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg max-w-sm border border-serenity-100">
              <h3 className="text-xl font-semibold mb-4">Take a Moment to Breathe</h3>
              <p className="text-serenity-600 mb-4">Calm your mind and restore balance</p>
              {/* Placeholder for mood tracking UI */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                  {['😊', '😌', '😔', '😢', '😡'].map((emoji, i) => (
                    <span key={i} className="text-2xl cursor-pointer hover:scale-110 transition-transform">{emoji}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
