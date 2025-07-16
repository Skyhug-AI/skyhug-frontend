import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTherapist } from "@/context/TherapistContext";
import SessionIntro from "@/components/session/SessionIntro";
import SessionRoom from "@/components/session/SessionRoom";
import { ArrowLeft, PanelRight, X, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CloudBackground from "@/components/CloudBackground";
import Header from "@/components/Header";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import SidePanel from "@/components/session/SidePanel";
import BreathingExercise from "@/components/session/BreathingExercise";
import { useConfetti } from "@/hooks/useConfetti";
import { toast } from "@/hooks/use-toast";

const SessionPage = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const {
    createOrStartActiveSession,
    getActiveSessionIdAndTherapist,
    endConversation,
    currentTherapist,
    activeConversationId,
    isLoadingSession,
  } = useTherapist();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isBreathingExerciseOpen, setIsBreathingExerciseOpen] = useState(false);
  const navigate = useNavigate();
  const { triggerConfetti } = useConfetti();

  const handleTestConfetti = () => {
    triggerConfetti();
    toast({
      title: "🎉 Calm Points Earned!",
      description: "You've earned calm points for completing an activity!",
    });
  };

  // Memoize this function to prevent unnecessary rerenders
  const handleStartSession = useCallback(async () => {
    console.log("🚀 Starting new therapy session");
    await createOrStartActiveSession();
    setIsSessionStarted(true);
  }, []);

  // First fetch active session info if it exists
  useEffect(() => {
    getActiveSessionIdAndTherapist();
    handleStartSession();
  }, []);

  const handleEndSession = async () => {
    await endConversation();
    navigate("/session-summary");
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const toggleBreathingExercise = () => {
    setIsBreathingExerciseOpen(!isBreathingExerciseOpen);
  };

  if (isLoadingSession || !isSessionStarted) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative bg-white overflow-hidden">
      <CloudBackground variant="subtle" />
      
      {/* Fixed header section */}
      <div className="sticky top-0 z-50 bg-white">
        <Header />

        {/* {isSessionStarted && (
          <div className="border-b border-gray-100 bg-white/90 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span>
                    You're in a session with {currentTherapist?.name ?? "Sky"} --
                    your AI therapy companion 💙
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
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                  onClick={toggleBreathingExercise}
                >
                  <Wind className="h-4 w-4 mr-2" />
                  Breathing
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={toggleSidePanel}
                >
                  {isSidePanelOpen ? (
                    <X className="h-4 w-4 mr-2" />
                  ) : (
                    <PanelRight className="h-4 w-4 mr-2" />
                  )}
                  {isSidePanelOpen ? "Close Panel" : "Open Panel"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={handleEndSession}
                >
                  End Chat & Continue
                </Button>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {/* {!isSessionStarted ? (
          <div className="max-w-3xl mx-auto px-4 w-full">
            <SessionIntro onStartSession={handleStartSession} />
          </div>
        ) : ( */}
        {isSessionStarted && (
          <div className="w-full h-full flex relative z-10">
            <ResizablePanelGroup direction="horizontal" className="w-full">
              <ResizablePanel
                defaultSize={isSidePanelOpen ? 60 : 100}
                minSize={30}
              >
                <SessionRoom />
              </ResizablePanel>

              {isSidePanelOpen && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel
                    defaultSize={40}
                    minSize={20}
                    className="border-l border-gray-200 h-screen overflow-hidden bg-white"
                  >
                    <div className="h-screen overflow-y-auto">
                      <SidePanel />
                    </div>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </div>
        )}
        {/* )} */}
      </div>

      <BreathingExercise
        isOpen={isBreathingExerciseOpen}
        onClose={() => setIsBreathingExerciseOpen(false)}
      />
    </div>
  );
};

export default SessionPage;
