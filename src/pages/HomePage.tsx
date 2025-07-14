import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mic, Sparkles, Heart, MessageSquare } from "lucide-react";
import AudioWaveAnimation from "@/components/voice/AudioWaveAnimation";
import { useTherapist } from "@/context/TherapistContext";

const HomePage = () => {
  const { user } = useAuth();
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
            className={`${bar.color} rounded-full transition-all duration-300 hover:opacity-80`}
            style={{
              height: `${bar.height}px`,
              width: '8px',
              animationDelay: `${index * 50}ms`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Dark background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      
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
            <span className="text-xl font-semibold">SKYHUG</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Voice AI therapist
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              for everyone
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Start your healing journey with Sky, your personal AI therapist. 
            Available 24/7 for voice conversations that feel natural and supportive.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button
            onClick={() => navigate('/voice')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl border-0"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            TALK TO SKY
          </Button>
          
          <Button
            onClick={() => navigate('/chat')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            TEXT CHAT
          </Button>
        </div>

        {/* Audio Visualization */}
        <div className="w-full">
          <AudioBars />
        </div>

        {/* Talk to Sky Interactive Button */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => navigate('/voice')}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all duration-300 shadow-xl flex items-center gap-3"
          >
            <Mic className="w-5 h-5" />
            <span className="text-lg">TALK TO SKY</span>
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-white/60 rounded-full animate-wave" />
              <div className="w-1 h-4 bg-white/60 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-4 bg-white/60 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
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
export default HomePage;
