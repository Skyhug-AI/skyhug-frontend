
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CloudBackground from "@/components/CloudBackground";
import { useNavigate } from "react-router-dom";
import { Mic, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Audio visualization bars for the bottom
  const AudioBars = () => {
    const bars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      height: Math.random() * 40 + 10,
      color: [
        'bg-blue-400',
        'bg-purple-400', 
        'bg-pink-400',
        'bg-green-400',
        'bg-yellow-400',
        'bg-indigo-400',
        'bg-cyan-400',
        'bg-orange-400'
      ][Math.floor(Math.random() * 8)]
    }));

    return (
      <div className="flex items-end justify-center gap-1 h-32 w-full max-w-4xl mx-auto">
        {bars.map((bar, index) => (
          <div
            key={bar.id}
            className={`${bar.color} rounded-full transition-all duration-300 hover:opacity-80 animate-wave`}
            style={{
              height: `${bar.height}px`,
              width: '8px',
              animationDelay: `${index * 100}ms`,
              animationDuration: `${Math.random() * 0.8 + 0.8}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-serenity-50 text-gray-900 relative overflow-hidden">
      {/* Cloud background */}
      <CloudBackground />
      
      {/* Subtle animated orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse-slow" />
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">SKYHUG</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-2 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Voice AI therapist
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              for everyone
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Start your healing journey with Sky, your personal AI therapist. 
            Available 24/7 for voice conversations that feel natural and supportive.
          </p>
        </div>


        {/* Audio Visualization */}
        <div className="w-full mb-12">
          <AudioBars />
        </div>

        {/* Talk to Sky Interactive Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/session')}
            className="glass-panel text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-all duration-300 shadow-xl flex items-center gap-3"
          >
            <Mic className="w-5 h-5" />
            <span className="text-lg">TALK TO SKY</span>
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-blue-500/60 rounded-full animate-wave" />
              <div className="w-1 h-4 bg-purple-500/60 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-4 bg-pink-500/60 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
