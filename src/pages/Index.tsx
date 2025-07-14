import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CloudBackground from "@/components/CloudBackground";
import { useNavigate } from "react-router-dom";
import { Mic, Heart, X } from "lucide-react";
import AnimatedSunLoader from "@/components/ui/AnimatedSunLoader";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
const Index = () => {
  const navigate = useNavigate();
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const handleTalkToSky = () => {
    navigate('/signup');
  };

  // Commented out voice interface functionality for now
  // const handleTalkToSkyOld = () => {
  //   setShowVoiceInterface(true);
  // };

  const handleSessionStart = () => {
    setIsSessionStarted(true);
  };

  const handleVoiceRecorded = (transcript: string) => {
    console.log('Voice recorded:', transcript);
    // Handle the voice input here
  };

  // Peaceful breathing animation for therapy theme
  const BreathingVisualization = () => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      size: Math.random() * 8 + 4,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));

    return (
      <div className="relative h-32 w-full max-w-4xl mx-auto overflow-hidden">
        {/* Gentle breathing waves */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Central breathing circle */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-200/40 to-blue-200/40 animate-pulse" 
                 style={{ animationDuration: '4s' }} />
            
            {/* Expanding rings */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border border-sky-300/30 animate-ping" 
                 style={{ animationDuration: '4s', animationDelay: '0s' }} />
            <div className="absolute -inset-2 w-20 h-20 rounded-full border border-blue-300/20 animate-ping" 
                 style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute -inset-4 w-24 h-24 rounded-full border border-indigo-300/10 animate-ping" 
                 style={{ animationDuration: '4s', animationDelay: '2s' }} />
          </div>
        </div>

        {/* Floating peaceful particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-br from-sky-300/20 to-blue-300/30 animate-float"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Soft light rays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/10 to-transparent animate-pulse" 
             style={{ animationDuration: '8s' }} />
      </div>
    );
  };
  return <div className="min-h-screen bg-gradient-to-b from-white to-serenity-50 text-gray-900 relative overflow-hidden">
      {/* Cloud background */}
      <CloudBackground />
      
      {/* Subtle animated orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse-slow" />
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse-slow" style={{
      animationDelay: '1s'
    }} />
      <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse-slow" style={{
      animationDelay: '2s'
    }} />

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
            AI Therapy Companion
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-float">
              for Everyone
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">Feel like your best self with stress-relieving exercises, journaling, meditaitons, sleep resources, and beyond.</p>
        </div>


        {/* Peaceful Breathing Visualization */}
        <div className="w-full mb-12">
          <BreathingVisualization />
        </div>

        {/* Talk to Sky Interface */}
        <div className="flex flex-col items-center space-y-6">
          <button onClick={handleTalkToSky} className="glass-panel text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-all duration-300 shadow-xl flex items-center gap-3">
            <Mic className="w-5 h-5" />
            <span className="text-lg">TALK TO SKY</span>
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-blue-500/60 rounded-full animate-wave" />
              <div className="w-1 h-4 bg-purple-500/60 rounded-full animate-wave" style={{
              animationDelay: '0.1s'
            }} />
              <div className="w-1 h-4 bg-pink-500/60 rounded-full animate-wave" style={{
              animationDelay: '0.2s'
            }} />
            </div>
          </button>
          
          {/* Commented out voice interface for now */}
          {/* {!showVoiceInterface ? (
            <button onClick={handleTalkToSky} className="glass-panel text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-all duration-300 shadow-xl flex items-center gap-3">
              <Mic className="w-5 h-5" />
              <span className="text-lg">TALK TO SKY</span>
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-blue-500/60 rounded-full animate-wave" />
                <div className="w-1 h-4 bg-purple-500/60 rounded-full animate-wave" style={{
                animationDelay: '0.1s'
              }} />
                <div className="w-1 h-4 bg-pink-500/60 rounded-full animate-wave" style={{
                animationDelay: '0.2s'
              }} />
              </div>
            </button>
          ) : (
            <div className="max-w-md w-full text-center">
              {!isSessionStarted ? (
                <AnimatedSunLoader
                  onComplete={handleSessionStart}
                  duration={3000}
                  subtext="Your mind deserves this pause."
                />
              ) : (
                <div className="space-y-4">
                  <VoiceRecorder onVoiceRecorded={handleVoiceRecorded} />
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>;
};
export default Index;