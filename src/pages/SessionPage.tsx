
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import SessionIntro from "@/components/session/SessionIntro";
import SessionRoom from "@/components/session/SessionRoom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SessionBackgroundEffects from "@/components/session/SessionBackgroundEffects";

const SessionPage = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const { clearMessages, endConversation } = useTherapist();
  const navigate = useNavigate();

  // Memoize this function to prevent unnecessary rerenders
  const handleStartSession = useCallback(() => {
    setIsSessionStarted(true);
  }, []);

  // Use separate useEffect to handle one-time initialization
  useEffect(() => {
    // This will run once when the component mounts
    const initSession = async () => {
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
    <div
      className="min-h-screen flex flex-col relative"
      // A strong, visible, multi-stop blue-purple gradient for clarity
      style={{
        background:
          "linear-gradient(135deg, #D3E4FD 0%, #B5CFFF 30%, #E5DEFF 70%, #FFF 100%)",
      }}
    >
      <SessionBackgroundEffects />
      <header className="border-b border-gray-100 bg-white/90 sticky top-0 z-50 shadow-sm">
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
