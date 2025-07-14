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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

        {/* Audio Visualization */}
        <div className="w-full">
          <AudioBars />
        </div>
      </div>

      {/* What do you want section */}
      <div className="relative z-10 bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What do you want an AI therapy companion for?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Stress less */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Stress less</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">💪</div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sleep soundly */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sleep soundly</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">🌙✨</div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Manage anxiety */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage anxiety</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">🌀</div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Process thoughts */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Process thoughts</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">🗨️</div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Practice meditation */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice meditation</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">🧘</div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Start therapy */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Start therapy</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl">💬</div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom text input */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <label htmlFor="custom-reason" className="block text-lg font-semibold text-gray-900 mb-3">
                Or tell us something else:
              </label>
              <textarea
                id="custom-reason"
                placeholder="I want an AI therapy companion to help me with..."
                className="w-full h-24 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                Share with us
              </button>
            </div>
          </div>

          {/* Subtitle */}
          <div className="text-center mt-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The mental health app for every moment
            </h3>
            <div className="flex flex-wrap justify-center gap-8 text-gray-600">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                AI guidance
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Guided meditations
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                Sleep resources
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Expert-led programs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {/* Convenient Online Therapy */}
              <CarouselItem className="pl-2 md:pl-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden min-h-[400px] flex items-center">
                  {/* Decorative clouds */}
                  <div className="absolute top-6 right-6 w-16 h-10 bg-white/20 rounded-full"></div>
                  <div className="absolute top-10 right-12 w-12 h-8 bg-white/15 rounded-full"></div>
                  <div className="absolute top-4 right-20 w-8 h-6 bg-white/10 rounded-full"></div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-white/80 font-medium">Online therapy</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Convenient
                        <br />
                        online
                        <br />
                        therapy
                      </h3>
                      <p className="text-lg text-white/90 mb-8 max-w-md">
                        Check your coverage, find a therapist, and start feeling your best with Headspace therapy.
                      </p>
                      <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Get started
                      </button>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {/* Video call mockup */}
                        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                          <div className="bg-gray-800 rounded-xl p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="bg-blue-100 rounded-lg p-4 relative">
                              <div className="w-12 h-12 bg-green-400 rounded-full mb-2"></div>
                              <div className="text-xs text-gray-700 font-medium">Neca, LMFT</div>
                            </div>
                          </div>
                          <div className="bg-yellow-100 rounded-xl p-4">
                            <div className="w-16 h-20 bg-yellow-300 rounded-lg mb-2"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Guided Meditations */}
              <CarouselItem className="pl-2 md:pl-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden min-h-[400px] flex items-center">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-white/80 font-medium">Guided meditations</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Find your
                        <br />
                        inner peace
                      </h3>
                      <p className="text-lg text-white/90 mb-8 max-w-md">
                        Discover mindfulness and meditation practices designed to reduce stress and improve focus.
                      </p>
                      <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Start meditating
                      </button>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <div className="text-6xl">🧘</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* AI Guidance */}
              <CarouselItem className="pl-2 md:pl-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden min-h-[400px] flex items-center">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-white/80 font-medium">AI guidance</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Personalized
                        <br />
                        support
                      </h3>
                      <p className="text-lg text-white/90 mb-8 max-w-md">
                        Get instant, personalized guidance from our AI companion whenever you need it.
                      </p>
                      <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Chat now
                      </button>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <div className="text-6xl">🤖</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Sleep Resources */}
              <CarouselItem className="pl-2 md:pl-4">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden min-h-[400px] flex items-center">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-white/80 font-medium">Sleep resources</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Better
                        <br />
                        sleep
                        <br />
                        tonight
                      </h3>
                      <p className="text-lg text-white/90 mb-8 max-w-md">
                        Discover sleep stories, sounds, and techniques to help you fall asleep faster and sleep deeper.
                      </p>
                      <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Sleep better
                      </button>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <div className="text-6xl">🌙</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>

      {/* Demo Chat Section */}
      {/* <div className="relative z-10 py-20 px-6">
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
      </div> */}

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
export default Index;
