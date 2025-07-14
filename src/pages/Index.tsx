import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CloudBackground from "@/components/CloudBackground";
import SunriseGradientBackground from "@/components/SunriseGradientBackground";
import DemoChatInterface from "@/components/landing/DemoChatInterface";
import { useNavigate } from "react-router-dom";
import { Mic, Heart, X } from "lucide-react";
import AnimatedSunLoader from "@/components/ui/AnimatedSunLoader";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { supabase } from "@/integrations/supabase/client";
const Index = () => {
  const navigate = useNavigate();
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  // Rotating text for "for everyone"
  const rotatingTexts = ["for everyone", "for anxiety", "for ADHD", "for couples", "for happiness", "for sleep", "for LGBTQ"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);

  // Check for authenticated user and redirect to /home if logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/home");
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextOpacity(0); // Fade out
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setTextOpacity(1); // Fade in
      }, 200); // Wait for fade out to complete
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleTalkToSky = () => {
    navigate("/signup");
  };

  // Commented out voice interface functionality for now
  // const handleTalkToSkyOld = () => {
  //   setShowVoiceInterface(true);
  // };

  const handleSessionStart = () => {
    setIsSessionStarted(true);
  };

  const handleVoiceRecorded = (transcript: string) => {
    console.log("Voice recorded:", transcript);
    // Handle the voice input here
  };

  // Audio visualization bars for the bottom
  const AudioBars = () => {
    const bars = Array.from(
      {
        length: 10,
      },
      (_, i) => ({
        id: i,
        height: Math.random() * 40 + 10,
        color: [
          "bg-blue-400",
          "bg-purple-400",
          "bg-pink-400",
          "bg-green-400",
          "bg-yellow-400",
          "bg-indigo-400",
          "bg-cyan-400",
          "bg-orange-400",
        ][Math.floor(Math.random() * 8)],
      })
    );
    return (
      <div className="flex items-end justify-center gap-1 h-24 w-full max-w-4xl mx-auto">
        {bars.map((bar, index) => (
          <div
            key={bar.id}
            className={`${bar.color} rounded-full transition-all duration-300 hover:opacity-80 animate-wave`}
            style={{
              height: `${bar.height}px`,
              width: "8px",
              animationDelay: `${index * 100}ms`,
              animationDuration: `${Math.random() * 0.8 + 0.8}s`,
            }}
          />
        ))}
      </div>
    );
  };
  return (
    <div className="min-h-screen text-gray-900 relative overflow-hidden">
      <SunriseGradientBackground />
      <CloudBackground />

      <div className="relative z-50">
        <Header />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="mb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">SKYHUG</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
            AI therapy companion
            <br />
            <span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-float transition-opacity duration-200"
              style={{ opacity: textOpacity }}
            >
              {rotatingTexts[currentTextIndex]}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Feel like your best self with stress-relieving exercises,
            journaling, meditaitons, sleep resources, and beyond.
          </p>
        </div>

        {/* Talk to Sky Interface */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            {/* Floating sparkles animation */}
            <div className="absolute -inset-6 opacity-70">
              <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
              <div className="absolute top-2 right-0 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '1.8s' }}></div>
              <div className="absolute bottom-0 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '2.2s' }}></div>
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1.5s', animationDuration: '1.5s' }}></div>
            </div>

            {/* Continuous glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl animate-pulse"></div>

            <button
              onClick={handleTalkToSky}
              className="relative glass-panel text-gray-900 px-8 py-4 mt-6 rounded-full font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-3 hover:shadow-2xl group animate-bounce"
              style={{
                animationDuration: '3s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out'
              }}
            >
              <span className="text-lg group-hover:animate-bounce">TALK TO SKY 🌤️</span>

              {/* Ripple effect on hover */}
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Audio Visualization */}
        <div className="w-full">
          <AudioBars />
        </div>
      </div>

      {/* Demo Chat Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Try it out
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience our AI companion in action. Send a message and see how it responds.
            </p>
          </div>
          
          <DemoChatInterface />
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
