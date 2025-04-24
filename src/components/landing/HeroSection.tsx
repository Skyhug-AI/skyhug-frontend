
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="flex flex-col gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 bg-white/80 backdrop-blur-sm py-1 px-3 rounded-full w-fit">
            <Cloud className="h-4 w-4" />
            AI-Powered Therapy
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Find Calm in Every Moment
            </h1>
            <p className="text-xl text-purple-800/80 max-w-xl">
              Personalized therapy conversations to help you reduce stress and improve mental clarity. Available 24/7, completely private.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/voice')} 
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-8 py-6 text-lg group transition-all duration-300"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => navigate('/chat')} 
              variant="outline" 
              className="rounded-full border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg"
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
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg max-w-sm border border-purple-100">
              <h3 className="text-xl font-semibold mb-4 text-purple-800">Take a Moment to Breathe</h3>
              <p className="text-purple-600 mb-4">Calm your mind and restore balance</p>
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
