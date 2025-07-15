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
    <div className="h-screen flex flex-col bg-white">
      <CloudBackground variant="subtle" />
      
      {/* Fixed header section */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <Header />
      </div>

      {/* Main content area - takes remaining space below header */}
      <div className="flex-1 flex overflow-hidden">
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
