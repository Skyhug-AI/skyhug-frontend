
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageSquareText, ArrowRight, Heart, Sparkles, Sun } from 'lucide-react';
import AudioWavePreview from './AudioWavePreview';
import TrustMarkers from './TrustMarkers';

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-32 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-serenity-50/50 via-white/80 to-white/40 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-serenity-100/30 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8 relative">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-serenity-600 to-serenity-500 bg-clip-text text-transparent">
              AI Therapy - Here for Every Kind of Sky
            </h1>
            <p className="text-2xl font-light text-serenity-600 leading-relaxed">
              Voice-based AI therapy that adapts to your emotional landscape. 
              Open up, feel better, anytime. <span className="inline-block animate-bounce">💫</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <Button 
              onClick={() => navigate('/voice')} 
              className="bg-gradient-to-r from-serenity-400 to-serenity-500 hover:from-serenity-500 hover:to-serenity-600 text-white rounded-full px-8 group transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Sun className="mr-2 h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
              Try Voice Therapy 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              onClick={() => navigate('/chat')} 
              variant="outline" 
              className="rounded-full border-serenity-200 text-serenity-700 hover:bg-serenity-50 px-8 group" 
              size="lg"
            >
              Start Chatting 
              <MessageSquareText className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>

          <div className="space-y-4">
            <TrustMarkers />
          </div>
        </div>
        
        <div className="relative h-[500px] w-full">
          <AudioWavePreview />
          <div className="absolute top-1/4 left-10 md:left-20 animate-float">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs border border-serenity-100">
              <p className="text-lg text-gray-700">Tell me what's on your mind today...</p>
            </div>
          </div>
          <div className="absolute bottom-1/4 right-10 md:right-20 animate-float" style={{
            animationDelay: '1s'
          }}>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs border border-serenity-100">
              <p className="text-lg text-gray-700">I'm here to listen and support you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
