import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import SessionIntro from "@/components/session/SessionIntro";
import SessionRoom from "@/components/session/SessionRoom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const SessionPage = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const { clearMessages, endConversation } = useTherapist();
  const navigate = useNavigate();

  const handleStartSession = useCallback(() => {
    console.log("🚀 Starting new therapy session");
    setIsSessionStarted(true);
  }, []);

  useEffect(() => {
    const initSession = async () => {
      console.log("✨ Initializing session - clearing messages");
      await clearMessages();
    };

    initSession();
  }, []);

  const handleEndSession = async () => {
    await endConversation();
    navigate("/session-summary");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <header className="border-b border-border bg-background/90 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {isSessionStarted && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
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

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isSessionStarted && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/90 hover:bg-primary/10"
                onClick={handleEndSession}
              >
                End Chat & Continue
              </Button>
            )}
          </div>
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
