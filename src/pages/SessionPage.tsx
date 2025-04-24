
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import SessionIntro from "@/components/session/SessionIntro";
import SessionRoom from "@/components/session/SessionRoom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SessionPage = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const { clearMessages, endConversation } = useTherapist();
  const navigate = useNavigate();

  // Memoize this function to prevent unnecessary rerenders
  const handleStartSession = useCallback(() => {
    console.log("🚀 Starting new therapy session");
    setIsSessionStarted(true);
  }, []);

  // Use separate useEffect to handle one-time initialization
  useEffect(() => {
    // This will run once when the component mounts
    const initSession = async () => {
      console.log("✨ Initializing session - clearing messages");
      await clearMessages();
    };

    initSession();
    // Don't include clearMessages in deps to prevent multiple calls
  }, []);

  const handleEndSession = async () => {
    await endConversation();
    navigate("/session-summary");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Full-page linear background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom right, #EEF2FF, #F7F8FD, #EEF4FD)",
          zIndex: -3,
        }}
      />
      {/* Voice-inspired bottom circle gradient */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: "50%",
          bottom: "-10%",
          transform: "translateX(-50%)",
          width: 300,
          height: 140,
          borderRadius: "50%",
          background: "linear-gradient(to bottom right, #FEF7CD, #F97316, #8B5CF6 80%)",
          boxShadow: "0 0 50px 30px rgba(249, 115, 22, 0.2)",
          opacity: 0.8,
          zIndex: -2,
          filter: "blur(10px)",
        }}
      />

      <header className="border-b border-gray-100 bg-white/90 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between relative">
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
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span>
                  You're in a therapy session with Sky — your AI companion 💙
                </span>
                <div className="flex items-center gap-1 text-skyhug-500">
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
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleEndSession}
            >
              End Chat & Continue
            </Button>
          )}
        </div>
      </header>

      <div className="flex-grow max-w-3xl mx-auto px-4 w-full">
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
