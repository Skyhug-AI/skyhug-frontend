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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Index = () => {
  const navigate = useNavigate();
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  // Rotating text for "for everyone"
  const rotatingTexts = ["for everyone", "for anxiety", "for ADHD", "for couples", "for happiness", "for sleep", "for LGBTQ"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [textOpacity, setTextOpacity] = useState(1);

  // Animated placeholder text for input
  const placeholderTexts = ["managing daily stress", "better sleep habits", "processing emotions", "building confidence", "mindfulness practice", "relationship guidance", "work-life balance", "anxiety management", "depression support", "self-care routines"];
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Check for authenticated user and redirect to /home if logged in
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/home");
      }
    };
    checkAuth();

    // Listen for auth state changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
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
        setCurrentTextIndex(prev => (prev + 1) % rotatingTexts.length);
        setTextOpacity(1); // Fade in
      }, 200); // Wait for fade out to complete
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Typing effect for placeholder
  useEffect(() => {
    let typingInterval: NodeJS.Timeout;
    let nextWordTimeout: NodeJS.Timeout;
    const typeText = () => {
      const currentText = placeholderTexts[currentPlaceholderIndex];
      let charIndex = 0;
      setTypedText("");
      setIsTyping(true);
      typingInterval = setInterval(() => {
        if (charIndex < currentText.length) {
          setTypedText(currentText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);

          // Wait before starting next word
          nextWordTimeout = setTimeout(() => {
            setCurrentPlaceholderIndex(prev => (prev + 1) % placeholderTexts.length);
          }, 2000);
        }
      }, 100);
    };
    typeText();
    return () => {
      clearInterval(typingInterval);
      clearTimeout(nextWordTimeout);
    };
  }, [currentPlaceholderIndex]);

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
    const bars = Array.from({
      length: 10
    }, (_, i) => ({
      id: i,
      height: Math.random() * 40 + 10,
      color: ["bg-blue-400", "bg-purple-400", "bg-pink-400", "bg-green-400", "bg-yellow-400", "bg-indigo-400", "bg-cyan-400", "bg-orange-400"][Math.floor(Math.random() * 8)]
    }));
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
              animationDuration: `${Math.random() * 0.8 + 0.8}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[95vh] text-gray-900 relative overflow-hidden">
      <SunriseGradientBackground />
      <CloudBackground />

      <div className="relative z-50">
        <Header />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[82vh] px-6">
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-800">
            AI Therapy Companion
            <br />
            <span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-float transition-opacity duration-200"
              style={{
                opacity: textOpacity
              }}
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
              <div
                className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  animationDelay: '0s',
                  animationDuration: '2s'
                }}
              ></div>
              <div
                className="absolute top-2 right-0 w-1 h-1 bg-blue-400 rounded-full animate-ping"
                style={{
                  animationDelay: '0.5s',
                  animationDuration: '1.8s'
                }}
              ></div>
              <div
                className="absolute bottom-0 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"
                style={{
                  animationDelay: '1s',
                  animationDuration: '2.2s'
                }}
              ></div>
              <div
                className="absolute bottom-2 right-2 w-1 h-1 bg-pink-400 rounded-full animate-ping"
                style={{
                  animationDelay: '1.5s',
                  animationDuration: '1.5s'
                }}
              ></div>
            </div>

            {/* Continuous glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl animate-pulse"></div>

            <button
              onClick={handleTalkToSky}
              className="relative glass-panel text-gray-900 px-8 py-4 mt-12 rounded-full font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-3 hover:shadow-2xl group animate-bounce"
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

      {/* What do you want section */}
      <div className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">How can an AI therapy companion help you? </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Manage stress & anxiety */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-3xl">🌀</div>
                <h3 className="text-xl font-semibold text-gray-900">Manage stress & anxiety</h3>
              </div>
            </div>

            {/* Sleep soundly */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-3xl">🌙✨</div>
                <h3 className="text-xl font-semibold text-gray-900">Sleep soundly</h3>
              </div>
            </div>

            {/* Build confidence */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-3xl">✨</div>
                <h3 className="text-xl font-semibold text-gray-900">Build confidence</h3>
              </div>
            </div>

            {/* Process emotions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-3xl">💭</div>
                <h3 className="text-xl font-semibold text-gray-900">Process emotions</h3>
              </div>
            </div>

            {/* Improve relationships */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-3xl">💝</div>
                <h3 className="text-xl font-semibold text-gray-900">Improve relationships</h3>
              </div>
            </div>

            {/* Find life balance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="text-3xl">⚖️</div>
                <h3 className="text-xl font-semibold text-gray-900">Find life balance</h3>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Carousel Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent className="-ml-2 md:-ml-4">
              {/* 100% Free */}
              <CarouselItem className="pl-2 md:pl-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden h-[400px] flex items-center">
                  {/* Decorative elements */}
                  <div className="absolute top-6 right-6 w-16 h-10 bg-white/20 rounded-full"></div>
                  <div className="absolute top-10 right-12 w-12 h-8 bg-white/15 rounded-full"></div>
                  <div className="absolute top-4 right-20 w-8 h-6 bg-white/10 rounded-full"></div>

                  <div className="flex flex-col md:flex-row items-center gap-8 w-full pl-8">
                    <div className="flex-1">
                      <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        100% Free
                      </h3>
                      <p className="text-lg text-white/90 mb-8 max-w-md">
                        No hidden fees, no subscriptions, no limits. Your mental health support should be accessible to everyone.
                      </p>
                      <button 
                        onClick={() => navigate("/session")}
                        className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Start for free
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

              {/* Convenient and Accessible */}
              <CarouselItem className="pl-2 md:pl-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden h-[400px] flex items-center">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full pl-8">
                    <div className="flex-1">
                      <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Available 24/7
                      </h3>
                      <p className="text-lg text-white/90 mb-8 max-w-md">
                        Get support whenever you need it. No appointments, no waiting - your AI therapist is always ready to listen.
                      </p>
                      <button 
                        onClick={() => navigate("/session")}
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Start now
                      </button>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <div className="text-6xl">🕒</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Customized for You */}
              <CarouselItem className="pl-2 md:pl-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden h-[400px] flex items-center">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full pl-8">
                    <div className="flex-1">
                      <h3 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Learns About You
                      </h3>
                      <p className="text-lg text-white/90 mb-8 max-w-md">
                        Your AI companion remembers your conversations and learns what's on your mind to provide truly personalized support.
                      </p>
                      <button 
                        onClick={() => navigate("/session")}
                        className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                      >
                        View profile
                      </button>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                          <div className="text-6xl">🧠</div>
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

      {/* Evidence-Based Therapy Models Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Built on proven therapy models,<br />created by licensed therapists
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Our AI was trained on the most well-researched and successful therapy approaches,
            developed and validated by licensed mental health professionals with decades of experience.
          </p>


          {/* Therapy Model Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* CBT Card */}
            <div className="bg-blue-500 rounded-2xl p-6 text-white text-left min-h-[200px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">CBT <span className="text-2xl">🧠</span></h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Cognitive Behavioral Therapy helps identify and change negative thought patterns and behaviors.
                </p>
              </div>
            </div>

            {/* EMDR/Trauma Card */}
            <div className="bg-purple-500 rounded-2xl p-6 text-white text-left min-h-[200px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">Trauma Therapy <span className="text-2xl">💛</span></h3>
                <p className="text-purple-100 text-sm leading-relaxed">
                  EMDR and trauma-informed approaches for processing difficult experiences safely.
                </p>
              </div>
            </div>

            {/* DBT Card */}
            <div className="bg-green-500 rounded-2xl p-6 text-white text-left min-h-[200px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">DBT Skills <span className="text-2xl">🎯</span></h3>
                <p className="text-green-100 text-sm leading-relaxed">
                  Dialectical Behavior Therapy skills for emotional regulation and distress tolerance.
                </p>
              </div>
            </div>

            {/* Mindfulness Card */}
            <div className="bg-orange-500 rounded-2xl p-6 text-white text-left min-h-[200px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">Mindfulness <span className="text-2xl">🧘</span></h3>
                <p className="text-orange-100 text-sm leading-relaxed">
                  Present-moment awareness and acceptance-based therapeutic practices.
                </p>
              </div>
            </div>

            {/* IFS/Parts Work Card */}
            <div className="bg-pink-500 rounded-2xl p-6 text-white text-left min-h-[200px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">IFS Parts Work <span className="text-2xl">🌟</span></h3>
                <p className="text-pink-100 text-sm leading-relaxed">
                  Internal Family Systems therapy for understanding different parts of yourself.
                </p>
              </div>
            </div>

            {/* Childhood Trauma Card */}
            <div className="bg-indigo-500 rounded-2xl p-6 text-white text-left min-h-[200px] flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">Childhood Trauma <span className="text-2xl">🌱</span></h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Specialized approaches for healing early life experiences and attachment wounds.
                </p>
              </div>
            </div>
          </div>
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