
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import SessionIntro from "@/components/session/SessionIntro";
import SessionRoom from "@/components/session/SessionRoom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// CloudBackground import for faint, floating clouds
import CloudBackground from "@/components/CloudBackground";

const SessionPage = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const { clearMessages, endConversation } = useTherapist();
  const navigate = useNavigate();

  const handleStartSession = useCallback(() => {
    setIsSessionStarted(true);
  }, []);

  useEffect(() => {
    const initSession = async () => {
      await clearMessages();
    };
    initSession();
  }, []);

  const handleEndSession = async () => {
    await endConversation();
    navigate("/session-summary");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-[#f4f8ff] to-white overflow-hidden">
      {/* Faint cloud/sparkle illustration, ultra low opacity */}
      <CloudBackground className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none" />

      <header className="border-b border-gray-100 bg-[rgba(255,255,255,0.8)] sticky top-0 z-40 shadow-sm backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {isSessionStarted && (
              <div className="flex items-center gap-2 text-gray-600 text-sm font-plus-jakarta">
                <span>You're in a therapy session with Sky — your AI companion</span>
                {/* Animated Sky cloud mascot for 'live' */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.18, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 2.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="ml-1"
                >
                  {/* Sky mascot as animated cloud */}
                  <span className="inline-block animate-fade-in"><svg width="20" height="20" className="drop-shadow" viewBox="0 0 20 20"><g><ellipse cx="10" cy="14" rx="8" ry="4.2" fill="#bdb2ff" /><ellipse cx="13" cy="12" rx="5" ry="3.2" fill="#a0c4ff" /><ellipse cx="8" cy="12.3" rx="5" ry="2.7" fill="#f5f5ff" /></g></svg></span>
                </motion.div>
                <div className="flex items-center gap-1 text-skyhug-500 ml-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-skyhug-500"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="text-xs font-medium">live</span>
                </div>
              </div>
            )}
          </div>

          {isSessionStarted && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-transform duration-150 hover:scale-105"
              onClick={handleEndSession}
            >
              End Chat & Continue
            </Button>
          )}
        </div>
      </header>

      <div className="flex-grow max-w-3xl mx-auto px-4 w-full z-10 relative">
        {!isSessionStarted ? (
          <SessionIntro onStartSession={handleStartSession} />
        ) : (
          <SessionRoom />
        )}
      </div>
    </div>
  );
};

export default SessionPage;
