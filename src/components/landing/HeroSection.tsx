import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MessageSquareText, ArrowRight } from 'lucide-react';
import AudioWavePreview from './AudioWavePreview';
import TrustMarkers from './TrustMarkers';
const HeroSection = () => {
  const navigate = useNavigate();
  return <section className="relative py-32 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-serenity-50 to-background -z-10"></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">AI Therapy - Here for Every Kind of Sky</h1>
            <p className="text-2xl font-light text-serenity-600">
              Voice-based AI therapy that adapts to your emotional landscape. 
              Open up, feel better, anytime.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6">
            <Button onClick={() => navigate('/voice')} className="bg-serenity-500 hover:bg-serenity-600 text-white rounded-full px-8 group transition-all duration-300" size="lg">
              Try Voice Therapy 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button onClick={() => navigate('/chat')} variant="outline" className="rounded-full border-serenity-200 text-foreground hover:bg-serenity-50 px-8" size="lg">
              Start Chatting <MessageSquareText className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <TrustMarkers />
        </div>
        
        <div className="relative h-[500px] w-full">
          <AudioWavePreview />
          <div className="absolute top-1/4 left-10 md:left-20 animate-float">
            <div className="bg-white p-4 rounded-xl shadow-lg max-w-xs">
              <p className="text-lg">Tell me what's on your mind today...</p>
            </div>
          </div>
          <div className="absolute bottom-1/4 right-10 md:right-20 animate-float" style={{
          animationDelay: '1s'
        }}>
            <div className="bg-white p-4 rounded-xl shadow-lg max-w-xs">
              <p className="text-lg">I'm here to listen and support you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;